import { executeReadQuery } from "../db/db_operation.mjs";
import { readQueries } from "../db/readQueries.mjs";
import { sendMail } from "./Gmail.mjs";
export const SendGmail = async (template_id, to_email, variables) => {
  const template = await executeReadQuery(readQueries.getEmailTemplate(), template_id);
  let content = template[0].content;
  for (let i = 0; i < variables.length; i++) {
    content = content.replace(`{${"var" + i}}`, variables[i]);
  }
  const emailResponse = await sendMail(to_email, template[0].subject, content);
  return emailResponse;
};