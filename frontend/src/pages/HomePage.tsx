import { useNavigate } from 'react-router-dom';
import { FileText, Phone, ClipboardList } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PortalHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Portál občana obce Ořechov</title>
      </Helmet>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Vítejte na Portálu občana obce Ořechov
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Cílem Portálu občana je umožnit občanům Ořechova lépe komunikovat s úřady obce.
          Můžete zde stahovat dokumenty a formuláře obce Ořechov, najít úřední desku obce a také kontakty na obecní úřad a představitele obce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <button
            onClick={() => navigate('/documents')}
            className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4 group"
          >
            <FileText size={48} className="text-green-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-semibold text-gray-900">Formuláře a dokumenty</span>
          </button>

          <button
            onClick={() => navigate('/desk')}
            className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4 group"
          >
            <ClipboardList size={48} className="text-green-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-semibold text-gray-900">Úřední deska</span>
          </button>

          <button
            onClick={() => navigate('/contacts')}
            className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4 group"
          >
            <Phone size={48} className="text-green-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-semibold text-gray-900">Kontakty</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PortalHome;