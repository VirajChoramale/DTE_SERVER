import express from "express";
import cluster from "node:cluster";
import { cpus } from "node:os";
import cors from "cors";
import { configDotenv } from "dotenv";
import User from "./src/routes/User.mjs";
import Institute from "./src/routes/Institute.mjs";
import DataStream from "./src/routes/DataStream.mjs";
import readXlsxFile from "read-excel-file/node";
import Desk from "./src/routes/Desk.mjs";
import Common from "./src/routes/Common.mjs";
import { Auth_req, verifyToken } from "./src/middleware/Auth.mjs";
import { bcrypt_text } from "./src/utility/bcrypt_js.mjs";
import { SendGmail } from "./src/utility/sendGmail.mjs";
import { collectDefaultMetrics, register, Histogram } from "prom-client";
import responseTime from "response-time";
import { count, time } from "node:console";
import { executeReadQuery, executeWriteQuery } from "./src/db/db_operation.mjs";
import { deleteFromnTable, update_table } from "./src/utility/Sql_Querries.mjs";
import { writeQueries } from "./src/db/writeQueries.mjs";
import { genCryptoRandom } from "./src/utility/GenRandomKey.mjs";

configDotenv();
const app = express();

const PORT = process.env.PORT||8080;

let activeWorkers = new Map();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers for each available CPU
  const availableCPUs = [1]; // cpus();

  availableCPUs.forEach((cpu, index) => forkWorker());

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`
    );
    activeWorkers.delete(worker.id);
    console.log(`Worker ${worker.process.pid} removed from active workers`);
    setTimeout(() => {
      console.log(`new worker count is ${activeWorkers.size}`);
      const availableCPUIndex = cpus().findIndex(
        (cpu, index) => !activeWorkers.has(index)
      );
      if (availableCPUIndex !== -1) {
        forkWorker(availableCPUIndex);
      }
    }, 1000); // Add a slight delay before restarting
  });

  function forkWorker(cpuIndex) {
    const worker = cluster.fork({ CPU_INDEX: cpuIndex });
    activeWorkers.set(worker.id, cpuIndex);
    console.log(
      `Worker ${worker.process.pid} started on CPU ${cpuIndex} and added to active workers`
    );
  }
} else {
  app.use(express.json());
  collectDefaultMetrics();
  const reqRest = new Histogram({
    name: "http_express_req_res_time",
    help: "Req times",
    labelNames: ["method", "route", "status_code"],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
  });
  app.use(
    responseTime((req, res, time) => {
      reqRest
        .labels(req.method, req.url, res.statusCode.toString())
        .observe(time);
    })
  );
  app.use(
    cors({
      origin:true, //["http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true, // Allow cookies for cross-origin requests (if applicable)
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "token",
        "role",
        "is_inst",
      ],
      exposedHeaders: ["token", "Authorization", "role", "is_inst"],
      // Allowed headers
    })
  );
  app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", register.contentType);
    const metrics = register.metrics();
    res.send(metrics);
  });
  app.post("/getKeyRedux", async (req, res) => {
    //sending key for redux
    res.json({ key: key });
  });
  app.use("/auth", User, () => {});
  //Institute Route
  app.use(
    "/Institute",
    verifyToken,
    Auth_req(["INSTITUTE"]),
    Institute,
    () => {}
  );
  //Commo Route
  app.use(
    "/Common",
    verifyToken,
    Auth_req(["INSTITUTE", "RO", "MSBTE", "DESK"]),
    Common,
    () => {}
  );
  //DataStreamPipeline
  app.use(
    "/DataPipeline",

    verifyToken,
    DataStream
  );

  app.use("/Desk", Desk, () => {});

  app.get("/test_mail", verifyToken, async (req, res) => {
    const gmail = req.body.gmail;
    res.send(await SendGmail(2, gmail, ["Viraj", "test"]));
  });

  app.post("/bcrypt_text", async (req, res) => {
    const bcrypted_text = bcrypt_text(req.body.text);
    res.send({
      encrypted_text: bcrypted_text,
    });
  });
  app.get("/test", (req, res) => {});

  app.get("/server_running", (req, res) => {
    res.status(200).send({
      msg: `Server Running on Port==>${PORT}`,
    });
  });
  app.get("/mapping", async (req, res) => {
    try {
      const rows = await readXlsxFile("./certification_mapping.xlsx");
      const header = rows[0];
      const data = rows.slice(1).map((row) => {
        return row.reduce((obj, value, index) => {
          obj[header[index]] = value;
          return obj;
        }, {});
      });

      const desigObj = await Promise.all(
        data.map(async (entry) => {
          const desigDetails = await executeReadQuery(
            `select id from designation_master where designation_name_marathi='${entry.Designation}'`
          );
          return {
            designation_id: desigDetails[0].id,
            police_verification: entry.police_verification,
            medical_certificate: entry.medical_certificate,
            mscit_certificate: entry.mscit_certificate,
            marathi_exemption_order: entry.marathi_exemption_order,
            hindi_exemption_order: entry.hindi_exemption_order,
            steno_speed_certificate: entry.english_typing_certificate,
            marathi_typing_certificate: entry.marathi_typing_certificate,
            english_typing_certificate: entry.english_typing_certificate,
            permanent_certificate: entry.permanent_certificate,
            PRT_exam_ceritficate: entry.PRT_exam_ceritficate,
            Sup_Exam_certificate: entry.Sup_Exam_certificate,
            language_exemption: 0,
          };
        })
      );
      desigObj.forEach(async (obj) => {
        const resp = await executeWriteQuery(
          writeQueries.insertTable("designation_and_required_certificate"),
          obj
        );
        console.log(resp);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });

  // app.get("/mapping", async (req, res) => {
  //   const rows = await readXlsxFile("./certification_mapping.xlsx");
  //   const header = rows[0];
  //   const data = rows.slice(1).map((row) => {
  //     return row.reduce((obj, value, index) => {
  //       obj[header[index]] = value;
  //       return obj;
  //     }, {});
  //   });

  //   let desigObj = [];
  //   const reslove = Promise.all(
  //     data.map(async (entry, i) => {
  //       const desigDetails = executeReadQuery(
  //         `select id from designation_master where designation_name_marathi='${entry.Designation}'`
  //       ).then((res) => {
  //         const UpArr = {
  //           designation_id: res[0].id,
  //           police_verification: entry.police_verification,
  //           medical_certificate: entry.medical_certificate,
  //           mscit_certificate: entry.mscit_certificate,
  //           marathi_exemption_order: entry.marathi_exemption_order,
  //           hindi_exemption_order: entry.hindi_exemption_order,
  //           steno_speed_certificate: entry.english_typing_certificate,
  //           marathi_typing_certificate: entry.marathi_typing_certificate,
  //           english_typing_certificate: entry.english_typing_certificate,
  //           permanent_certificate: entry.permanent_certificate,
  //           PRT_exam_ceritficate: entry.PRT_exam_ceritficate,
  //           Sup_Exam_certificate: entry.Sup_Exam_certificate,
  //           language_exemption: 0,
  //         };
  //         desigObj.push(UpArr);
  //       });
  //     })
  //   );

  //   console.log(count(desigObj));
  // });

  app.listen(PORT, () => {
    console.log(`server started on ${PORT} ${process.pid}`);
  });
}
