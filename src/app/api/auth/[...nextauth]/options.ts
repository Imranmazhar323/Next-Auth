import { NextAuthOptions } from "next-auth";
import CredentialProviders from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {};
