import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      {/* Glow effect underneath */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[4px] z-[59] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, transparent, hsl(38 90% 58% / 0.4), hsl(38 90% 58% / 0.6))",
          filter: "blur(3px)",
        }}
      />
    </>
  );
};

export default ScrollProgress;
