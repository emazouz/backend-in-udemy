import { useAuthContext } from "context/auth/AuthContext";
import { useEffect } from "react";

export default function MyOrders() {
  const { getMyOrders, orders } = useAuthContext();

  useEffect(() => {
    getMyOrders();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map(({ _id, OrderItem, address, total }: {_id: string, OrderItem: [], address: string, total: number}) => (
              <div key={_id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600">Order #{_id}</p>
                    {/* <p className="text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </p> */}
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {address}
                  </span>
                </div>

                <div className="border-t border-b py-4">
                  {
                  OrderItem.map((item: any, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                     
                    <div className="flex items-center gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productTitle}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium text-lg text-red-600">{item.productTitle}</h3>
                          <p className="text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">
                        ${(item.unitPrice).toFixed(2)}
                      </span> 
                      
                    </div>
                  ))
                 }
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Shipping Address:</span>
                    <span>{address}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 bg-green-100 p-3 rounded-lg">
                    <span className="font-semibold text-lg uppercase">Total Amount</span>
                    <span className="font-bold text-lg">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
