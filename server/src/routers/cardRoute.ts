import express, { Request } from "express";
import {
  addItemToCard,
  getActiveCardForUser,
  updateItemToCart,
  deleteItemToCard,
  cleanCard,
  checkOut,
} from "../services/cardService";
import validateJWT from "../middleware/validateJWT";
import { ExtendRequest } from "../interfaces/extendRequest";

const router = express.Router();

router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const card = await getActiveCardForUser({ userId, populateProduct: true });
  res.status(200).send(card);
});

router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const response = await addItemToCard({
    userId,
    productId,
    quantity,
  });
  res.status(response.statusCode).json(response.data);
});

router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user?._id;
  const { productId, quantity } = req.body;
  const response = await updateItemToCart({
    userId,
    productId,
    quantity,
  });
  res.status(response.statusCode).send(response.data);
});

// ! delete item to cart

router.delete(
  "/items/:productId",
  validateJWT,
  async (req: ExtendRequest, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const response = await deleteItemToCard({ userId, productId });
    res.status(response.statusCode).send(response.data);
  }
);

// ! clear cart

router.delete("/", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const response = await cleanCard({ userId });
  res.status(response.statusCode).send(response.data);
});

router.post("/checkout", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const { address } = req.body;
  const response = await checkOut({ userId, address });
  res.status(response.statusCode).send(response.data);
});

export default router;
