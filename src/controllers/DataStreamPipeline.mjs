//this controller is pipeline for common datafetching for all users like casteMaster, mothertoungeMaster, imageFetch etc(CDN)

import { executeReadQuery } from "../db/db_operation.mjs"
import { readQueries } from "../db/readQueries.mjs"


export const personalDetailsData = async (req,res) => {
    const response = {}
    try {
        
       
        
         response.castes = await executeReadQuery(readQueries.getCasts());
        response.mothertongue = await executeReadQuery(readQueries.getMothertounges());
        response.religion = await executeReadQuery(readQueries.getMothertounges());
        return res.status(200).send(response)
       
    } catch (error) {
        response.error = {
            msg: "SQL error" + error,
            code:402
        }
        return res.status(302).send(response);
    }
}