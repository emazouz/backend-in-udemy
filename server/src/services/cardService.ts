import {
  IAddItemToCard,
  ICheckOut,
  IClearCard,
  ICreateCardForUser,
  IDeleteItemToCard,
  IGetActiveCardForUser,
  IUpdateItemToCard,
} from "../interfaces/interfaceCard";
import cardModil from "../models/cardModel";
import orderModel, { IOrderItem } from "../models/orderModel";
import productModel from "../models/productModel";

const createCardForUser = async ({ userId }: ICreateCardForUser) => {
  try {
    const newCard = await cardModil.create({ userId, totalAmount: 0 });
    return newCard; // No need to call save() after create()
  } catch (err) {
    console.error("Error creating card:", err);
    throw new Error("Failed to create card"); // Throw an error for handling upstream
  }
};

export const getActiveCardForUser = async ({
  userId,
}: IGetActiveCardForUser) => {
  try {
    let card = await cardModil.findOne({ userId });

    if (!card) {
      card = await createCardForUser({ userId });
    }

    return card;
  } catch (err) {
    console.error("Error fetching card:", err); // Log the error for debugging
    return null; // Use null instead of an empty string for clarity
  }
};

export const addItemToCard = async ({
  userId,
  productId,
  quantity,
}: IAddItemToCard) => {
  try {
    // Fetch the active cart for the user
    const card = await getActiveCardForUser({ userId });

    if (!card) {
      return { data: "Active cart not found for the user", statusCode: 404 };
    }

    // Check if the product already exists in the cart
    const existsInCard = card.itemsCard.find(
      (e) => e.product.toString() === productId
    );

    if (existsInCard) {
      return {
        data: "This product already exists in the cart",
        statusCode: 400,
      };
    }

    // Fetch the product details to check stock and price
    const product = await productModel.findById(productId);

    if (!product) {
      return { data: "Product not found", statusCode: 404 };
    }

    // Check if the requested quantity exceeds the stock
    if (parseInt(quantity) > product.stock) {
      return {
        data: "Insufficient stock for the requested quantity",
        statusCode: 400,
      };
    }

    // Add the price of the product to the total amount in the cart
    card.totalAmount += product.price * parseInt(quantity);

    // Add the item to the cart
    card.itemsCard.push({
      product: productId,
      unitPrice: product.price,
      quantity: parseInt(quantity),
    });

    // Save the updated cart
    const updatedCard = await card.save();

    return { data: updatedCard, statusCode: 201 };
  } catch (error) {
    // Handle unexpected errors
    console.error("Error adding item to cart:", error);
    return { data: "An unexpected error occurred", statusCode: 500 };
  }
};

export const updateItemToCard = async ({
  userId,
  productId,
  quantity,
}: IUpdateItemToCard) => {
  try {
    // Fetch the active cart for the user
    const card = await getActiveCardForUser({ userId });

    if (!card) {
      return { data: "Active cart not found for the user", statusCode: 404 };
    }

    // Check if the product already exists in the cart
    const existsInCard = card.itemsCard.find(
      (e) => e.product.toString() === productId
    );

    if (!existsInCard) {
      return {
        data: "This product is not exists in the cart",
        statusCode: 400,
      };
    }

    // Fetch the product details to check stock and price
    const product = await productModel.findById(productId);

    if (!product) {
      return { data: "Product not found", statusCode: 404 };
    }

    // Check if the requested quantity exceeds the stock
    if (parseInt(quantity) > product.stock) {
      return {
        data: "Insufficient stock for the requested quantity",
        statusCode: 400,
      };
    }

    existsInCard.quantity = parseInt(quantity);
    // Add the price of the product to the total amount in the cart
    let total = card.itemsCard
      .filter((e) => e.product !== productId)
      .reduce((sum, acc) => {
        sum += acc.unitPrice * acc.quantity;
        return sum;
      }, 0);
    total += existsInCard.quantity * existsInCard.unitPrice;
    card.totalAmount = total;
    // Save the updated cart
    const updatedCard = await card.save();

    return { data: updatedCard, statusCode: 201 };
  } catch (error) {
    // Handle unexpected errors
    console.error("Error adding item to cart:", error);
    return { data: "An unexpected error occurred", statusCode: 500 };
  }
};

export const deleteItemToCard = async ({
  userId,
  productId,
}: IDeleteItemToCard) => {
  try {
    const card = await getActiveCardForUser({ userId });
    if (!card) {
      return { data: "Active cart not found for the user", statusCode: 404 };
    }

    // Check if the product already exists in the cart
    const existsInCard = card.itemsCard.find(
      (e) => e.product.toString() === productId
    );

    if (!existsInCard) {
      return {
        data: "This product is not exists in the cart",
        statusCode: 400,
      };
    }

    const anotherItem = card.itemsCard.filter(
      (e) => e.product.toString() !== productId
    );
    const total = anotherItem.reduce((sum, acc) => {
      sum += acc.unitPrice * acc.quantity;
      return sum;
    }, 0);
    card.itemsCard = anotherItem;
    card.totalAmount = total;
    // Save the updated cart
    const updatedCard = await card.save();

    return { data: updatedCard, statusCode: 201 };
  } catch (err) {
    console.error("Error deleting item ", err);
    return { data: "Error deleting", statusCode: 400 };
  }
};

export const clearCard = async ({ userId }: IClearCard) => {
  try {
    const card = await getActiveCardForUser({ userId });

    if (!card) {
      return { data: "Card not found", statusCode: 404 }; // Handle case where card doesn't exist
    }

    card.itemsCard = [];
    card.totalAmount = 0;
    const updatedCard = await card.save();

    return { data: updatedCard, statusCode: 200 };
  } catch (err) {
    console.error("Error unloading the card:", err); // Log the error for debugging
    return { data: "Error clearing", statusCode: 400 }; // Provide a clearer error message
  }
};

export const checkOut = async ({ userId, address }: ICheckOut) => {
  try {
    const card = await getActiveCardForUser({ userId });
    if (!card) {
      return { data: "Active cart not found for the user", statusCode: 404 };
    }

    const orderItems: IOrderItem[] = [];
    for (const item of card.itemsCard) {
      const product = await productModel.findById(item.product);
      if (!product) {
        return { data: "the product not found", statusCode: 400 };
      }
      const orderItem: IOrderItem = {
        productTitle: product.title,
        productImage: product.image,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      };
      orderItems.push(orderItem);
    }

    const order = await orderModel.create({
      userId,
      OrderItem: orderItems,
      address,
      total: card.totalAmount,
    });

    await order.save();
    card.status = "Completed";
    await card.save();
    return { data: order, statusCode: 200 };
  } catch (err) {
    console.error("Error occurred during payment ", err);
    return { data: "Error in checkout", statusCode: 400 };
  }
};
