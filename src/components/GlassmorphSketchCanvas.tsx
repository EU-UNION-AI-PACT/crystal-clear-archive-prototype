import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { archiveCategories } from "@/data/archiveData";
import { Link } from "react-router-dom";

import sketchFrameworks from "@/assets/sketch-frameworks.jpg";
import sketchLanguages from "@/assets/sketch-languages.jpg";
import sketchHardware from "@/assets/sketch-hardware.jpg";
import sketchDatasets from "@/assets/sketch-datasets.jpg";
import sketchGenerative from "@/assets/sketch-generative.jpg";
import sketchDevtools from "@/assets/sketch-devtools.jpg";
import sketchCloud from "@/assets/sketch-cloud.jpg";
import sketchRobotics from "@/assets/sketch-robotics.jpg";
import sketchResearch from "@/assets/sketch-research.jpg";
import sketchPeople from "@/assets/sketch-people.jpg";
import sketchSafety from "@/assets/sketch-safety.jpg";
import sketchModels from "@/assets/sketch-models.jpg";

import bgLibrary1 from "@/assets/bg-library-arch-1.jpg";
import bgLibrary2 from "@/assets/bg-library-arch-2.jpg";
import bgLibrary3 from "@/assets/bg-library-arch-3.jpg";
import bgLibrary4 from "@/assets/bg-library-arch-4.jpg";

const architecturalBackgrounds = [bgLibrary1, bgLibrary2, bgLibrary3, bgLibrary4];

const categoryImages: Record<string, string> = {
  "ai-frameworks": sketchFrameworks,
  "programming-languages": sketchLanguages,
  "hardware-accelerators": sketchHardware,
  "datasets-benchmarks": sketchDatasets,
  "generative-ai": sketchGenerative,
  "dev-tools": sketchDevtools,
  "cloud-infrastructure": sketchCloud,
  "robotics-embodied": sketchRobotics,
  "research-papers": sketchResearch,
  "people-orgs": sketchPeople,
  "security-safety": sketchSafety,
  "media-artifacts": sketchModels,
};

const categorySketchData = archiveCategories.map((cat, ci) => ({
  slug: cat.slug,
  title: cat.title,
  tag: cat.tag,
  subtitle: cat.subtitle,
  entryCount: cat.entries.length,
  topEntries: cat.entries.slice(0, 3),
  timestamp: new Date(2024, ci, 15 + ci, 10 + ci, 30).toISOString(),
  color: ci % 2 === 0 ? "amber" : "green",
  shapes: generateShapes(ci),
}));

interface Shape {
  type: "circle" | "rect" | "line" | "arc" | "diamond" | "hexagon";
  x: number; y: number; size: number; delay: number;
  label?: string;
  linkedEntry?: string;
}

function generateShapes(seed: number): Shape[] {
  const rng = (i: number) => ((seed * 7 + i * 13 + 37) % 100) / 100;
  const shapes: Shape[] = [];
  const cat = archiveCategories[seed];
  const types: Array<Shape["type"]> = ["circle", "rect", "line", "arc", "diamond", "hexagon"];
  
  const count = 8 + Math.floor(rng(0) * 7);
  for (let i = 0; i < count; i++) {
    const entryIdx = i % cat.entries.length;
    shapes.push({
      type: types[Math.floor(rng(i + 1) * types.length)],
      x: 40 + rng(i + 2) * 520,
      y: 40 + rng(i + 3) * 320,
      size: 15 + rng(i + 4) * 40,
      delay: rng(i + 5) * 2,
      label: cat.entries[entryIdx]?.name,
      linkedEntry: cat.entries[entryIdx]?.name,
    });
  }

  for (let i = 0; i < 4; i++) {
    shapes.push({
      type: "line",
      x: 60 + rng(i + 20) * 480,
      y: 60 + rng(i + 21) * 280,
      size: 60 + rng(i + 22) * 100,
      delay: rng(i + 23) * 2,
    });
  }

  return shapes;
}

const ShapeTooltip = ({ shape, isAmber }: { shape: Shape; isAmber: boolean; onClose: () => void }) => {
  if (!shape.label) return null;
  const color = isAmber ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)";
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <rect
        x={Math.min(shape.x - 10, 440)}
        y={shape.y - 45}
        width={140}
        height={32}
        rx={2}
        fill="hsl(220 20% 8%)"
        fillOpacity="0.95"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.5"
      />
      <text
        x={Math.min(shape.x + 60, 510)}
        y={shape.y - 25}
        textAnchor="middle"
        fill={color}
        style={{ fontSize: "9px", fontFamily: "'Space Mono', monospace" }}
      >
        {shape.label}
      </text>
      <line
        x1={shape.x}
        y1={shape.y - 13}
        x2={shape.x}
        y2={shape.y - shape.size / 2 - 2}
        stroke={color}
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.4"
      />
    </motion.g>
  );
};

