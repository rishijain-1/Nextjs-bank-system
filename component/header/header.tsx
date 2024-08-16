// components/Header.tsx

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <div className="text-2xl font-bold">
          <Link href="/">Dashboard</Link>
        </div>
        <div className="flex items-center ">
          
          <button
            className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
