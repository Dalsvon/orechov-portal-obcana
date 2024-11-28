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
    <div className="relative mb-12">
      <header className="bg-green-600 shadow-md w-full relative"> 
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center justify-between">
            <div className="relative -mb-16">
              <Link to="/" className="flex items-center">
                <img 
                  src="/orechov-logo.png" 
                  alt="Ořechov Logo" 
                  className="h-32 w-auto object-contain"
                />
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-14 ml-auto">
              <Link 
                to="/" 
                className="text-white hover:text-green-200 font-semibold text-xl transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
              >
                Portál
              </Link>
              <Link 
                to="/documents" 
                className="text-white hover:text-green-200 font-semibold text-xl transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
              >
                Formuláře a dokumenty
              </Link>
              <Link 
                to="/desk" 
                className="text-white hover:text-green-200 font-semibold text-xl transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
              >
                Úřední deska
              </Link>
              <Link 
                to="/contacts" 
                className="text-white hover:text-green-200 font-semibold text-xl transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
              >
                Kontakty
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-white hover:text-green-200 font-semibold text-xl transition duration-150 ease-in-out py-2 border-b-2 border-transparent hover:border-white"
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
            <div className="lg:hidden absolute top-full left-0 right-0 bg-green-600 shadow-lg z-50">
              <div className="flex flex-col p-4 space-y-4">
                <Link 
                  to="/" 
                  onClick={closeMenu}
                  className="text-white hover:text-green-200 font-semibold text-xl py-2"
                >
                  Portál
                </Link>
                <Link 
                  to="/documents" 
                  onClick={closeMenu}
                  className="text-white hover:text-green-200 font-semibold text-xl py-2"
                >
                  Formuláře a dokumenty
                </Link>
                <Link 
                  to="/desk" 
                  onClick={closeMenu}
                  className="text-white hover:text-green-200 font-semibold text-xl py-2"
                >
                  Úřední deska
                </Link>
                <Link 
                  to="/contacts" 
                  onClick={closeMenu}
                  className="text-white hover:text-green-200 font-semibold text-xl py-2"
                >
                  Kontakty
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    onClick={closeMenu}
                    className="text-white hover:text-green-200 font-semibold text-xl py-2"
                  >
                    Administrátor
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;