function renderShape(
  shape: Shape, i: number, isAmber: boolean,
  hoveredIdx: number | null, onHover: (idx: number | null) => void
) {
  const stroke = isAmber ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)";
  const baseOpacity = 0.2 + (i % 3) * 0.08;
  const isHovered = hoveredIdx === i;
  const opacity = isHovered ? 0.7 : baseOpacity;
  const animDur = 3 + (i % 4);

  const common = {
    stroke,
    strokeWidth: isHovered ? 1.5 : 0.7,
    fill: isHovered ? `${stroke.replace(")", " / 0.1)")}` : "none",
    opacity,
    style: { cursor: shape.label ? "pointer" : "default", transition: "all 0.3s ease" },
    onMouseEnter: () => shape.label && onHover(i),
    onMouseLeave: () => onHover(null),
  };

  switch (shape.type) {
    case "circle":
      return (
        <g key={i}>
          <circle cx={shape.x} cy={shape.y} r={shape.size / 2} {...common}>
            <animate attributeName="r" values={`${shape.size / 2};${shape.size / 2 + 3};${shape.size / 2}`} dur={`${animDur}s`} repeatCount="indefinite" begin={`${shape.delay}s`} />
          </circle>
          <circle cx={shape.x} cy={shape.y} r={shape.size / 4} {...common} opacity={opacity * 0.5} />
        </g>
      );
    case "rect":
      return (
        <rect key={i} x={shape.x - shape.size / 2} y={shape.y - shape.size / 3} width={shape.size} height={shape.size * 0.66} {...common}>
          <animate attributeName="opacity" values={`${opacity};${opacity + 0.05};${opacity}`} dur={`${animDur}s`} repeatCount="indefinite" begin={`${shape.delay}s`} />
        </rect>
      );
    case "diamond": {
      const d = shape.size / 2;
      return (
        <polygon key={i} points={`${shape.x},${shape.y - d} ${shape.x + d},${shape.y} ${shape.x},${shape.y + d} ${shape.x - d},${shape.y}`} {...common}>
          <animateTransform attributeName="transform" type="rotate" values={`0 ${shape.x} ${shape.y};5 ${shape.x} ${shape.y};0 ${shape.x} ${shape.y}`} dur={`${animDur + 2}s`} repeatCount="indefinite" begin={`${shape.delay}s`} />
        </polygon>
      );
    }
    case "hexagon": {
      const r = shape.size / 2;
      const pts = Array.from({ length: 6 }, (_, j) => {
        const angle = (Math.PI / 3) * j - Math.PI / 6;
        return `${shape.x + r * Math.cos(angle)},${shape.y + r * Math.sin(angle)}`;
      }).join(" ");
      return <polygon key={i} points={pts} {...common} />;
    }
    case "arc":
      return (
        <path key={i} d={`M ${shape.x - shape.size / 2} ${shape.y} A ${shape.size / 2} ${shape.size / 2} 0 0 1 ${shape.x + shape.size / 2} ${shape.y}`} {...common} />
      );
    case "line":
    default:
      return (
        <line key={i} x1={shape.x} y1={shape.y} x2={shape.x + shape.size * 0.7} y2={shape.y + shape.size * 0.3} {...common}>
          <animate attributeName="opacity" values={`${opacity};${opacity * 1.5};${opacity}`} dur={`${animDur}s`} repeatCount="indefinite" begin={`${shape.delay}s`} />
        </line>
      );
  }
}

