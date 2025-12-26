import React from 'react';
import { motion } from 'framer-motion';


export const Card  = ({ children, className = '', hover = false, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`card ${hover ? 'cursor-pointer card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
