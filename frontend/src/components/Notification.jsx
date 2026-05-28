import React, { useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { NotificationContext } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success text-white border-success/50';
      case 'error':
        return 'bg-danger text-white border-danger/50';
      case 'warning':
        return 'bg-warning text-white border-warning/50';
      default:
        return 'bg-primary text-white border-primary/50';
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
      <AnimatePresence>
        {notifications.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
