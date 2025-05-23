import {
  IAddItemToCard,
  ICheckOut,
  IClearCard,
  ICreateCardForUser,
  IDeleteItemToCard,
  IGetActiveCardForUser,
  IUpdateItemToCard,
} from "../interfaces/interfaceCard";
import cardModel, { CartStatus } from "../models/cardModel";
import orderModel, { IOrderItem } from "../models/orderModel";
import productModel from "../models/productModel";

const createCardForUser = async ({ userId }: ICreateCardForUser) => {
  try {
    const newCard = await cardModel.create({ userId, totalAmount: 0 });
    return newCard; // No need to call save() after create()
  } catch (err) {
    console.error("Error creating card:", err);
    throw new Error("Failed to create card"); // Throw an error for handling upstream
  }
};

export const getActiveCardForUser = async ({
  userId,
  populateProduct,
}: IGetActiveCardForUser) => {
  try {
    // Fetch the active card for the user
    let card = populateProduct
      ? await cardModel
          .findOne({ userId, status: CartStatus.Active })
          .populate("itemsCard.product")
      : await cardModel.findOne({ userId, status: CartStatus.Active });

    if (!card) {
      // If no active card exists, create a new one
      card = await createCardForUser({ userId });
    }

    return card;
  } catch (err) {
    console.error("Error fetching card:", err); // Log the error for debugging
    throw new Error("Failed to fetch active card"); // Explicit error for upstream handling
  }
};

export const addItemToCard = async ({
  userId,
  productId,
  quantity,
}: IAddItemToCard): Promise<{ data: any; statusCode: number }> => {
  try {
    // Fetch the active card for the user
    const card = await getActiveCardForUser({ userId, populateProduct: false });

    if (!card) {
      return { data: "Active cart not found for the user", statusCode: 404 };
    }

    // Check if the product already exists in the cart
    const existsInCard = card.itemsCard.find(
      (item) => item.product.toString() === productId
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
    if (quantity > product.stock) {
      return {
        data: "Insufficient stock for the requested quantity",
        statusCode: 400,
      };
    }

    // Add the price of the product to the total amount in the cart
    card.totalAmount = parseFloat(
      (card.totalAmount + product.price * quantity).toFixed(2)
    );

    // Add the item to the cart
    card.itemsCard.push({
      product: productId,
      unitPrice: parseFloat((product.price * quantity).toFixed(2)), // Ensure price is properly formatted
      quantity,
    });

    // Save the updated cart
    await card.save();

    // Fetch and return the updated cart with products populated
    const updatedCard = await getActiveCardForUser({
      userId,
      populateProduct: true,
    });

    return {
      data: updatedCard,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return { data: "An unexpected error occurred", statusCode: 500 };
  }
};

export const updateItemToCart = async ({
  userId,
  productId,
  quantity,
}: IUpdateItemToCard) => {
  try {
    // Fetch the active cart for the user
    const cart = await getActiveCardForUser({ userId });

    if (!cart) {
      return { data: "Active cart not found for the user", statusCode: 404 };
    }

    // Check if the product already exists in the cart
    const existsInCart = cart.itemsCard.find(
      (item) => item.product.toString() === productId
    );

    if (!existsInCart) {
      return {
        data: "This product does not exist in the cart",
        statusCode: 400,
      };
    }

    // Fetch the product details to check stock and price
    const product = await productModel.findById(productId);

    if (!product) {
      return { data: "Product not found", statusCode: 404 };
    }

    // Check if the requested quantity exceeds the stock
    if (quantity > product.stock) {
      return {
        data: "Insufficient stock for the requested quantity",
        statusCode: 400,
      };
    }

    // Update the unit price based on the product price
    existsInCart.quantity = quantity; // Update the quantity of the item in the cart
    existsInCart.unitPrice = quantity * product.price; // Update the quantity of the item in the cart

    // Calculate the total amount in the cart
    const total = cart.itemsCard.reduce((sum, item) => {
      return sum + item.unitPrice;
    }, 0);

    cart.totalAmount = total;

    // Save the updated cart
    await cart.save();

    // Fetch and return the updated cart with products populated
    const updatedCart = await getActiveCardForUser({
      userId,
      populateProduct: true,
    });

    return {
      data: updatedCart,
      statusCode: 200,
    };
  } catch (error) {
    // Handle unexpected errors
    console.error("Error updating item in cart:", error);
    return { data: "An unexpected error occurred", statusCode: 500 };
  }
};

export const deleteItemToCard = async ({
  userId,
  productId,
}: IDeleteItemToCard) => {
  try {
    const card = await getActiveCardForUser({ userId, populateProduct: true });
    if (!card) {
      return { data: "Active cart not found for the user", statusCode: 404 };
    }

    // Check if the product already exists in the cart
    const existsInCard = card.itemsCard.find(
      (item) => String(item.product._id) === productId
    );
    if (!existsInCard) {
      return {
        data: "This product is not exists in the cart",
        statusCode: 400,
      };
    }

    const anotherItem = card.itemsCard.filter(
      (e) => String(e.product._id) !== productId
    );

    const total = anotherItem.reduce((sum, acc) => {
      sum += acc.unitPrice;
      return sum;
    }, 0);
    card.itemsCard = anotherItem;
    card.totalAmount = total;
    // Save the updated cart
    await card.save();

    // Fetch and return the updated cart with products populated
    const updatedCard = await getActiveCardForUser({
      userId,
      populateProduct: true,
    });

    return {
      data: updatedCard,
      statusCode: 200,
    };
  } catch (err) {
    console.error("Error deleting item ", err);
    return { data: "Error deleting", statusCode: 400 };
  }
};

export const cleanCard = async ({ userId }: IClearCard) => {
  try {
    const card = await getActiveCardForUser({ userId, populateProduct: true });

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
    const card = await getActiveCardForUser({ userId, populateProduct: false });
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
    card.status = CartStatus.Completed;
    await card.save();
    return { data: order, statusCode: 200 };
  } catch (err) {
    console.error("Error occurred during payment ", err);
    return { data: "Error in checkout", statusCode: 400 };
  }
};
