import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request, response: Response) {
  await dbConnect();
  let verifyCode: string;
  try {
    const { username, email, password } = await request.json();

    // Check if a verified user with the same username already exists in the database
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 200 }
      );
    }
    // Check if a user with the same email already exists in the database
    const existingUserByEmail = await UserModel.findOne({ email });
    // Generate a verification OTP
    verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User with the same email already exists",
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.isVerified = false;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiry = new Date();
      expiry.setHours(expiry.getMinutes() + 1);
      // Create a new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    // Send the verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message:
          "User signed up successfully. Please check your email for verification.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error signing up user:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to sign up user. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
