import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAuthPopup,
  toggleCart,
  toggleSearchBar,
  toggleSidebar
} from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  let cartItemCount = 0;
  if (cart) {
    cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  }

  return (
    <>
      <nav className="fixed left-0 w-full top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* LEFT HAMBURGER MENU */}
            <button
              onClick={() => {
                dispatch(toggleSidebar());
              }}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
            {/* Center Logo */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold text-primary">ShopMate</h1>
            </div>
            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-foreground" />
                )}
              </button>
              {/* Search overlay */}
              <button
                onClick={() => {
                  dispatch(toggleSearchBar());
                }}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Search className="h-5 w-5 text-foreground" />
              </button>
              {/* User Profile */}
              <button
                onClick={() => {
                  dispatch(toggleAuthPopup());
                }}
                className="p-2 rounded-lg hover:bg-secondary transition-colors relative"
              >
                <User className="h-5 w-5 text-foreground" />
              </button>
              {/* Shopping Cart */}
              <button
                onClick={() => {
                  dispatch(toggleCart());
                }}
                className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-foreground" />

                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
