import React, { useEffect, useState } from "react";
import {
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Link
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null); // New
  const { myOrders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filterOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-500" />;
        break;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
        break;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
        break;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
        break;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "Shipped":
        return "bg-blue-500/20 text-blue-400";
      case "Delivered":
        return "bg-green-500/20 text-green-400";
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  const { authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleWriteReview = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!authUser) {
    return navigate("/products");
  }

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Orders
            </h1>
            <p className="text-muted-foreground">
              Track and manage your orders history.
            </p>
          </div>

          {/* Status Filter */}
          <div className="glass-card p-4 mb-8">
            <div className="flex items-center space-x-4 flex-wrap">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-primary" />
                <span className="font-medium">Filter by status:</span>
              </div>
              <div className="flex wrap gap-2">
                {statusArray.map((status) => {
                  return (
                    <button
                      key={status}
                      className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                        statusFilter === status
                          ? "gradient-primary text-primary-foreground"
                          : "glass-card hover:glow-on-hover animate-smooth text-foreground"
                      }`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order List */}
          {filterOrders.length === 0 ? (
            <div className="text-center glass-panel max-w-md mx-auto">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No orders found.
              </h2>
              <p className="text-muted-foreground">
                {statusFilter === "All"
                  ? "You haven't placed any orders yet."
                  : `No orders with status "${statusFilter}" found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filterOrders.map((order) => {
                return (
                  <div key={order.id} className="glass-card p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                      <div>
                        <h3 className="text-lg mb-1 font-bold text-foreground">
                          Order #{order.id}
                        </h3>
                        <p className="text-muted-foreground">
                          placed on{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.order_status)}
                          <span
                            className={`px-3 py-1 rounded font-medium text-sm capitalize ${getStatusColor(order.order_status)}`}
                          >
                            {order.order_status}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-lg font-semibold text-foreground">
                            ₹{order.total_price}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order?.order_items?.map((item) => {
                        return (
                          <div
                            key={item.product_id}
                            className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {item.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                ₹{item.price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[hsla(var(--glass-border))]">
                      {/* <button className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm">
                        View Details
                      </button>

                      <button className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm">
                        Track Order
                      </button> */}

                      {order.order_status === "Processing" && (
                        <>
                          <button
                            onClick={() => {
                              if (order.order_items.length === 1) {
                                handleWriteReview(
                                  order.order_items[0].product_id
                                );
                              } else {
                                setSelectedOrder(order);
                              }
                            }}
                            className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                          >
                            Write Review
                          </button>
                          <button
                            onClick={() => navigate("/products")}
                            className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                          >
                            Reorder
                          </button>
                        </>
                      )}

                      {/* {order.order_status === "Processing" && (
                        <button className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm text-destructive">
                          Cancel Order
                        </button>
                      )} */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Review Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div
            className="glass-card p-6 w-full max-w-md animate-smooth
                    bg-white dark:bg-transparent
                    border border-gray-200 dark:border-[hsla(var(--glass-border))]"
          >
            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-4">
              Select Product to Review
            </h2>

            {/* Items */}
            <div className="space-y-3">
              {selectedOrder.order_items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center justify-between p-3 rounded-lg
                       bg-gray-100 dark:bg-secondary/50"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-foreground truncate max-w-[65%]">
                    {item.title}
                  </span>

                  <button
                    onClick={() => {
                      handleWriteReview(item.product_id);
                      setSelectedOrder(null);
                    }}
                    className="px-3 py-1 rounded text-sm font-medium
                         bg-gray-200 hover:bg-gray-300 text-gray-900
                         dark:glass-card dark:hover:glow-on-hover dark:text-foreground
                         transition-all"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[hsla(var(--glass-border))] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-sm font-medium rounded
                     text-red-600 hover:bg-red-50
                     dark:text-destructive dark:glass-card dark:hover:glow-on-hover
                     transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
