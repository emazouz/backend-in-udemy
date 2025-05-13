import { BASE_URL } from "constant/BasicUrl";
import { useAuthContext } from "context/auth/AuthContext";
import { useCart } from "context/cart/CartContext";
import React, { useState } from "react";
import { useNavigate } from "react-router";
export default function Checkout() {
  const { cartItems, totalAmount } = useCart();
  const { token } = useAuthContext();
  const [formData, setFormData] = useState({
    address: "",
  });
  const navigate = useNavigate();
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
            const response = await fetch(`${BASE_URL}/card/checkout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Use lowercase 'application/json'
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                address: formData.address,
              }),
            });
        
            if (!response.ok) {
              // Handle the response error more gracefully
              const errorData = await response.json(); // Optionally get the error details from the response
              throw new Error(errorData.message || "Failed to add product to cart");
            }
        
            navigate("/order-success");
            // Navigate on successful response
          } catch (error) {
            console.error("Error during checkout:", error); // Log the error for debugging
            // Optionally, you can show an error message to the user
          }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            <div
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full shipping address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-red-600">Price: ${item.price}</p>
                        <p className="text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      ${item.unitPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-red-600">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
