import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "../store/slices/orderSlice";

const Payment = () => {
  const { authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  if (!authUser) {
    return navigate("/products");
  }

  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      .then((stripe) => {
        setStripePromise(stripe);
      })
      .catch((error) => {
        console.log("Error loading Stripe:", error);
      });
  }, []);

  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { orderStep } = useSelector((state) => state.order);
  const [shippingDetails, setShippingDetails] = useState({
    full_name: "",
    state: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    country: "India"
  });

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let totalWithTax = total + total * 0.18;

  if (total > 1000) {
    totalWithTax += 50;
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", shippingDetails.full_name);
    formData.append("state", shippingDetails.state);
    formData.append("city", shippingDetails.city);
    formData.append("country", shippingDetails.country);
    formData.append("address", shippingDetails.address);
    formData.append("pincode", shippingDetails.pincode);
    formData.append("phone", shippingDetails.phone);
    formData.append("orderedItems", JSON.stringify(cart));

    dispatch(placeOrder(formData));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-panel max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            No items to checkout
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before proceeding to payment.
          </p>
          <Link
            to={"/products"}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-primary-foreground gradient-primary hover:glow-on-hover animate-smooth font-semibold"
          >
            Browse Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to={"/cart"}
                className="p-2 glass-card hover:glow-on-hover animate-smooth"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Link>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-4">
                {/* Step 1 */}
                <div
                  className={`flex items-center space-x-2 ${
                    orderStep >= 1 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      orderStep >= 1
                        ? "gradient-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {orderStep > 1 ? <Check className="w-5 h-5" /> : "1"}
                  </div>
                  <span className="font-medium">Details</span>
                </div>

                {/* LINE */}
                <div
                  className={`w-12 h-[2px] ${
                    orderStep >= 2 ? "bg-primary" : "bg-border"
                  }`}
                ></div>

                {/* Step 2 */}
                <div
                  className={`flex items-center space-x-2 ${
                    orderStep >= 2 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      orderStep >= 2
                        ? "gradient-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {orderStep > 2 ? <Check className="w-5 h-5" /> : "2"}
                  </div>
                  <span className="font-medium">Payment</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                {orderStep === 1 ? (
                  // step 1: User Details
                  <form onSubmit={handlePlaceOrder} className="glass-panel">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Shipping Information
                    </h2>

                    <div className="mb-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.full_name}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              full_name: e.target.value
                            })
                          }
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={shippingDetails.state}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              state: e.target.value
                            })
                          }
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                        >
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Arunachal Pradesh">
                            Arunachal Pradesh
                          </option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">
                            Himachal Pradesh
                          </option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone No. <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={shippingDetails.phone}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              phone: e.target.value
                            })
                          }
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.address}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              address: e.target.value
                            })
                          }
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.city}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              city: e.target.value
                            })
                          }
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Pin Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingDetails.pincode}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              pincode: e.target.value
                            })
                          }
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={shippingDetails.country}
                          onChange={(e) =>
                            setShippingDetails({
                              ...shippingDetails,
                              country: e.target.value
                            })
                          }
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground"
                        >
                          <option value="India">India</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 gradient-primary hover:glow-on-hover animate-smooth rounded-lg text-primary-foreground font-semibold"
                    >
                      Place Order
                    </button>
                  </form>
                ) : (
                  <>
                    <Elements stripe={stripePromise}>
                      <PaymentForm />
                    </Elements>
                  </>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-panel sticky top-24">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {cart.map((item) => {
                      return (
                        <div
                          key={item.product.id}
                          className="flex items-center space-x-3"
                        >
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-foreground truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="text-sm font-semibold">
                            ₹{item.product.price * item.quantity}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 border-t border-[hsla(var(--glass-border))] pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-500">
                        {totalWithTax >= 1000 ? "Free" : "₹50"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{(total * 0.18).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-[hsla(var(--glass-border))]">
                      <span>Total</span>
                      <span className="text-primary">
                        ₹{totalWithTax.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
