"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PopFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function PopForm({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: PopFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-white border-none shadow-2xl rounded-xl p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-[#f1f1f1]">
          <DialogTitle className="text-sm font-semibold text-[#1a1c1d]">{title}</DialogTitle>
          {description ? <DialogDescription className="text-xs text-[#616161]">{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="p-6 space-y-4">{children}</div>
        {footer ? (
          <DialogFooter className="px-6 py-4 bg-[#fafafa] border-t border-[#f1f1f1] flex items-center justify-end gap-3">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
