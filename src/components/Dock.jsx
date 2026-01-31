import React, { useMemo } from "react";
import { motion } from "motion/react";
import "./Dock.css";

export default function Dock({ items = [], className = "" }) {
  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  return (
    <div className={`dock ${className}`.trim()} role="navigation">
      <motion.div
        className="dock__bar"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
      >
        {safeItems.map((item) => {
          const isActive = Boolean(item.isActive);
          const isDisabled = Boolean(item.disabled);

          return (
            <motion.button
              key={item.key || item.label}
              type="button"
              className={
                isActive
                  ? "dock__item is-active"
                  : isDisabled
                    ? "dock__item is-disabled"
                    : "dock__item"
              }
              onClick={isDisabled ? undefined : item.onClick}
              aria-label={item.ariaLabel || item.label}
              aria-current={isActive ? "page" : undefined}
              disabled={isDisabled}
              whileHover={isDisabled ? undefined : { scale: 1.04, y: -1 }}
              whileTap={isDisabled ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", damping: 24, stiffness: 420 }}
            >
              <span className="dock__label">{item.label}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
