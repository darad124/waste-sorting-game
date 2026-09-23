import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Small styled hint that fades in near an icon on hover/focus (desktop only). */
export const Tooltip: React.FC<TooltipProps> = ({ label, children, className = "" }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 px-2.5 py-1.5 rounded-lg bg-slate-950 text-white text-[10px] font-bold whitespace-nowrap shadow-lg pointer-events-none"
          >
            {label}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
