import express, { Request } from "express";
import {
  addItemToCard,
  getActiveCardForUser,
  updateItemToCard,
} from "../services/cardService";
import validatJWT from "../middleware/validatJWT";
import { ExtendRequest } from "../types/extendRequest";

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

export default router;

/**
 * token user
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJ5b3VlbnMiLCJsYXN0TmFtZSI6Im1hem91eiIsImVtYWlsIjoibWF6b3V6QGVtYXpvdXouY29tIiwiaWF0IjoxNzQ2NzI0MzI4fQ.FsEYpanMjGU9sKp2vMA1imabTH_jH-VEjNyDYwyaUHk
 */
