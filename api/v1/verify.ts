import { NowRequest, NowResponse } from "@vercel/node";
import { getVerificationRequestByPollId } from "../../data/verificationRequest";
import { zonedTimeToUtc, format, utcToZonedTime } from "date-fns-tz";

import { isAfter, isBefore, parseISO } from 'date-fns'
import { getSessionByUserId } from "../../data/session";

export default async function (req: NowRequest, res: NowResponse) {

    if (req.method === "POST") {
        if(req.body.poll_id && req.body.poll_id !== ""){

            let dateTime = zonedTimeToUtc(new Date(), "Asia/Kolkata")
            const data = await getVerificationRequestByPollId(req.body.poll_id);
            res.statusCode = 200

            let expiryDate = parseISO(data.expires_at)
            if(data === "Empty"){
                res.send({ message:"EMpty" })
            }
            else if(data ){
                if(isBefore(expiryDate , dateTime)){
                    res.send({
                        verification_status:"Expired",
                        token:null
                    })    
                }
                if(data.is_verified === false && isAfter(expiryDate , dateTime) ){
                    res.send({
                        verification_status:"Pending",
                        token:null
                    }) 
                }
                if(data.is_verified && isAfter(expiryDate , dateTime) ){
                    let session = await getSessionByUserId(data.user.id)
                    if(session){
                        res.send({
                            verification_status:"Verified",
                            token:session.token
                        }) 
                    }
                    else { res.send({ message: "No Session for this User" }) }
                }
            }else{
                res.statusCode = 502
                res.send({ message:"No Data From Api" })
            }
            return 
        }
        res.statusCode = 400
        res.send({ message: "Missing Poll_id" });
        return;
    }
    if(req.method === "GET"){
        res.statusCode = 200
        res.send({ message: "GET method" });
        return
    }
}