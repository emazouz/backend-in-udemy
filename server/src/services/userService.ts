import userModel from "../models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ILoginParams, IRegisterParams } from "../interfaces/userInterface";
import orderModel from "../models/orderModel";

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: IRegisterParams) => {
  const findUser = await userModel.findOne({ email });

  if (findUser) {
    return { data: "the user already exist!!", statusCode: 400 };
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });
  await newUser.save();

  return { data: generateJwt({ firstName, lastName, email }), statusCode: 200 };
};

export const login = async ({ email, password }: ILoginParams) => {
  try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return { data: "Incorrect email or password!", statusCode: 400 };
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password); // أضف await هنا
    if (!passwordMatch) {
      return { data: "Incorrect password. Please try again!", statusCode: 400 };
    }

    return {
      data: generateJwt({
        email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
      }),
      statusCode: 200,
    };
  } catch (err) {
    console.error("Login error:", err);
    throw new Error("Failed to login");
  }
};

interface IMyOrders {
  userId: string;
}
export const getMyOrders = async ({ userId }: IMyOrders) => {
  try {
    return {
      data: await orderModel.find({ userId }),
      statusCode: 200,
    };
  } catch (err) {
    throw err;
  }
};

const generateJwt = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || "");
};
