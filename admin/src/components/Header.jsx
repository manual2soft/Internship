import React from "react";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../assets/avatar.jpg";
import { Menu } from "lucide-react";
import { toggleNavbar } from "../store/slices/extraSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { openedComponent } = useSelector((state) => state.extra);

  const dispatch = useDispatch();

  return (
    <>
      <header className="flex justify-between mb-3 pb-2">
        <p className="flex items-center gap-3 text-sm">
          <span>{user?.name}</span>
          <span>/</span>
          <span>{openedComponent}</span>
        </p>
        <div className="flex items-center gap-3">
          <Menu
            className="block md:hidden cursor-pointer"
            onClick={() => dispatch(toggleNavbar())}
          />
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar?.url || avatar}
              alt={user?.name || "Avatar"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-sm">{user?.name}</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
