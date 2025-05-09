import express, { Request } from "express";
import {
  addItemToCard,
  getActiveCardForUser,
  updateItemToCard,
  deleteItemToCard,
  clearCard,
  checkOut,
} from "../services/cardService";
import validatJWT from "../middleware/validatJWT";
import { ExtendRequest } from "../interfaces/extendRequest";

const router = express.Router();

router.get("/", validatJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const card = await getActiveCardForUser({ userId });
  res.status(200).send(card);
});

router.post("/items", validatJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const response = await addItemToCard({
    userId,
    productId,
    quantity,
  });
  res.status(response.statusCode).send(response.data);
});

router.put("/items", validatJWT, async (req: ExtendRequest, res) => {
  const userId = req.user?._id;
  const { productId, quantity } = req.body;
  const response = await updateItemToCard({
    userId,
    productId,
    quantity,
  });
  res.status(response.statusCode).send(response.data);
});

// ! delete item to cart

router.delete(
  "/items/:productId",
  validatJWT,
  async (req: ExtendRequest, res) => {
    const userId = req?.user?._id;
    const { productId } = req.params;
    const response = await deleteItemToCard({ userId, productId });
    res.status(response.statusCode).send(response.data);
  }
);

// ! clear cart

router.delete("/", validatJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const response = await clearCard({ userId });
  res.status(response.statusCode).send(response.data);
});

router.post("/checkout", validatJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { address } = req.body;
  const response = await checkOut({ userId, address });
  res.status(response.statusCode).send(response.data);
});

export default router;
