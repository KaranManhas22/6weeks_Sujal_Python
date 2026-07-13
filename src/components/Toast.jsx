import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const Toast = ({ toast }) => {
  if (!toast) return null;
  const { message, type } = toast;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />,
  };

  const bgColors = {
    success: 'bg-slate-900/90 border-emerald-500/30 text-emerald-200 shadow-emerald-500/5',
    error: 'bg-slate-900/90 border-rose-500/30 text-rose-200 shadow-rose-500/5',
    info: 'bg-slate-900/90 border-sky-500/30 text-sky-200 shadow-sky-500/5',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-2xl ${bgColors[type]} max-w-sm pointer-events-auto`}
        >
          {icons[type]}
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Toast;
