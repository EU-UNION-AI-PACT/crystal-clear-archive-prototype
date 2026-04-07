import { motion } from "framer-motion";

const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <span className="font-mono text-[9px] text-muted-foreground/50 tracking-widest uppercase">
        Scroll
      </span>
      <motion.div
        className="w-5 h-9 border border-primary/30 rounded-full flex items-start justify-center p-1"
        animate={{ borderColor: ["hsl(38 90% 58% / 0.3)", "hsl(38 90% 58% / 0.6)", "hsl(38 90% 58% / 0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1 h-2 bg-primary/60 rounded-full"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;
