import React from 'react';
import { Link } from 'react-router-dom';

interface FolderProps {
  name: string;
  isEmpty: boolean;
  onDeleteFolder: (folderName: string) => Promise<void>;
}

const Folder: React.FC<FolderProps> = ({ 
  name, 
  isEmpty,
  onDeleteFolder
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking delete
    onDeleteFolder(name);
  };

  return (
    <Link 
      to={`/folder/${encodeURIComponent(name)}`} 
      style={{ 
        textDecoration: 'none', 
        color: 'inherit'
      }}
    >
      <div style={{ 
        padding: '15px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        transition: 'background-color 0.2s',
        cursor: 'pointer',
      }}>
        <h3 style={{ 
          fontSize: '18px',
          margin: 0
        }}>
          {name}
        </h3>
        {isEmpty && (
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Delete Folder
          </button>
        )}
      </div>
    </Link>
  );
};

export default Folder;