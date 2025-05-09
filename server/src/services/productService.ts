import productModel from "../models/productModel";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: "LapTop Lenevo",
        image:
          "https://imgs.search.brave.com/4J-SaQsnUss3pCYwCbCBf9J_RByxudwr3rPbusJ5EaY/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDYy/NDYzNjMyL3Bob3Rv/L2EtbGVub3ZvLWlk/ZWFwYWQteTUxMHAt/Z2FtaW5nLWxhcHRv/cC10YWtlbi1vbi1t/YXktMTYtMjAxNC5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/YnVSNGRxRkJDekQt/NTh0RXA4S2U0V0lw/MEJDVmtNdkxaT3R2/bmNIU2dPVT0",
        price: 3000,
        stock: 200,
      },
    ];

    const exsitingProduct = await getAllProducts();
    if (exsitingProduct.length == 0) {
      await productModel.insertMany(products);
    }
  } catch (err) {
    console.error("Error added product:", err);
    throw new Error("Failed to add product");
  }
};
