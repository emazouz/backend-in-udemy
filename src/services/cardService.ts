import cardModil from "../models/cardModel";
import orderModel, { IOrderItem } from "../models/orderModel";
import productModel from "../models/productModel";

interface ICreateCardForUser {
  userId: string;
}

const createCardFroUser = async ({ userId }: ICreateCardForUser) => {
  const newCard = await cardModil.create({ userId, totalAmount: 0 });
  await newCard.save();
  return newCard;
};

interface IGetActiveCardForUser {
  userId: string;
}

export const getActiveCardForUser = async ({
  userId,
}: IGetActiveCardForUser) => {
  let card = await cardModil.findOne({ userId });
  if (!card) {
    card = await createCardFroUser({ userId });
  }
  return card;
};

interface IAddItemToCard {
  userId: string;
  productId: any;
  quantity: string;
}

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

interface IUpdateItemToCard {
  userId: string;
  productId: any;
  quantity: string;
}

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

interface IDeleteItemToCard {
  userId: string;
  productId: string;
}

export const deleteItemToCard = async ({
  userId,
  productId,
}: IDeleteItemToCard) => {
  // TODO: get product
  const card = await getActiveCardForUser({ userId });
  if (!card) {
    return { data: "Active cart not found for the user", statusCode: 404 };
  }
  // TODO: check in product is !== undefaind or null

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
  // TODO: delete item in items card -> ( Array )
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
};

interface IClearCard {
  userId: string;
}

export const clearCard = async ({ userId }: IClearCard) => {
  const card = await getActiveCardForUser({ userId });
  card.itemsCard = [];
  card.totalAmount = 0;
  const updateCard = await card.save();
  return { data: updateCard, statusCode: 200 };
};

interface ICheckOut {
  userId: string;
  address: string;
}

export const checkOut = async ({ userId, address }: ICheckOut) => {
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
};
