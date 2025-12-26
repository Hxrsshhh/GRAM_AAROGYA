'use client'

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

const AccordionItem = ({ title, content, icon: Icon, isOpen, onClick, index }) => {
  return (
    <motion.div 
      layout
      initial={false}
      className={`mb-4 overflow-hidden rounded-[2rem] border transition-all duration-500 ${isOpen ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-2xl' : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50'}`}
    >
      <button onClick={onClick} className="flex w-full items-center justify-between p-8 text-left outline-none">
        <div className="flex items-center gap-6">
          <motion.div 
            layout
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-500 ${isOpen ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
          <motion.span 
            layout
            className={`text-xl font-black tracking-tight transition-colors duration-500 ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
          >
            {title}
          </motion.span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={isOpen ? 'text-emerald-500' : 'text-slate-400'}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-8 pb-10 pl-24">
              <p className="text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                {content}
              </p>
              <div className="mt-6 flex gap-4">
                <button className="text-sm font-black uppercase tracking-widest text-emerald-500 hover:underline flex items-center gap-2">
                  Read Documentation <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Accordion = ({ items, activeIndex, onItemClick }) => {
  return (
    <LayoutGroup>
      <div className="space-y-4">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            {...item}
            index={index}
            isOpen={activeIndex === index}
            onClick={() => onItemClick(index)}
          />
        ))}
      </div>
    </LayoutGroup>
  );
};

export default Accordion;
export { AccordionItem };
