import React, { useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { NotificationContext } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 text-white border-emerald-500/50';
      case 'error':
        return 'bg-red-500 text-white border-red-500/50';
      case 'warning':
        return 'bg-amber-500 text-white border-amber-500/50';
      default:
        return 'bg-blue-500 text-white border-blue-500/50';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md pointer-events-none flex flex-col items-end">
      <div className="flex flex-col gap-3">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`${getStyles(notif.type)} border rounded-lg p-4 flex items-start gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.3)] pointer-events-auto backdrop-blur-md min-w-[300px]`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notif.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="flex-shrink-0 ml-2 hover:opacity-75 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
