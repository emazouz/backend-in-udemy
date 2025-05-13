import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IProduct } from "./productModel";

// Define the order statuses as a TypeScript enum for better type safety
export enum CartStatus {
  Active = "Active",
  Completed = "Completed",
}

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

// Define the Card interface
interface ICard extends Document {
  userId: ObjectId | string;
  itemsCard: Items[];
  totalAmount: number;
  status: CartStatus;
}

const cardSchema = new Schema<ICard>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true }, // Index for better query performance
  itemsCard: [itemsSchema],
  totalAmount: { type: Number, required: true, default: 0 }, // Default value for totalAmount
  status: {
    type: String,
    enum: Object.values(CartStatus),
    default: CartStatus.Active,
  }, // Use enum for status
});

// Create the model
const cardModel = mongoose.model<ICard>("Card", cardSchema);

export default cardModel;
