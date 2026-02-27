// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // We'll create/use this soon

const Navbar = () => {
  const { state, dispatch } = useAppContext(); // user and cart from context
  const navigate = useNavigate();
  
  // For a very simple mobile menu toggle (optional — can remove if you want)
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Metero<span className="text-blue-400">Store</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-400 transition-colors">
            Products
          </Link>
          <Link to="/cart" className="hover:text-blue-400 transition-colors relative">
            Cart
            {state.cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {state.cart.length}
              </span>
            )}
          </Link>

          {/* Auth Links */}
          {state.user ? (
            <div className="flex items-center space-x-6">
              <Link to="/profile" className="hover:text-blue-400 transition-colors">
                {state.user.name || 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-blue-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/login" className="hover:text-blue-400 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-6 space-y-4">
          <Link to="/" className="block hover:text-blue-400" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="block hover:text-blue-400" onClick={() => setIsOpen(false)}>
            Products
          </Link>
          <Link to="/cart" className="block hover:text-blue-400" onClick={() => setIsOpen(false)}>
            Cart ({state.cart.length})
          </Link>

          {state.user ? (
            <>
              <Link to="/profile" className="block hover:text-blue-400" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block hover:text-blue-400 w-full text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-blue-400" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="block hover:text-blue-400" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;