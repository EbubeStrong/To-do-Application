import type React from "react";
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  isLocal?: boolean;
}

export interface TodoFormProps {
  onCreateTodo: (todo: Todo) => void;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type ToastActionType =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "UPDATE_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };
