import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  onClose: () => void;
  bgColor?: string;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message, onClose, bgColor }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // espera a que termine la animación
    }, 2500);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
        style={{ backgroundColor: bgColor || '#22c55e' }}
      >
        <CheckCircle size={20} className="text-white" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default SuccessToast;
