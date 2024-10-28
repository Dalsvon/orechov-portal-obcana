/*import React from 'react';

const Contacts: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Contact Information</h2>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '20px'
      }}>
        <h3>Contact Us</h3>
        <p>This is the contacts page. Add your contact information here.</p>
      </div>
    </div>
  );
};

export default Contacts;*/

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Building2, CreditCard, Clock, Users } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';

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
  data_id: string | null;
  ic: string | null;
  dic: string | null;
  bank_account: string | null;
  last_updated: string;
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
        setError('Failed to load contact information');
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
        <div className="text-gray-500">No contact information available</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Main Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">{contact.name}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {contact.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <div className="font-medium text-gray-700">Address</div>
                  <div className="text-gray-600">{contact.address}</div>
                </div>
              </div>
            )}

            {(contact.phone || contact.mobile) && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <div className="font-medium text-gray-700">Contact</div>
                  {contact.phone && <div className="text-gray-600">Tel: {contact.phone}</div>}
                  {contact.mobile && <div className="text-gray-600">Mobile: {contact.mobile}</div>}
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
          </div>

          <div className="space-y-4">
            {(contact.ic || contact.dic) && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <div className="font-medium text-gray-700">Registration</div>
                  {contact.ic && <div className="text-gray-600">IČ: {contact.ic}</div>}
                  {contact.dic && <div className="text-gray-600">DIČ: {contact.dic}</div>}
                </div>
              </div>
            )}

            {contact.bank_account && (
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <div className="font-medium text-gray-700">Bank Account</div>
                  <div className="text-gray-600">{contact.bank_account}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Office Hours */}
      {contact.officeHours?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Office Hours</h2>
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

      {/* Employees */}
      {contact.employees?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Employees</h2>
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
        Last updated: {new Date(contact.last_updated).toLocaleString()}
      </div>
    </div>
  );
};

export default Contacts;