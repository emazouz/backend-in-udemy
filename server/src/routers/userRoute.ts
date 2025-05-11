import express from "express";
import { login, register } from "../services/userService";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { data, statusCode } = await register({
    firstName,
    lastName,
    email,
    password,
  });
  res.status(statusCode).json(data);
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, statusCode } = await login({ email, password });
  res.status(statusCode).json(data);
});

export default router;
