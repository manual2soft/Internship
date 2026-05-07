import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  deleteOrder,
  fetchAllOrders,
  updateOrderStatus
} from "../store/slices/orderSlice";

const Orders = () => {
  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const [selectedStatus, setSelectedStatus] = useState({});
  const [filterByStatus, setFilterByStatus] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: newStatus }));
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const filteredOrders =
    filterByStatus === "All"
      ? orders
      : orders?.filter((order) => order.order_status === filterByStatus);

  const confirmDelete = () => {
    dispatch(deleteOrder(deleteConfirm.id));
    setDeleteConfirm({ open: false, id: null });
  };

  if (loading) {
    return <p className="p-10">Loading Orders...</p>;
  }

  return (
    <>
      <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        {/* Header */}
        <div className="flex-1 md:p-6">
          <Header />
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-gray-600 mb-6">Manage your orders.</p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="w-40 h-40 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {filteredOrders.length === 0 ? (
              <h3 className="text-center text-xl font-bold text-gray-700 mt-10">
                No orders found.
              </h3>
            ) : (
              <>
                <div className="flex justify-between items-center p-6">
                  <select
                    onChange={(e) => {
                      setFilterByStatus(e.target.value);
                    }}
                    className="p-2 border rounded shadow-sm"
                  >
                    {statusArray.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {filteredOrders.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-all"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <p>
                            <strong>Order ID : </strong> {order.id}
                          </p>
                          <p>
                            <strong>Status : </strong> {order.order_status}
                          </p>
                          <p>
                            <strong>Placed On : </strong>{" "}
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                          <p>
                            <strong>Total Amount : </strong> ₹{" "}
                            {order.total_price}
                          </p>
                        </div>

                        <div>
                          <select
                            value={
                              selectedStatus[order.id] || order.order_status
                            }
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="p-2 border rounded"
                          >
                            {statusArray.slice(1).map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ open: true, id: order.id })
                            }
                            className="ml-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-lg mb-1">
                          Shipping Info
                        </h4>
                        <p>
                          <strong>Name : </strong>{" "}
                          {order.shipping_info?.full_name}
                        </p>
                        <p>
                          <strong>Address : </strong>{" "}
                          {order.shipping_info?.address},{" "}
                          {order.shipping_info?.city},{" "}
                          {order.shipping_info?.state},{" "}
                          {order.shipping_info?.pincode},{" "}
                          {order.shipping_info?.country}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-semibold text-lg mb-1">
                          Order Items
                        </h4>
                        {Array.isArray(order.order_items) &&
                          order.order_items.map((item, index) => (
                            <div
                              key={item.id || `${order.id}-${index}`}
                              className="flex items-center gap-4 mb-2 border-b pb-2"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-16 h-16 object-cover cursor-pointer"
                                  onClick={() => setPreviewImage(item.image)}
                                />
                              )}
                              <div>
                                <p className="font-semibold">{item.title}</p>
                                <p>
                                  <strong> Qty :</strong> {item.quantity} |
                                  <strong> Price :</strong> ₹ {item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                onClick={() => setPreviewImage(null)}
              >
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-[70%] max-h-[60%] rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.open && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                  <p className="mb-4">
                    Are you sure you want to delete this order?
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() =>
                        setDeleteConfirm({ open: false, id: null })
                      }
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Orders;
