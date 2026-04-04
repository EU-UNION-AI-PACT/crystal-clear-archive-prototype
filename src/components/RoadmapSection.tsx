import { motion } from "framer-motion";

const phases = [
  {
    phase: "Phase 1",
    title: "Minimal Viable Prototype",
    items: [
      "Basis-Ingest für Git-Repos + PDFs",
      "OAIS-konforme Speicherung",
      "Einfache Web-Suche",
      "DSpace/Archivematica + Custom Graph-Layer",
    ],
    status: "active",
  },
  {
    phase: "Phase 2",
    title: "KI-spezifische Erweiterung",
    items: [
      "Hugging Face Model Card Parser",
      "Emulations-Framework",
      "Semantische Suche (Vector DB)",
      "Community-Contributions",
    ],
    status: "planned",
  },
  {
    phase: "Phase 3",
    title: "Volle Skalierung",
    items: [
      "AI-gestützte Kuratierung",
      "Cloud/Hybrid-Setup",
      "Integrationen (Software Heritage, Europeana)",
      "Public API & Developer Portal",
    ],
    status: "future",
  },
];

const statusBorder: Record<string, string> = {
  active: "border-l-primary hover:shadow-[0_0_25px_hsl(38_90%_55%/0.1)]",
  planned: "border-l-accent/50 hover:shadow-[0_0_25px_hsl(150_60%_45%/0.08)]",
  future: "border-l-muted-foreground/20 hover:shadow-[0_0_20px_hsl(220_10%_50%/0.05)]",
};

const statusDot: Record<string, string> = {
  active: "bg-primary animate-pulse-glow",
  planned: "bg-accent/50",
  future: "bg-muted-foreground/30",
};

const techStack = [
  { category: "Storage", items: "MinIO · PostgreSQL · Neo4j", icon: "◇" },
  { category: "Backend", items: "Python · FastAPI · Celery", icon: "⬡" },
  { category: "Frontend", items: "Next.js · Timeline · Graph Visuals", icon: "△" },
  { category: "Preservation", items: "Archivematica · Custom Services", icon: "◎" },
];

const RoadmapSection = () => {
  return (
    <section id="roadmap" className="py-24 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-3">
            &#47;&#47; Roadmap
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Umsetzung & Phasen
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Inkrementell vom Proof-of-Concept zur voll skalierbaren Plattform. Jede Phase baut auf der vorherigen auf.
          </p>
        </motion.div>

        {/* Phases — staggered vertical layout instead of equal columns */}
        <div className="space-y-4">
          {phases.map((p, i) => (
            <motion.div
              key={p.phase}
              className={`
                border border-border border-l-2 bg-card/20 
                hover:bg-card/40 transition-all duration-500
                ${statusBorder[p.status]}
              `}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ marginLeft: `${i * 2}rem` }}
            >
              <div className="p-6 flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex items-center gap-3 shrink-0 md:w-48">
                  <span className={`w-2 h-2 rounded-full ${statusDot[p.status]}`} />
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">
                      {p.phase}
                    </span>
                    <h3 className="font-display font-semibold text-foreground text-sm">
                      {p.title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-wrap gap-2">
                  {p.items.map((item) => (
                    <span key={item} className="text-[11px] text-muted-foreground px-3 py-1.5 border border-border/50 bg-background/50 hover:border-primary/20 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech stack — horizontal cards */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-[10px] text-primary/50 tracking-[0.3em] uppercase mb-4">
            &#47;&#47; Tech Stack (Prototyp)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {techStack.map((t, i) => (
              <motion.div
                key={t.category}
                className="border border-border/50 p-4 bg-card/10 hover:border-primary/20 hover:shadow-[0_0_15px_hsl(38_90%_55%/0.05)] transition-all duration-500 group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="text-lg text-primary/20 group-hover:text-primary/40 transition-colors">{t.icon}</span>
                <span className="text-foreground text-xs font-semibold block mt-2 mb-1">{t.category}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{t.items}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RoadmapSection;
