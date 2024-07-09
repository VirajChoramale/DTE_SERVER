import { createTransport } from 'nodemailer'
import { configDotenv } from "dotenv";
import { response } from 'express';
configDotenv();

//Do Not Modify this Code//
const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS 
    }
})

export const sendMail = async (to, subject, body) => {
   console.log(subject)
    const response = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: to,
        subject: "subject",
        html: body
        
    });
    return response;
}

