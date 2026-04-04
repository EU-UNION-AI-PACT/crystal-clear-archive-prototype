import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import bgHeroObservatory from "@/assets/bg-hero-observatory.jpg";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Architectural sketch background — clear, sharp */}
      <motion.img
        src={bgHeroObservatory}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 0.15,
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

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/40" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/40" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/40" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/40" />

      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
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
          <span className="text-foreground">Heritage Archive</span>
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
          <a href="#architecture" className="px-8 py-3 bg-primary text-primary-foreground font-mono text-sm tracking-wider uppercase border border-primary hover:bg-primary/90 transition-colors border-glow">
            Architektur erkunden
          </a>
          <a href="#categories" className="px-8 py-3 border border-border text-foreground font-mono text-sm tracking-wider uppercase hover:border-primary/50 hover:text-primary transition-colors">
            Kategorien →
          </a>
        </motion.div>

        {/* Status indicators */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-8 font-mono text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            OAIS-konform
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            ISO 14721
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            Open Source
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
