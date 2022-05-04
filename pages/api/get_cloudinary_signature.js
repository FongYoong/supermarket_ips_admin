// CLOUDINARY_NAME
// CLOUDINARY_ENV_VAR
// CLOUDINARY_API_KEY
// process.env.CLOUDINARY_API_SECRET
const cloudinary = require('cloudinary').v2;
import { SUCCESS_CODE, INTERNAL_SERVER_ERROR_ERROR_CODE, NOT_ALLOWED_ERROR_CODE } from '../../lib/status_codes'

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
        case "POST":
            try {   
                console.log("\n---GET CLOUDINARY SIGNATURE---");
                const timestamp = Math.round((new Date).getTime()/1000);
                const signature = cloudinary.utils.api_sign_request({
                    timestamp: timestamp,
                }, process.env.CLOUDINARY_API_SECRET);
                
                console.log('Timestamp: ',timestamp);
                console.log('Signature: ', signature);
        
                res.send({
                    signature: signature,
                    timestamp: timestamp,
                });

            } catch(e) {
                console.error("Request error", e);
                res.status(INTERNAL_SERVER_ERROR_ERROR_CODE).json({ message: 'Unauthorized user!' });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(NOT_ALLOWED_ERROR_CODE).end(`Method ${method} Not Allowed`);
            break;
    }
}