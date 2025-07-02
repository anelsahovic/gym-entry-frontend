import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface Props {
  texts: string[];
  className?: string;
}

export default function FlippingText({ texts, className }: Props) {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  const variants: Variants = {
    initial: { opacity: 0, rotateX: 90, y: 20 },
    animate: { opacity: 1, rotateX: 0, y: 0 },
    exit: { opacity: 0, rotateX: -90, y: -20 },
  };

  return (
    <p className={twMerge('text-sm text-gray-800 ', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ display: 'inline-block', backfaceVisibility: 'hidden' }}
        >
          {texts[index]}
        </motion.span>{' '}
      </AnimatePresence>
    </p>
  );
}