const GlassmorphSketchCanvas = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [now, setNow] = useState(new Date());
  const [hoveredShape, setHoveredShape] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoSwitchRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const startAutoSwitch = () => {
    if (autoSwitchRef.current) clearInterval(autoSwitchRef.current);
    autoSwitchRef.current = setInterval(() => {
      setCurrentPage((p) => (p + 1) % categorySketchData.length);
      setHoveredShape(null);
    }, 6000);
  };

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    startAutoSwitch();
    return () => {
      clearInterval(t);
      if (autoSwitchRef.current) clearInterval(autoSwitchRef.current);
    };
  }, []);

  const sketch = categorySketchData[currentPage];
  const isAmber = sketch.color === "amber";
  const totalPages = categorySketchData.length;
  const catImage = categoryImages[sketch.slug];

  const goTo = (dir: number) => {
    setCurrentPage((p) => (p + dir + totalPages) % totalPages);
    setHoveredShape(null);
    startAutoSwitch(); // Reset timer on manual navigation
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const dragStartX = useRef(0);
  const handleDragStart = (x: number) => { dragStartX.current = x; };
  const handleDragEnd = (x: number) => {
    const diff = dragStartX.current - x;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? 1 : -1);
  };

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) +
      " · " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Background layer — crystal clear, no blur */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ y: bgY }}
      >
        {/* Layered architectural library backgrounds — sharp, no blur */}
        {architecturalBackgrounds.map((bg, idx) => {
          const baseOpacity = 0.12 + (idx % 2) * 0.06;
          return (
            <motion.img
              key={idx}
              src={bg}
              alt=""
              className="absolute w-full h-full object-cover pointer-events-none"
              style={{
                opacity: baseOpacity,
                filter: `saturate(0.35) brightness(0.6)`,
                mixBlendMode: "luminosity",
                top: `${idx * 6}%`,
                left: `${(idx % 2 === 0 ? -3 : 3)}%`,
                transform: `scale(${1.08 + idx * 0.03}) rotate(${idx % 2 === 0 ? -0.5 : 0.5}deg)`,
                y: bgY,
              }}
              loading="lazy"
              width={1920}
              height={1080}
              initial={{ opacity: 0 }}
              animate={{ opacity: baseOpacity }}
              transition={{ duration: 3, delay: idx * 0.5 }}
            />
          );
        })}

        <AnimatePresence mode="wait">
          <motion.div
            key={sketch.slug}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Category illustration image — clearer */}
            {catImage && (
              <img
                src={catImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.15, filter: "saturate(0.7)" }}
                loading="lazy"
              />
            )}
            
            <svg
              viewBox="0 0 600 400"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern id="sketch-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="0.5" fill={isAmber ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)"} opacity="0.08" />
                </pattern>
              </defs>
              <rect width="600" height="400" fill="url(#sketch-grid)" />
              {sketch.shapes.map((s, i) => renderShape(s, i, isAmber, null, () => {}))}
              <text x="300" y="200" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "48px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }} fill={isAmber ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)"} opacity="0.04">
                {sketch.tag}
              </text>
            </svg>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Interactive panel — solid background, no glassmorphism */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-5xl mx-auto px-6 pb-6 pointer-events-auto">
          <motion.div
            className="bg-card border border-border shadow-[0_-8px_40px_hsl(220_20%_6%/0.7)]"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Interactive sketch preview */}
            <div className="relative h-28 overflow-hidden border-b border-border/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={sketch.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Category image as backdrop — sharper */}
                  {catImage && (
                    <img
                      src={catImage}
                      alt={sketch.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ opacity: 0.25, filter: "saturate(0.8)" }}
                      loading="lazy"
                      width={768}
                      height={512}
                    />
                  )}
                  
                  {/* Interactive SVG overlay */}
                  <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                    {sketch.shapes.map((s, i) => renderShape(s, i, isAmber, hoveredShape, setHoveredShape))}
                    
                    <AnimatePresence>
                      {hoveredShape !== null && sketch.shapes[hoveredShape] && (
                        <ShapeTooltip
                          shape={sketch.shapes[hoveredShape]}
                          isAmber={isAmber}
                          onClose={() => setHoveredShape(null)}
                        />
                      )}
                    </AnimatePresence>
                  </svg>

                  {/* Category quick info overlay */}
                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    <span className="font-mono text-[8px] text-muted-foreground bg-background/80 px-1.5 py-0.5">
                      {sketch.entryCount} Einträge
                    </span>
                    {sketch.topEntries.map((e, i) => (
                      <span key={i} className="font-mono text-[7px] text-primary/50 hidden md:inline">
                        {e.name}
                      </span>
                    ))}
                  </div>
                  
                  {/* Archive link */}
                  <Link 
                    to={`/archive/${sketch.slug}`}
                    className="absolute top-2 right-3 flex items-center gap-1 font-mono text-[8px] text-primary/60 hover:text-primary transition-colors bg-background/80 px-2 py-1"
                  >
                    Archiv öffnen <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => goTo(-1)}
                  className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-[0_0_10px_hsl(38_90%_55%/0.15)] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                  className="flex-1 text-center cursor-grab active:cursor-grabbing select-none"
                  onMouseDown={(e) => handleDragStart(e.clientX)}
                  onMouseUp={(e) => handleDragEnd(e.clientX)}
                  onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                  onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sketch.slug}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center gap-3 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isAmber ? 'bg-primary' : 'bg-accent'}`} />
                        <span className="font-display font-semibold text-foreground text-xs">
                          {sketch.title}
                        </span>
                        <span className="font-mono text-[8px] text-muted-foreground/50 tracking-wider">
                          {sketch.tag}
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground/60 font-mono mb-1 hidden md:block">
                        {sketch.subtitle}
                      </p>
                      <div className="flex justify-center gap-4 font-mono text-[8px] text-muted-foreground/40">
                        <span>{formatTimestamp(sketch.timestamp)}</span>
                        <span>{now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => goTo(1)}
                  className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-[0_0_10px_hsl(38_90%_55%/0.15)] transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Page dots */}
              <div className="flex justify-center gap-1 mt-3">
                {categorySketchData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(i); setHoveredShape(null); }}
                    className={`w-1 h-1 rounded-full transition-all ${
                      i === currentPage ? 'bg-primary w-3' : 'bg-border hover:bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GlassmorphSketchCanvas;
