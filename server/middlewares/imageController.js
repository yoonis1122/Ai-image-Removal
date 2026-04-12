import fs from "fs";
import userModel from "../models/userModel.js";
import { removeBackground } from "@imgly/background-removal-node";

//controller function to remove bg from image

const removeBgImage = async (req, res) => {
  try {
    // ✅ FIX: ka qaado middleware (JWT), ha ka qaadin req.body
    const clerkId = req.clerkid;

    let user = await userModel.findOne({ clerkId });

    if (!user) {
      user = await userModel.create({
          clerkId: clerkId,
          email: "unknown@email.com",
          photo: "https://www.gravatar.com/avatar/?d=mp",
          firstName: "User",
          lastName: "",
          creditBalance: 1000
      });
    }

    if (user.creditBalance === 0) {
      return res.json({
        success: false,
        message: "no credits balance",
        creditBalance: user.creditBalance,
      });
    }

    const imagePath = req.file.path;

    // Convert local window absolute path directly into Blob memory to bypass library URI parsing bug
    const imageBuffer = fs.readFileSync(imagePath);
    const inputBlob = new Blob([imageBuffer], { type: req.file.mimetype });

    // Removed background locally using small model to prevent UI hang appearance on slower CPUs
    const blob = await removeBackground(inputBlob, { debug: true, model: 'small' });
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const base64Image = buffer.toString("base64");
    // Background removal node outputs PNG by default
    const resultImage = `data:image/png;base64,${base64Image}`;

    console.log("Successfully generated base64!", { size: resultImage.length });
    
    // ✅ FIX: user_ → user._id
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    console.log("Sending response to frontend...");
    res.json({
      success: true,
      message: "background removed successfully",
      resultImage,
      creditBalance: user.creditBalance - 1,
    });
  } catch (error) {
    console.error("Backend Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { removeBgImage };
