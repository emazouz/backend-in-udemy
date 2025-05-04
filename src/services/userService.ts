import userModel from "../models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface IRegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
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

  return { data: generatJwt({ firstName, lastName, email }), statusCode: 200 };
};

interface ILoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: ILoginParams) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "Incorrect email or password!", statusCode: 400 };
  }
  const passwordMatch = bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    return { data: "Incorrect password try again!", statusCode: 400 };
  }
  return {
    data: generatJwt({
      email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
    }),
    statusCode: 200,
  };
};

const generatJwt = (data: any) => {
  return jwt.sign(
    data,
    "c2hjhDS7yDBYeYM4j45wMg7hcY5vovlpFVkrkG9xlLExgf8WUsYbLuTdei760LP1"
  );
};
