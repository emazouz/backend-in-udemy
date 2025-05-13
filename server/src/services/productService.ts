import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: "Laptop Pro",
        price: 200.0,
        stock: 22,
        image:
          "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        title: "Wireless Headphones",
        price: 120.0,
        stock: 10,
        image:
          "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
      {
        title: "Smartwatch",
        price: 300.0,
        stock: 20,
        image:
          "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300",
      },
    ];

    const existingProduct = await getAllProducts();
    if (existingProduct.length == 0) {
      await productModel.insertMany(products);
    }
  } catch (err) {
    console.error("Error added product:", err);
    throw new Error("Failed to add product");
  }
};
