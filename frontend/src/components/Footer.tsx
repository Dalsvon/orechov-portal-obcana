import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';

interface OfficeHours {
  id: number;
  days: string;
  time: string;
}

interface Contact {
  name: string;
  address: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  officeHours: OfficeHours[];
}

const Footer: React.FC = () => {
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axiosInstance.get('/api/contact');
        setContact(response.data);
      } catch (err) {
        console.error('Error fetching contact:', err);
      }
    };

    fetchContact();
  }, []);

  if (!contact) {
    return null;
  }

  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #dee2e6',
      padding: '2rem 0',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* Container for both columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {/* Kontaktní informace */}
          <div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem' 
            }}>
              Kontaktní informace
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {contact.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <MapPin size={20} style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                  <span>{contact.address}</span>
                </div>
              )}
              {contact.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={20} style={{ flexShrink: 0 }} />
                  <span>Tel: {contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={20} style={{ flexShrink: 0 }} />
                  <span>{contact.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Úřední hodiny */}
          <div>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1rem' 
            }}>
              Úřední hodiny
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {contact.officeHours.map((hours) => (
                <div 
                  key={hours.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}
                >
                  <span style={{ fontWeight: '500' }}>{hours.days}:</span>
                  <span style={{ color: '#666' }}>{hours.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;