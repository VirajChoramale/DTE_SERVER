import express from "express";
import cluster from "node:cluster";
import { cpus } from "node:os";
import cors from "cors";
import { configDotenv } from "dotenv";
import User from "./src/routes/User.mjs";
import Institute from "./src/routes/Institute.mjs";
import Desk from "./src/routes/Desk.mjs";
import Common from "./src/routes/Common.mjs";
import { Auth_req, verifyToken } from "./src/middleware/Auth.mjs";
import { bcrypt_text } from "./src/utility/bcrypt_js.mjs";
import { SendGmail } from "./src/utility/sendGmail.mjs";
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
  const availableCPUs = [1]; //cpus();

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
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://192.168.3.52:5173",
        "http://192.168.0.109",
        "http://192.168.2.244:5175",
        "http://49.248.37.122:5173",
        "http://49.248.37.122",
      ],
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
  app.post("/getKeyRedux", async (req, res) => {
    //sending key for redux
    res.json({ key: await KeyGen() });
  });
  app.use("/auth", User, () => {});
  app.use("/Institute", verifyToken, Auth_req("INST"), Institute, () => {}); //Institute Route
  app.use("/Common", Common, () => {}); //Institute Route

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
