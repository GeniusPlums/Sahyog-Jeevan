import { useState, useEffect, useCallback } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};

type ToastActionType = {
  toast: (props: Omit<ToastProps, "id">) => void;
  dismiss: (toastId?: string) => void;
  toasts: ToastProps[];
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function generateId() {
  return `${count++}`;
}

export function useToast(): ToastActionType {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const timers = toasts.map((toast) => {
      const timer = setTimeout(() => {
        dismiss(toast.id);
      }, TOAST_REMOVE_DELAY);

      return { id: toast.id, timer };
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer.timer));
    };
  }, [toasts]);

  const toast = useCallback((props: Omit<ToastProps, "id">) => {
    const id = generateId();

    setToasts((state) => {
      const newToasts = [...state, { id, ...props }];
      return newToasts.slice(-TOAST_LIMIT);
    });

    return id;
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    setToasts((state) => {
      return state.filter((toast) => {
        if (toastId === undefined || toast.id === toastId) {
          return false;
        }
        return true;
      });
    });
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}
