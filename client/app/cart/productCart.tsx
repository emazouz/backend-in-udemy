import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { useCart } from "context/cart/CartContext";
import { Link } from "react-router";
export default function ProductCart() {
  const {
    cartItems,
    totalAmount,
    updateItemToCart,
    removeFromCart,
    deleteAllItemsToCart,
  } = useCart();

  const handleQuantity = (productId: string, quantity: number) => {
    updateItemToCart(productId, quantity);
  };
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between text-2xl font-semibold p-4 border-b">
          <h2>Shopping Cart</h2>
          <h2
            className="text-red-500 hover:text-red-700 cursor-pointer"
            onClick={deleteAllItemsToCart}
          >
            Delete all
          </h2>
        </div>
        {cartItems.length > 0 ? (
          <div>
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-4  border-b last:border-b-0"
              >
                <div className="flex items-center gap-4 w-1/2">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-gray-600">
                      Price: ${item.price}
                    </p>
                    <p className="text-gray-500">
                      Subtotal: ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      handleQuantity(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantity(item.productId, item.quantity + 1)
                    }
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                <DeleteIcon
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700 font-medium"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-gray-500 text-center">Your cart is empty.</p>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total:</span>
            <span className="text-2xl font-bold">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      <Link to={"/checkout"}>
        <Button variant="contained" className="w-full" disableElevation>
          Checkout to Cart
        </Button>
      </Link>
    </div>
  );
}
