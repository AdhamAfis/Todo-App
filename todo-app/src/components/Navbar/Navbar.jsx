import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="text-center bg-white flex flex-col md:flex-row items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-2xl font-bold text-black-400 py-1">Todo List</h2>
      <div>
        {userInfo && (
          <div className="flex items-center space-x-4">
            <button
              onClick={onLogout}
              className="text-red-500 hover:text-red-600 focus:outline-none"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
