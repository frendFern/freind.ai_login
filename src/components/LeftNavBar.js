import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const LeftNavBar = () => {
  const cookie = localStorage.getItem("cookie");

  return (
    <nav className="bg-emerald-900 flex flex-col h-full lg:block hidden w-1/10 p-4 border-r-2 border-neutral-950">

      <div className="flex flex-col justify-between space-y-10">
        <ul className='space-y-4 text-white pt-2'>
          <Link to="/" className="navbar-tab h-[40px] bg-emerald-900 hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 p items-center gap-2 flex mx-auto cursor-pointer">
            <li>
              Explore
            </li>
          </Link>

          <Link to="/chat" className="navbar-tab h-[40px] bg-emerald-900 hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 p items-center gap-2 flex mx-auto cursor-pointer">
            <li>
              Chat
            </li>
          </Link>

          <Link to="/gallery" className="navbar-tab h-[40px] bg-emerald-900 hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 p items-center gap-2 flex mx-auto cursor-pointer">
            <li>
              Gallery
            </li>
          </Link>

          <Link to="/create-AI" className="navbar-tab h-[40px] bg-emerald-900 hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 p items-center gap-2 flex mx-auto cursor-pointer">
            <li>
              Create AI
            </li>
          </Link>

          <Link to="/my-AI" className="navbar-tab h-[40px] bg-emerald-900 hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 p items-center gap-2 flex mx-auto cursor-pointer">
            <li>
              My AI
            </li>
          </Link>

          {cookie !== null ?
            <Link to="/premium" className="navbar-tab h-[40px] bg-emerald-900 hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 p items-center gap-2 flex mx-auto cursor-pointer">
              <li>
                Premium
              </li>
            </Link>
            :
            <></>
          }
        </ul>
        <ul className="space-y-4 text-white">

          <a href="https://discord.gg/bTSTWaDJpj" target="_blank" rel="noopener noreferrer" className="navbar-tab h-[40px] hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 items-center  flex mx-auto cursor-pointer">
            <li>
              Discord
            </li>
          </a>

          <a href="https://twitter.com/Frend_Ai" target="_blank" rel="noopener noreferrer" className="navbar-tab h-[40px] hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 items-center  flex mx-auto cursor-pointer">
            <li>
              X
            </li>
          </a>

          <Link to="/privacy-policy" className="navbar-tab h-[40px] bg-emerald-900 hover:bg-emerald-800 rounded-[10px] border border-white border-opacity-10 justify-start px-3 items-center gap-2 flex mx-auto cursor-pointer">
            <li>
              Privacy Policy
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}

export default LeftNavBar;
