import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Error404: React.FC = () => {
  return (
    <><Helmet>
    <title>404 | Portál občana obce Ořechov</title>
  </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Stránka nenalezena
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Omlouváme se, ale požadovaná stránka nebyla nalezena.
          </p>
          <div className="mt-5">
            <Link
              to="/"
              className="text-green-700 hover:text-green-900 font-medium"
            >
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error404;