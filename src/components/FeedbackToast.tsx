import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface FeedbackToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function FeedbackToast({ toasts, onClose }: FeedbackToastProps) {
  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgColor = 'bg-white border-slate-200 text-slate-800';
          let icon = <Info className="h-5 w-5 text-indigo-500" />;

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-50 border-emerald-100 text-emerald-900';
            icon = <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-50 border-rose-100 text-rose-900';
            icon = <XCircle className="h-5 w-5 text-rose-600" />;
          }

          return (
            <motion.div
              key={toast.id}
              id={`toast-item-${toast.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgColor} backdrop-blur-md`}
            >
              <div className="shrink-0">{icon}</div>
              <p className="text-sm font-medium flex-1">{toast.text}</p>
              <button
                id={`toast-close-${toast.id}`}
                onClick={() => onClose(toast.id)}
                className="shrink-0 hover:opacity-75 transition-opacity text-slate-500 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
