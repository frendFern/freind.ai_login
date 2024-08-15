import React from 'react';
import { Link } from 'react-router-dom';

const MobileNavBar = ({ isOpen, onClose }) => {
    const cookie = localStorage.getItem("cookie");

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 h-full w-full bg-emerald-900 z-50">
            <button onClick={onClose} className="text-white p-4">
                Close
            </button>
            <nav className="flex flex-col p-4">
                <ul className='space-y-4 text-white'>
                    <li onClick={onClose}><Link to="/" className="block p-2">Explore</Link></li>
                    <li onClick={onClose}><Link to="/chat" className="block p-2">Chat</Link></li>
                    <li onClick={onClose}><Link to="/gallery" className="block p-2">Gallery</Link></li>
                    <li onClick={onClose}><Link to="/create-AI" className="block p-2">Create AI</Link></li>
                    <li onClick={onClose}><Link to="/my-AI" className="block p-2">My AI</Link></li>
                    {cookie !== null && (
                        <li onClick={onClose}><Link to="/premium" className="block p-2">Premium</Link></li>
                    )}
                    <li onClick={onClose}><a href="https://discord.gg/bTSTWaDJpj" target="_blank" rel="noopener noreferrer" className="block p-2">Discord</a></li>
                    <li onClick={onClose}><a href="https://twitter.com/Frend_Ai" target="_blank" rel="noopener noreferrer" className="block p-2">X</a></li>
                    <li onClick={onClose}><Link to="/privacy-policy" className="block p-2">Privacy Policy</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default MobileNavBar;
