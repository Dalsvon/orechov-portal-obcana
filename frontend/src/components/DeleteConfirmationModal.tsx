import { X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: 'file' | 'folder';
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            Smazat {itemType === 'file' ? 'soubor' : 'složku'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-2
                     hover:bg-gray-100 transition-colors duration-150
                     focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">
            Opravdu chcete smazat {itemType === 'file' ? 'soubor' : 'složku'}:
          </p>
          <p className="mt-2 text-gray-900 font-medium break-words">
            {itemName}
          </p>

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md
                       hover:bg-gray-200 transition-colors duration-150
                       focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Zrušit
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white bg-red-600 rounded-md
                       hover:bg-red-700 transition-colors duration-150
                       focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Smazat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;