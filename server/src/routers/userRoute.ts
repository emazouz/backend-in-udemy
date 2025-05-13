import express from "express";
import { getMyOrders, login, register } from "../services/userService";
import validateJWT from "../middleware/validateJWT";
import { ExtendRequest } from "../interfaces/extendRequest";

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

router.get("/my-orders", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const orders = await getMyOrders({ userId });
  res.status(200).send(orders);
});

export default router;
