import express, { query } from "express";
import cluster from "node:cluster";
import cookieParser from "cookie-parser";
import { cpus } from "node:os";
import cors from "cors";
import { configDotenv } from "dotenv";
import { executeReadQuery, executeWriteQuery } from "./src/db/db_operation.mjs";
import User from "./src/routes/User.mjs";
import Institute from "./src/routes/Institute.mjs";
import Desk from "./src/routes/Desk.mjs";
import { read_file } from "./src/utility/Excel.mjs";
import { readQueries } from "./src/db/Queries.mjs";
import { Auth_req,verifyToken } from "./src/middleware/Auth.mjs";
import { bcrypt_text } from "./src/utility/bcrypt_js.mjs";
import { sendMail } from "./src/utility/Gmail.mjs";
import {  SendGmail } from "./src/utility/sendGmail.mjs";
configDotenv();
const app = express();
app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true
  })
);
const PORT = process.env.PORT;
app.use(cookieParser());
let activeWorkers = new Map();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers for each available CPU
  const availableCPUs = cpus();
  // availableCPUs.forEach((cpu, index) => forkWorker(index));
  for (let i = 1; i < 3; i++) {
    forkWorker(i);
  }
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

  app.use("/auth", User, (req, res) => {
    res.send();
  });
  app.use("/Institute",verifyToken,Auth_req("INST"), Institute, () => {});
  app.use("/Desk", Desk, () => { });
  app.post("/logout", (req, res) => {
    res.cookie("uid", {
      expires: new Date(0), 
    });
    res.cookie("oid", {
      expires: new Date(0), 
    });
    res.cookie("eid", {
      expires: new Date(0), 
    });
    
    res.send();
  })
  app.get("/test/:type", (req, res) => {
    res.json(req.params.type);
  });
  app.get("/gmail",async (req, res) => {
    res.send(await SendGmail(2,"viraj.choramale@bynaric.in",["Viraj","test"]));
  });
  app.post("/bcrypt_text", async (req, res) => {
    bcrypt_text
    const bcrypted_text = await bcrypt_text(req.body.text);
    res.send({
      encrypted_text: bcrypted_text
   })
   
  });
  app.get("/test", (req, res) => {});
  app.post("/read_excel", async (req, res) => {
    try {
      // Call read_file with the correct file path
      const data = await read_file("./Non-Teaching_vaccancy.xlsx");
      const insert_query = `INSERT INTO C_class_vaccancy(id, is_inst, inst_code, post_marathi, class, post, sanction, filled, db_id) VALUES (?,  ?, ?, ?, ?, ?, ?, ?, ?)`;

      const json_data = [];
      data.forEach((elem) => {
        json_data.push(elem);
      });

      for (const data of json_data) {
        if (data.post == null) {
          data.post = data.post_marathi;
        }
        const dat = [
          data.id,
          data.is_inst,
          data.inst_code,
          data.post_marathi,
          data.class,
          data.post,
          data.sanctioned,
          data.filled,
          data.vaccant,
          data.db_id,
        ];
        const resp = await executeWriteQuery(insert_query, dat);
        console.log(resp.affectedRows);
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).send("An error occurred while reading the Excel file.");
    }
  });
  app.post("/daddewdfe", async (req, res) => {
    const read_data = await executeReadQuery(
      "SELECT * FROM `dte_post` GROUP BY post_eng;"
    );

    const insert_query = `INSERT INTO designation_master (
                      designation_type, 
                      designation_name, 
                      designation_name_marathi, 
                      gazzet_type, 
                      class, 
                      entry_pay, 
                      entry_pay_level, 
                      appointment_mode, 
                      priority, 
                      total_retired_year
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let row = 0;
    for (let i = 0; i < read_data.length; i++) {
      const data = [
        2,
        read_data[i].post_eng,
        read_data[i].post_marathi,
        read_data[i].gazet_type,
        read_data[i].class,
        0,
        0,
        2,
        2,
        58,
      ];
      const res = await executeWriteQuery(insert_query, data);
      console.log((row += res.affectedRows));
    }
  });

  const server = app.listen(PORT, () => {
    console.log(`server started on ${PORT} ${process.pid}`);
  });
}
