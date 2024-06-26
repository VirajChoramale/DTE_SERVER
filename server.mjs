import express from "express";
import cluster from "node:cluster";
import cookieParser from "cookie-parser";
import { cpus } from "node:os";
import cors from 'cors'
import { configDotenv } from "dotenv"; 
import { verifyToken,Auth_req } from "./src/middleware/Auth.mjs";
import { executeReadQuery, executeWriteQuery } from "./src/db/db_operation.mjs";
import User from "./src/routes/User.mjs"
import Institute from './src/routes/Institute.mjs'
import fs from "fs";
import { sendOtpSMS } from "./src/utility/otp.mjs";
import { read_file } from "./src/utility/Excel.mjs";
configDotenv();
const app = express();
app.use(cors({
  //origin:"http://http://192.168.2.244:3001:3001",
  //credentials: true
   }));
const PORT = process.env.PORT;
app.use(cookieParser());
let activeWorkers = new Map();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers for each available CPU
  const availableCPUs = cpus();
 // availableCPUs.forEach((cpu, index) => forkWorker(index));
   for(let i=1; i<2; i++){
    forkWorker(i)
   }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`);
    activeWorkers.delete(worker.id);
    console.log(`Worker ${worker.process.pid} removed from active workers`);
    setTimeout(() => {
      console.log(`new worker count is ${activeWorkers.size}`);
      const availableCPUIndex = cpus().findIndex((cpu, index) => !activeWorkers.has(index));
      if (availableCPUIndex !== -1) {
        forkWorker(availableCPUIndex);
      }
    }, 1000); // Add a slight delay before restarting
  });

  function forkWorker(cpuIndex) {
    const worker = cluster.fork({ CPU_INDEX: cpuIndex });
    activeWorkers.set(worker.id, cpuIndex);
    console.log(`Worker ${worker.process.pid} started on CPU ${cpuIndex} and added to active workers`);
  }
} else {
  app.use(express.json());

      app.use("/auth",User,(req,res)=>{
        res.send();
      }); 
      app.use('/Institute',Institute,()=>{

      })
      app.get("/test/:type",(req,res)=>{
        res.json(req.params.type)
      })
      app.get("/test_c",(req,res)=>{
        res.cookie("test",10123).send();
      })
      app.get("/get_c",(req,res)=>{
       console.log(req.cookies)
      })
    
      app.post("/read_excel", async (req, res) => {
       
        try {
          // Call read_file with the correct file path
          const data = await read_file("./Non-Teaching_vaccancy.xlsx");
          const unique_post=[]
          const insert_data=[];
         
          data.forEach(elem => {
                 if(!elem.post){
                 elem.post=elem.post_marathi
                 }
                if(unique_post.indexOf(elem.post)===-1){
                  unique_post.push(elem.post);
                  const jdata={"post":elem.post,"class":elem.class,"post_name_marathi":elem.post_marathi}
                  insert_data.push(jdata);
                
                } 

           
          });
       
          
      const insert_query=`INSERT INTO designation_master (
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
        
    for(let i=0;i<insert_data.length;i++){
      const idata=[2,insert_data[i].post,insert_data[i]. post_name_marathi,2,insert_data[i].class,0,0, 2,2,58];
      const res=await executeWriteQuery(insert_query,idata);
      console.log(res)
    }
        
        
        } catch (err) {
          console.error('Error:', err);
          res.status(500).send('An error occurred while reading the Excel file.');
        }
      });
      app.post("/data_migration",async(req,res)=>{
                          const read_data=await executeReadQuery("SELECT * FROM `dte_post` GROUP BY post_eng;");
                        
                        const insert_query=`INSERT INTO designation_master (
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
                   let row=0
                            for(let i=0;i<read_data.length;i++){
                          
                          
                            const data=[2,read_data[i].post_eng,read_data[i].post_marathi,read_data[i].gazet_type,read_data[i].class,0,0, 2,2,58];
                         const res=await executeWriteQuery(insert_query,data);
                          console.log(row+=res.affectedRows);
                              
                          }

                        })
  
  
    const server = app.listen(PORT, () => {
    console.log(`server started on ${PORT} ${process.pid}`);
  });


  
}
