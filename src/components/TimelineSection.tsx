import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import bgTimelineGallery from "@/assets/bg-timeline-gallery.jpg";

const milestones = [
  { year: "1943", event: "McCulloch-Pitts Neuron", type: "model", detail: "Erstes mathematisches Modell eines Neurons. Warren McCulloch und Walter Pitts legten den Grundstein für neuronale Netze mit binärer Logik.", significance: "pioneering" },
  { year: "1950", event: "Turing-Test", type: "model", detail: "Alan Turing veröffentlicht 'Computing Machinery and Intelligence' und schlägt den Imitationstest als Maßstab für maschinelle Intelligenz vor.", significance: "pioneering" },
  { year: "1956", event: "Dartmouth Conference", type: "milestone", detail: "Der Begriff 'Artificial Intelligence' wird geprägt. McCarthy, Minsky, Rochester und Shannon starten das Feld als eigene Disziplin.", significance: "pioneering" },
  { year: "1958", event: "Perceptron", type: "model", detail: "Frank Rosenblatt baut den Mark I Perceptron — das erste Hardware-Neuronale-Netz, das selbstständig lernen konnte. Medien prophezeien denkende Maschinen.", significance: "pioneering" },
  { year: "1966", event: "ELIZA", type: "software", detail: "Joseph Weizenbaums Chatbot am MIT simuliert einen Therapeuten mit Pattern-Matching. Erster viraler AI-Moment — Nutzer glaubten an echtes Verständnis.", significance: "influential" },
  { year: "1969", event: "UNIX & Perceptron-Kritik", type: "software", detail: "UNIX entsteht bei Bell Labs. Gleichzeitig veröffentlichen Minsky & Papert 'Perceptrons' und zeigen die Limitationen — Beginn des ersten AI Winters.", significance: "influential" },
  { year: "1974", event: "Backpropagation", type: "model", detail: "Paul Werbos formuliert Backpropagation in seiner Dissertation. Der Algorithmus ermöglicht erstmals effizientes Training mehrschichtiger Netze.", significance: "pioneering" },
  { year: "1980", event: "Expertensysteme-Boom", type: "software", detail: "R1/XCON bei DEC spart Millionen. Regelbasierte Systeme dominieren — Unternehmen investieren Milliarden in AI. Der zweite Frühling beginnt.", significance: "influential" },
  { year: "1985", event: "Connection Machine", type: "hardware", detail: "Danny Hillis' massiv-paralleler Computer mit 65.536 Prozessoren. Thinking Machines Corp. wird zum Symbol der AI-Hardware-Revolution.", significance: "influential" },
  { year: "1986", event: "Backprop Revival", type: "model", detail: "Rumelhart, Hinton & Williams popularisieren Backpropagation in Nature. Multi-Layer-Perceptrons werden praktikabel — Neuronale Netze erleben ein Comeback.", significance: "influential" },
  { year: "1989", event: "LeNet / CNN", type: "model", detail: "Yann LeCun entwickelt LeNet-5 für Handschrifterkennung bei AT&T. Convolutional Networks verarbeiten erstmals strukturierte visuelle Daten effizient.", significance: "pioneering" },
  { year: "1997", event: "Deep Blue & LSTM", type: "model", detail: "IBM's Deep Blue besiegt Kasparov im Schach. Hochreiter & Schmidhuber veröffentlichen Long Short-Term Memory — die Lösung für das Vanishing-Gradient-Problem.", significance: "pioneering" },
  { year: "2006", event: "Deep Learning Durchbruch", type: "model", detail: "Geoffrey Hinton zeigt, wie tiefe Netze schichtweise vortrainiert werden können. Der Begriff 'Deep Learning' entsteht — die dritte AI-Welle beginnt.", significance: "pioneering" },
  { year: "2009", event: "ImageNet", type: "data", detail: "Fei-Fei Li veröffentlicht ImageNet mit 14 Millionen gelabelten Bildern. Der Datensatz wird zum Benchmark, der Computer Vision revolutionieren wird.", significance: "influential" },
  { year: "2012", event: "AlexNet", type: "model", detail: "Krizhevsky, Sutskever & Hinton gewinnen die ImageNet Challenge mit CNNs und GPUs. Fehlerrate halbiert — der Startschuss für die Deep-Learning-Ära.", significance: "pioneering" },
  { year: "2014", event: "GANs & Seq2Seq", type: "model", detail: "Ian Goodfellow erfindet Generative Adversarial Networks. Google veröffentlicht Seq2Seq — die Basis für moderne maschinelle Übersetzung.", significance: "pioneering" },
  { year: "2015", event: "ResNet & TensorFlow", type: "model", detail: "Residual Networks ermöglichen 152-Layer-Netze. Google open-sourced TensorFlow — Deep Learning wird demokratisiert.", significance: "influential" },
  { year: "2016", event: "AlphaGo", type: "model", detail: "DeepMinds AlphaGo besiegt Lee Sedol in Go — ein Spiel mit mehr Positionen als Atome im Universum. Reinforcement Learning erreicht übermenschliches Niveau.", significance: "pioneering" },
  { year: "2017", event: "Transformer", type: "model", detail: "'Attention Is All You Need' — Vaswani et al. bei Google. Self-Attention ersetzt Rekurrenz. Die Architektur, die alles veränderte.", significance: "pioneering" },
  { year: "2018", event: "BERT & GPT", type: "model", detail: "Google veröffentlicht BERT, OpenAI den ersten GPT. Transfer Learning wird Standard — vortrainierte Sprachmodelle verstehen Kontext.", significance: "influential" },
  { year: "2020", event: "GPT-3", type: "model", detail: "175 Milliarden Parameter. Few-Shot Learning ohne Fine-Tuning. OpenAI zeigt: Skalierung allein erzeugt emergente Fähigkeiten.", significance: "pioneering" },
  { year: "2021", event: "DALL·E & Codex", type: "model", detail: "KI generiert Bilder aus Text und schreibt Code. Multimodale Modelle zeigen: Sprache ist die universelle Schnittstelle.", significance: "influential" },
  { year: "2022", event: "ChatGPT & Diffusion", type: "model", detail: "Stable Diffusion demokratisiert Bildgenerierung. ChatGPT erreicht 100M Nutzer in 2 Monaten — der schnellste Produkt-Launch der Geschichte.", significance: "pioneering" },
  { year: "2024", event: "Frontier Models", type: "model", detail: "GPT-4o, Claude 3, Gemini Ultra. Multimodale Reasoning, 1M+ Token Context. AI wird zur Infrastruktur — die Post-Training-Ära beginnt.", significance: "influential" },
];

