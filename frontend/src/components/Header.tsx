import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isAdminState } from '../atoms/atoms';

const Header: React.FC = () => {
  const [isAdmin] = useRecoilState(isAdminState);

  return (
    <header className="bg-green-700 shadow-md w-full"> 
      <div className="container mx-auto px-4 py-4 md:py-6">
        <nav className="flex flex-col md:flex-row items-center">
          <div className="flex flex-col md:flex-row items-center md:flex-1">
            <Link to="/" className="flex items-center">
              <img 
                src="/orechov-logo.png" 
                alt="Ořechov Logo" 
                className="h-23 sm:h-24 w-auto"
              />
            </Link>
            <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mt-4 md:mt-0 md:ml-6">
              Portál občana obce Ořechov
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12 mt-6 md:mt-0">
            <Link 
              to="/" 
              className="text-white hover:text-green-200 font-semibold text-lg md:text-xl transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
            >
              Formuláře a dokumenty
            </Link>
            <Link 
              to="/contacts" 
              className="text-white hover:text-green-200 font-semibold text-lg md:text-xl transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
            >
              Kontakty
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-white hover:text-green-200 font-semibold text-lg md:text-xl transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
              >
                Administrátor
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;