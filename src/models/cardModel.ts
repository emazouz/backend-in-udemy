import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IProduct } from "./productModel";

let statusSchema = ["Active", "Complated"];

interface Items {
  product: IProduct;
  unitPrice: number;
  quantity: number;
}

const itemsSchema = new Schema<Items>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

interface ICard extends Document {
  userId: ObjectId | string;
  itemsCard: Items[];
  totalAmount: number;
  status: "Active" | "Complated";
}
const cardSchema = new Schema<ICard>({
  userId: { type: Schema.Types.ObjectId, required: true },
  itemsCard: [],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: statusSchema},
});

const cardModil = mongoose.model<ICard>("Card", cardSchema);

export default cardModil;
