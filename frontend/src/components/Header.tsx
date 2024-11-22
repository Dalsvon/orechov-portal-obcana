import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isAdminState } from '../atoms/atoms';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isAdmin] = useRecoilState(isAdminState);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-green-700 shadow-md w-full relative"> 
      <div className="container mx-auto px-4 py-4 md:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <Link to="/" className="flex items-center">
              <img 
                src="/orechov-logo.png" 
                alt="Ořechov Logo" 
                className="h-16 sm:h-24 w-auto"
              />
            </Link>
            <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-bold ml-4 md:ml-6">
              Portál občana obce Ořechov
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12">
            <Link 
              to="/" 
              className="text-white hover:text-green-200 font-semibold text-lg transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
            >
              Portál
            </Link>
            <Link 
              to="/documents" 
              className="text-white hover:text-green-200 font-semibold text-lg transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
            >
              Formuláře a dokumenty
            </Link>
            <Link 
              to="/contacts" 
              className="text-white hover:text-green-200 font-semibold text-lg transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
            >
              Kontakty
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-white hover:text-green-200 font-semibold text-lg transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
              >
                Administrátor
              </Link>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="lg:hidden text-white hover:text-green-200 p-2"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-green-700 shadow-lg z-50">
            <div className="flex flex-col p-4 space-y-4">
              <Link 
                to="/" 
                onClick={closeMenu}
                className="text-white hover:text-green-200 font-semibold text-lg py-2"
              >
                Portál
              </Link>
              <Link 
                to="/documents" 
                onClick={closeMenu}
                className="text-white hover:text-green-200 font-semibold text-lg py-2"
              >
                Formuláře a dokumenty
              </Link>
              <Link 
                to="/contacts" 
                onClick={closeMenu}
                className="text-white hover:text-green-200 font-semibold text-lg py-2"
              >
                Kontakty
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={closeMenu}
                  className="text-white hover:text-green-200 font-semibold text-lg py-2"
                >
                  Administrátor
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;