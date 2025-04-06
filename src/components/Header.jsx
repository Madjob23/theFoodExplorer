import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';

const Header = () => {
  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="text-4xl font-bold mb-4 md:mb-0">
          Food Explorer
        </Link>
        <Search />
      </div>
    </header>
  );
};

export default Header;