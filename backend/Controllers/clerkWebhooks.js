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

    // 3. ตรวจสอบ webhook ว่าถูกต้องหรือไม่
    await whook.verify(JSON.stringify(req.body), headers);

    // 4. ดึงข้อมูลจาก webhook
    const { data, type } = req.body;

    // 5. ตรวจสอบ email
    const email = data.email_addresses?.[0]?.email_address;
    if (!email) throw new Error("Missing email address from Clerk");

    // 6. เตรียมข้อมูล User สำหรับ MongoDB
    const userData = {
      _id: data.id,
      email,
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "https://default-image.url/avatar.png",
    };

    // 7. จัดการตาม event ประเภทต่าง ๆ
    switch (type) {
      case "user.created":
        await User.findOneAndUpdate({ _id: data.id }, userData, {
          upsert: true,
          new: true,
        });

        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { upsert: true });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

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
