import { motion } from "framer-motion";

const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      <motion.span
        className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.3em] uppercase"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll
      </motion.span>

      {/* Mouse shape — sharp edges, no rounded */}
      <motion.div
        className="relative w-5 h-9 border border-primary/40 flex items-start justify-center pt-2"
        animate={{
          borderColor: [
            "hsl(38 90% 58% / 0.3)",
            "hsl(38 90% 58% / 0.6)",
            "hsl(38 90% 58% / 0.3)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Inner dot that scrolls down */}
        <motion.div
          className="w-1 h-2 bg-primary/70"
          animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Corner accents */}
        <div className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-primary/60" />
        <div className="absolute -top-px -right-px w-1.5 h-1.5 border-t border-r border-primary/60" />
        <div className="absolute -bottom-px -left-px w-1.5 h-1.5 border-b border-l border-primary/60" />
        <div className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-primary/60" />
      </motion.div>

      {/* Animated chevrons */}
      <div className="flex flex-col items-center -mt-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 border-r border-b border-primary/40 -rotate-45 -mt-0.5"
            animate={{ opacity: [0.15, 0.6, 0.15], y: [0, 2, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ScrollIndicator;
