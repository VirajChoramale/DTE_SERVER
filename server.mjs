import express from "express";
import cluster from "node:cluster";
import { cpus } from "node:os";
import cors from "cors";
import { configDotenv } from "dotenv";
import User from "./src/routes/User.mjs";
import Institute from "./src/routes/Institute.mjs";
import DataStream from "./src/routes/DataStream.mjs";

import Desk from "./src/routes/Desk.mjs";
import Common from "./src/routes/Common.mjs";
import { Auth_req, verifyToken } from "./src/middleware/Auth.mjs";
import { bcrypt_text } from "./src/utility/bcrypt_js.mjs";
import { SendGmail } from "./src/utility/sendGmail.mjs";
import { collectDefaultMetrics, register, Histogram } from "prom-client";
import responseTime from "response-time";
import { time } from "node:console";
import { executeReadQuery } from "./src/db/db_operation.mjs";
configDotenv();
const app = express();

const PORT = process.env.PORT;
const KeyGen = async () => {
  const key = "oYkI2v4ObFxrP/9GGtxdsxnqtyk9ZITxbhX4WFecQoI=";

  return key;
};
let activeWorkers = new Map();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers for each available CPU
  const availableCPUs = [1]//cpus();

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
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
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
    res.json({ key: await KeyGen() });
  });
  app.use("/auth", User, () => {});
  //Institute Route
  app.use("/Institute", verifyToken, Auth_req("INST"), Institute, () => {});
  //Commo Route
  app.use("/Common", verifyToken, Common, () => {});
  //DataStreamPipeline
  app.use("/DataPipeline", verifyToken, DataStream);

  app.use("/Desk", Desk, () => {});
  app.post("/testHeader", (req, res) => {
    res.setHeader("Authorization", `Bearer ${10012}`);
    res.send("token set");
  });

  app.get("/gmail", async (req, res) => {
    res.send(
      await SendGmail(2, "viraj.choramale@bynaric.in", ["Viraj", "test"])
    );
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

  app.listen(PORT, () => {
    console.log(`server started on ${PORT} ${process.pid}`);
  });
}
