import express, { Request } from "express";
import { getActiveCardForUser } from "../services/cardService";
import validatJWT from "../middleware/validatJWT";

const router = express.Router();
interface ExtendRequest extends Request {
  user?: any;
}
router.get("/", validatJWT, async (req: ExtendRequest, res) => {
  const userId = req.user._id;
  const card = await getActiveCardForUser({ userId });
  res.status(200).send(card);
});

export default router;

/**
 * token user
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJ5b3VlbnMiLCJsYXN0TmFtZSI6Im1hem91eiIsImVtYWlsIjoibWF6b3V6QGVtYXpvdXouY29tIiwiaWF0IjoxNzQ2NzI0MzI4fQ.FsEYpanMjGU9sKp2vMA1imabTH_jH-VEjNyDYwyaUHk
 */
