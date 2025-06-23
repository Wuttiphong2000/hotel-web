import User from '../Models/User.js'
import { Webhook } from 'svix'

const clerkWebhooks = async (req,res) => {
    try {
        // Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const payload = req.body.toString("utf8");
        // Verifying Headers
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const evt = whook.verify(payload, headers); // ✅ evt = { data, type }
        // Getting Data From request body
          const { data, type } = evt;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + ' ' + data.last_name,
            image: data.image_url,
        }

        // Switch Cases for different Event
        switch (type) {
            case "user.created":{
                await User.create(userData);
                break;
            }
            case "user.updated":{
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }
            case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        } 
        res.json({success:true, message: "Webhook Recieved"})
    } catch (error) {
        console.error(error.message);
        res.json({success:false, message:error.message})
    }
}

export default clerkWebhooks;