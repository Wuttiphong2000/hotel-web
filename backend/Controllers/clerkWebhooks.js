// controllers/clerkWebhooks.js
import User from "../Models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // 1. สร้าง Webhook instance ด้วย secret จาก .env
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 2. เตรียมหัวข้อจาก request สำหรับตรวจสอบความถูกต้อง
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), headers);
    // Getting Data From request body
    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email:
            data.email_addresses && data.email_addresses.length > 0
              ? data.email_addresses[0].email_address
              : null,
          username: [data.first_name, data.last_name]
            .filter(Boolean)
            .join(" ")
            .trim(),
          image: data.image_url,
        };
        await User.create(userData);
        console.log(`User created: ${userData._id}`);
        break;
      }
      case "user.updated": {
        const userData = {
          email:
            data.email_addresses && data.email_addresses.length > 0
              ? data.email_addresses[0].email_address
              : null,
          username: [data.first_name, data.last_name]
            .filter(Boolean)
            .join(" ")
            .trim(),
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        console.log(`User updated: ${data.id}`);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log(`User deleted: ${data.id}`);
        break;
      }
      default:
        break;
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Clerk Webhook Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
