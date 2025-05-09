//? order items                  order
//* productTitle                 [ order items ]
//* productImage                 address
//* unitPrice                    total
//* quantity                     userId

import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IOrderItem {
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}
export interface IOrder extends Document {
  userId: string | ObjectId;
  OrderItem: IOrderItem[];
  address: string;
  total: number;
}
export const orderItemSchema = new Schema<IOrderItem>({
  productTitle: { type: String, required: true },
  productImage: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});
export const orderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  OrderItem: [orderItemSchema],
  address: { type: String, required: true },
  total: { type: Number, required: true },
});

const orderModel = mongoose.model<IOrder>("Order", orderSchema);
export default orderModel;
