import { createTransport } from "nodemailer";
import { configDotenv } from "dotenv";
configDotenv();

// Do Not Modify this Code //
const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendMail = async (to, subject, body) => {
  try {
    console.log("in");
    const response = await transporter.sendMail({
      from: "donotreply_mis@dtemaharashtra.gov.in",
      to: "virajchormale71@gmail.com",
      subject: "test",
      html: "test msg",
    });

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
