import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Building2, Clock, Users, Wrench, FileText, Landmark } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import { Helmet } from 'react-helmet-async';

interface OfficeHours {
  id: number;
  days: string;
  time: string;
}

interface Employee {
  id: number;
  name: string;
  position: string | null;
  phone: string | null;
  email: string | null;
}

interface Contact {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  maintenence: string | null;
  dataId: string | null;
  ic: string | null;
  dic: string | null;
  bankAccount: string | null;
  lastUpdated: string;
  officeHours: OfficeHours[];
  employees: Employee[];
}

const Contacts = () => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axiosInstance.get('/api/contact');
        setContact(response.data);
      } catch (err) {
        setError('Nepodařilo se načíst kontaktní informace');
        console.error('Error fetching contact:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Kontaktní informace nejsou k dispozici</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Kontakty | Portál občana obce Ořechov</title>
      </Helmet>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">{contact.name}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {contact.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-700">Adresa</div>
                    <div className="text-gray-600">{contact.address}</div>
                  </div>
                </div>
              )}

              {(contact.phone || contact.mobile) && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-700">Kontakt</div>
                    {contact.phone && <div className="text-gray-600">Tel: {contact.phone}</div>}
                    {contact.mobile && <div className="text-gray-600">Mobil: {contact.mobile}</div>}
                  </div>
                </div>
              )}

              {contact.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-700">Email</div>
                    <div className="text-gray-600">{contact.email}</div>
                  </div>
                </div>
              )}

              {contact.maintenence && (
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-700">Údržba</div>
                    <div className="text-gray-600">{contact.maintenence}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {contact.dataId && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-700">Datová schránka</div>
                    <div className="text-gray-600">{contact.dataId}</div>
                  </div>
                </div>
              )}

              {(contact.ic || contact.dic) && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-700">Identifikace</div>
                    {contact.ic && <div className="text-gray-600">IČ: {contact.ic}</div>}
                    {contact.dic && <div className="text-gray-600">DIČ: {contact.dic}</div>}
                  </div>
                </div>
              )}

              {contact.bankAccount && (
                <div className="flex items-start gap-3">
                  <Landmark className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <div className="font-medium text-gray-700">Bankovní spojení</div>
                    <div className="text-gray-600">č.ú.: {contact.bankAccount}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {contact.officeHours?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold">Úřední hodiny</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {contact.officeHours.map((hours) => (
                <div key={hours.id} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">{hours.days}:</span>
                  <span className="text-gray-600">{hours.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {contact.employees?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold">Zaměstnanci</h2>
            </div>
            <div className="grid gap-4">
              {contact.employees.map((employee) => (
                <div key={employee.id} className="p-4 bg-gray-50 rounded">
                  <div className="font-semibold">{employee.name}</div>
                  {employee.position && (
                    <div className="text-gray-600">{employee.position}</div>
                  )}
                  <div className="mt-2 space-y-1">
                    {employee.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                    {employee.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{employee.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 text-right">
          Poslední aktualizace: {new Date(contact.lastUpdated).toLocaleString()}
        </div>
      </div>
    </>
  );
};

export default Contacts;