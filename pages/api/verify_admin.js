import { SUCCESS_CODE, INTERNAL_SERVER_ERROR_ERROR_CODE, NOT_ALLOWED_ERROR_CODE } from '../../lib/status_codes'

export default async function handler(req, res) {
    const { method } = req;
    switch (method) {
        case "POST":
            try {   
                console.log("\n---VERIFY ADMIN---");
                console.log("Request body: ");
                const body = JSON.parse(req.body);
                console.log(body.email)
                if (body && body.email == process.env.ADMIN_EMAIL) {
                    console.log('Success"');
                    res.status(SUCCESS_CODE).json({ message: 'Verified.' });
                }
                else {
                    throw new Error("Email is not an admin email.");
                }
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