const typeColors: Record<string, string> = {
  model: "bg-primary",
  software: "bg-accent",
  hardware: "bg-amber-dim",
  data: "bg-terminal-green",
  milestone: "bg-primary/60",
};

const typeBorderColors: Record<string, string> = {
  model: "border-primary/40",
  software: "border-accent/40",
  hardware: "border-amber-dim/40",
  data: "border-terminal-green/40",
  milestone: "border-primary/30",
};

const typeGlow: Record<string, string> = {
  model: "shadow-[0_0_15px_hsl(38_90%_55%/0.3)]",
  software: "shadow-[0_0_15px_hsl(150_60%_45%/0.3)]",
  hardware: "shadow-[0_0_15px_hsl(38_60%_30%/0.3)]",
  data: "shadow-[0_0_15px_hsl(150_80%_50%/0.3)]",
  milestone: "shadow-[0_0_15px_hsl(38_90%_55%/0.2)]",
};

const significanceBadge: Record<string, string> = {
  pioneering: "text-primary border-primary/30",
  influential: "text-accent border-accent/30",
  niche: "text-muted-foreground border-border",
};

const TimelineSection = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-50, 80]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.1, 1.15]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollLeft = el.scrollWidth;

    const handleWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft -= e.deltaY * 2;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section ref={sectionRef} id="timeline" className="py-24 relative overflow-hidden">
      {/* Architectural sketch background — gallery with parallax */}
      <motion.img
        src={bgTimelineGallery}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 0.065,
          filter: "blur(1px) saturate(0.25) brightness(0.6)",
          mixBlendMode: "luminosity",
          y: bgY,
          scale: bgScale,
        }}
        loading="lazy"
        width={1920}
        height={1080}
      />
      <div className="px-6 max-w-6xl mx-auto mb-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent/60 mb-3">
                &#47;&#47; Evolution
              </p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                Technologie-Zeitleiste
              </h2>
            </div>
            <p className="text-sm text-muted-foreground font-mono max-w-md text-right">
              ← Scroll nach unten um zurück in der Zeit zu reisen. Klicke auf Meilensteine für Details.
            </p>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto pb-8 scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: "auto" }}
      >
        <div className="inline-flex items-start gap-0 px-[calc(50vw-120px)] min-w-max">
          <div className="absolute left-0 right-0 top-[calc(50%-1px)] h-px bg-gradient-to-r from-transparent via-border to-transparent pointer-events-none" />

          {milestones.map((m, i) => {
            const isSelected = selected === i;
            const isTop = i % 2 === 0;

            return (
              <motion.div
                key={`${m.year}-${m.event}`}
                className="relative flex-shrink-0 w-44 cursor-pointer group"
                style={{ paddingTop: isTop ? 0 : 80, paddingBottom: isTop ? 80 : 0 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setSelected(isSelected ? null : i)}
              >
                <div className={`absolute left-[22px] ${isTop ? 'bottom-0 h-20' : 'top-0 h-20'} w-px bg-border/40 group-hover:bg-primary/40 transition-colors`} />

                <div className={`
                  absolute left-[16px] ${isTop ? 'bottom-[-6px]' : 'top-[-6px]'}
                  w-3 h-3 rounded-full border-2 border-background transition-all duration-300
                  ${typeColors[m.type]}
                  ${isSelected ? typeGlow[m.type] + ' scale-150' : 'group-hover:scale-125'}
                `} />

                <div className={`
                  pl-2 pr-4 transition-all duration-300
                  ${isSelected ? '' : 'group-hover:translate-y-[-2px]'}
                `}>
                  <span className="font-mono text-xs text-primary/70 block mb-0.5">{m.year}</span>
                  <span className={`text-xs font-display font-semibold block leading-tight transition-colors
                    ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary/80'}
                  `}>
                    {m.event}
                  </span>
                  <span className={`inline-block mt-1 w-1.5 h-1.5 rounded-full ${typeColors[m.type]}`} />
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className={`
                        absolute left-0 w-72 z-30 p-4 
                        bg-card border ${typeBorderColors[m.type]}
                        ${typeGlow[m.type]}
                        ${isTop ? 'top-full mt-2' : 'bottom-full mb-2'}
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-primary text-xs">{m.year}</span>
                        <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${significanceBadge[m.significance]}`}>
                          {m.significance}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-foreground text-sm mb-2">
                        {m.event}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {m.detail}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${typeColors[m.type]}`} />
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">{m.type}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="px-6 max-w-6xl mx-auto mt-6 relative">
        <div className="flex flex-wrap gap-6 font-mono text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Modelle & Algorithmen</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Software</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-dim" /> Hardware</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-terminal-green" /> Datasets</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary/60" /> Meilensteine</span>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
