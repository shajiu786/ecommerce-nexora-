import { createContext, useCallback, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircleExclamation, faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

const ToastContext = createContext(null);
const icons = { success: faCheckCircle, error: faCircleExclamation, info: faInfoCircle };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3400);
  }, []);
  const dismiss = (id) => setToasts((items) => items.filter((item) => item.id !== id));
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100vw-32px))] flex-col gap-2" aria-live="polite">
        {toasts.map((item) => (
          <div key={item.id} className={`animate-in flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${item.type === "error" ? "border-red-200" : "border-slate-200"}`}>
            <FontAwesomeIcon icon={icons[item.type] || icons.info} className={item.type === "error" ? "text-red-500" : item.type === "info" ? "text-blue-500" : "text-emerald-500"} />
            <span className="flex-1 text-sm font-medium">{item.message}</span>
            <button aria-label="Dismiss notification" onClick={() => dismiss(item.id)} className="p-1 text-slate-400 hover:text-slate-700"><FontAwesomeIcon icon={faXmark} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
