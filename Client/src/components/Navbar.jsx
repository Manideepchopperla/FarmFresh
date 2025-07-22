import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, UserCheck } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../utils/userSlice';
import { toast } from 'sonner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector(store => store.user);
  const location = useLocation();
  let role = null;
  if (user) {
    role = user.user.role;
  }

  const handleLogOut = async () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      try {
        await axios.post(import.meta.env.VITE_BASE_URL + "/auth/logout", {}, { withCredentials: true });
        dispatch(removeUser());
        toast.success("Logged out successfully!");
        navigate("/login");
      } catch (err) {
        console.error("Logout failed:", err);
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  const isActive = (path) =>
    location.pathname === path;

  const linkClasses = (path) =>
    `px-3 py-2 rounded-md transition-colors duration-200 ${
      isActive(path)
        ? 'text-green-900 bg-green-100 font-semibold'
        : 'text-gray-700 hover:text-green-900 hover:bg-green-50'
    }`;

  const iconLinkClasses = (path) =>
    `p-2 rounded-full transition-colors duration-200 ${
      isActive(path)
        ? 'text-green-900 bg-green-100'
        : 'text-gray-700 hover:text-green-900 hover:bg-green-50'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-900">FarmFresh</h1>
            </Link>
          </div>
          {/* This check is now safe and works as expected */}
          {user && (
            <>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <Link to="/" className={linkClasses('/')}>
                    Products
                  </Link>
                  <Link to="/order" className={linkClasses('/order')}>
                    Place Order
                  </Link>
                  <Link to="/track" className={linkClasses('/track')}>
                    Track Order
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
              <div className="bg-green-100 text-green-900 px-4 py-2 rounded-lg shadow-sm text-sm font-medium inline-flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-600" />
                  <span>
                    Welcome back, <span className="font-semibold text-green-900">{user.user.name}</span>
                  </span>
                </div>

                <Link
                  to={role === "admin" ? "/admin" : "/user"}
                  className={iconLinkClasses(role === "admin" ? "/admin" : "/user")}
                >
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleLogOut}
                  className="p-2 rounded-full text-gray-700 hover:text-green-900 hover:bg-green-50 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-900 hover:bg-green-50 focus:outline-none"
                >
                  {isOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && user && (
        <div className="md:hidden w-full">
        <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link to="/" className={linkClasses('/')} onClick={() => setIsOpen(false)}>
            Products
          </Link>
          <Link to="/order" className={linkClasses('/order')} onClick={() => setIsOpen(false)}>
            Place Order
          </Link>
          <Link to="/track" className={linkClasses('/track')} onClick={() => setIsOpen(false)}>
            Track Order
          </Link>
          <Link
            to={role === 'admin' ? '/admin' : '/user'}
            className={linkClasses(role === 'admin' ? '/admin' : '/user')}
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={() => { handleLogOut(); setIsOpen(false); }}
            className="text-left block px-3 py-2 rounded-md text-gray-700 hover:text-green-900 hover:bg-green-50"
          >
            Logout
          </button>
        </div>
      </div>
      )}
    </header>
  );
};

export default Navbar;
