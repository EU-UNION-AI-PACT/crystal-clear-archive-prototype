import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import bgHeroObservatory from "@/assets/bg-hero-observatory.jpg";
import ScrollIndicator from "./ScrollIndicator";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Architectural sketch background — clear, sharp */}
      <motion.img
        src={bgHeroObservatory}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 0.22,
          filter: "saturate(0.4) brightness(0.6)",
          mixBlendMode: "luminosity",
          y: bgY,
          scale: bgScale,
        }}
        width={1920}
        height={1080}
      />

      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />
      
      {/* Grid dots background */}
      <div className="absolute inset-0 grid-dots opacity-40" />
      
      {/* Animated scan line */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan" />
      </div>

      {/* Corner decorations with animation */}
      {[
        "top-8 left-8 border-l-2 border-t-2",
        "top-8 right-8 border-r-2 border-t-2",
        "bottom-8 left-8 border-l-2 border-b-2",
        "bottom-8 right-8 border-r-2 border-b-2",
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute ${cls} w-16 h-16 border-primary/40`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
        />
      ))}

      {/* Decorative floating diamond */}
      <motion.div
        className="absolute top-16 right-32 w-6 h-6 border border-primary/20 rotate-45 hidden md:block"
        animate={{ y: [0, -10, 0], rotate: [45, 50, 45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-24 w-4 h-4 border border-accent/20 rotate-45 hidden md:block"
        animate={{ y: [0, 8, 0], rotate: [45, 40, 45] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        className="relative z-20 text-center px-6 max-w-5xl mx-auto"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary/70 mb-6">
            &#47;&#47; Prototyp-Architektur v1.0
          </p>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-glow-primary text-primary animate-flicker"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          AI & Tech
          <br />
          <motion.span
            className="text-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Heritage Archive
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Structured knowledge. Preserved technology.
          <br />
          <span className="text-primary/80 font-display text-base italic">
            Discover the evolution of tools.
          </span>
          <br />
          <span className="text-muted-foreground/60 font-mono text-xs mt-2 inline-block">
            Von Perceptrons zu Transformers — die Evolution bewahren.
          </span>
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <motion.a
            href="#architecture"
            className="px-8 py-3 bg-primary text-primary-foreground font-mono text-sm tracking-wider uppercase border border-primary transition-all duration-300 border-glow relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Architektur erkunden</span>
            <div className="absolute inset-0 bg-primary/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </motion.a>
          <motion.a
            href="#categories"
            className="px-8 py-3 border border-border text-foreground font-mono text-sm tracking-wider uppercase hover:border-primary/50 hover:text-primary transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Kategorien
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Status indicators */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-8 font-mono text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[
            { label: "OAIS-konform", color: "bg-accent" },
            { label: "ISO 14721", color: "bg-primary" },
            { label: "Open Source", color: "bg-accent" },
          ].map((item, i) => (
            <motion.span
              key={item.label}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + i * 0.15 }}
            >
              <span className={`w-2 h-2 ${item.color} animate-pulse-glow`} />
              {item.label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
