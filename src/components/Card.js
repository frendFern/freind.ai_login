import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ backgroundColor, name, role, buttonText, linkTo, imageUrl }) => (
    <div className="bg-emerald-900 w-80 max-w-xs rounded-lg  m-2 shadow-2xl">
      <div className="flex justify-end px-4 pt-4"></div>
      <div className="flex flex-col items-center pb-1">
        <img
          className="w-300 h-300 mb-3 rounded-full shadow-lg text-white"
          src= {imageUrl} 
          alt=""
        />
        <h5 className="mb-1 text-2xl font-medium text-neutral-200">
          {name}
        </h5>
        <span className="font-mono text-sm text-neutral-200">{role}</span>
        <div className="flex mt-4 md:mt-6">
          <Link
            to={linkTo}
            className="font-mono inline-flex items-center px-6 py-2 text-sm font-medium text-center text-white rounded-lg bg-emerald-800 hover:bg-emerald-900 border mb-2 "
          >
            Chat
          </Link>
        </div>
      </div>
    </div>
  );

export default Card;
