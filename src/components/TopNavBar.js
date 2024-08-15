import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/frend-ai-logo.png';
import { useLocation } from 'react-router-dom';

const TopNavBar = ({ onToggle }) => {
  const cookie = localStorage.getItem("cookie");
  const { pathname } = useLocation();
  const isNewUserPage = pathname.startsWith('/newuser')

  return (
    <nav className="p-4 flex items-center justify-between border-b-2 border-neutral-950 bg-emerald-900">
      <div className="flex items-center mr-4">
        <button onClick={onToggle} className="text-white lg:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        { cookie === null && !isNewUserPage ?
            <Link to="/login" className="text-white">Login/Register</Link>
        :   
            <Link to="/logout" className="text-white">Logout</Link>
        }
      </div>
    </nav>
  );
};

export default TopNavBar;
