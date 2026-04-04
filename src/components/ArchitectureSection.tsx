import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import NetworkDiagram from "./NetworkDiagram";
import bgArchitectureBlueprint from "@/assets/bg-architecture-blueprint.jpg";

const layers = [
  {
    label: "Access Layer",
    detail: "Web-UI (React) + REST/GraphQL APIs + Semantische Suche",
    tech: ["Elasticsearch", "Vector Search", "React"],
    color: "primary" as const,
  },
  {
    label: "Ingest Service",
    detail: "Metadata Extraction → Validation → SIP Creation",
    tech: ["Apache Tika", "Code-Analyzer", "DROID"],
    color: "accent" as const,
  },
  {
    label: "Preservation Service",
    detail: "AIP Creation · Bitstream + Metadata + Provenance",
    tech: ["Archivematica", "BagIt", "PREMIS"],
    color: "primary" as const,
  },
  {
    label: "Storage Layer",
    detail: "Object Store + Graph DB + Relational DB",
    tech: ["MinIO", "Neo4j", "PostgreSQL"],
    color: "accent" as const,
  },
  {
    label: "Planning & Admin",
    detail: "Obsoleszenz-Monitoring · Migration · Policies",
    tech: ["PRONOM", "JHOVE", "Fixity Checks"],
    color: "primary" as const,
  },
];

const ArchitectureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.06, 0.15, 0.15, 0.06]);

  return (
    <section ref={sectionRef} id="architecture" className="py-24 px-6 relative border-t border-border overflow-hidden">
      {/* Architectural sketch background — sharp, no blur */}
      <motion.img
        src={bgArchitectureBlueprint}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: bgOpacity,
          filter: "saturate(0.25) brightness(0.55)",
          mixBlendMode: "luminosity",
          y: bgY,
        }}
        loading="lazy"
        width={1920}
        height={1080}
      />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="md:flex md:items-start md:justify-between gap-12">
            <div className="md:max-w-sm">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-3">
                &#47;&#47; System Design
              </p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                System&shy;architektur
              </h2>
            </div>
            <div className="mt-6 md:mt-2 md:max-w-md">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hybride, verteilte Architektur basierend auf dem OAIS-Referenzmodell.
                Containerisiert (Docker/K8s), skalierbar und erweiterbar durch Microservices.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.label}
              className={`
                group border border-border bg-card
                hover:border-primary/20
                hover:shadow-[0_0_20px_hsl(38_90%_55%/0.06)]
                transition-all duration-500 overflow-hidden
              `}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <div className={`
                  w-full md:w-1 h-1 md:h-auto md:self-stretch shrink-0
                  ${layer.color === 'accent' ? 'bg-accent/40 group-hover:bg-accent/70' : 'bg-primary/40 group-hover:bg-primary/70'}
                  transition-colors
                `} />
                
                <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${layer.color === 'accent' ? 'bg-accent' : 'bg-primary'}`} />
                    <h3 className="font-mono text-sm font-bold text-foreground tracking-wide uppercase">
                      {layer.label}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-muted-foreground font-mono md:text-center flex-1">
                    {layer.detail}
                  </p>

                  <div className="flex gap-2 flex-wrap md:justify-end">
                    {layer.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] font-mono border border-border/60 text-muted-foreground/80 group-hover:border-primary/20 group-hover:text-muted-foreground transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center my-4">
          <div className="flex flex-col items-center gap-1 text-primary/30">
            <span className="text-lg">↕</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div
            className="border border-border p-5 bg-card font-mono text-xs text-muted-foreground hover:border-primary/20 hover:shadow-[0_0_15px_hsl(38_90%_55%/0.05)] transition-all duration-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary/60 mb-2 text-[10px] tracking-wider">&#47;&#47; DATENFLUSS</p>
            <p>User/API → Access Layer → Ingest</p>
            <p>→ Preservation → Storage</p>
          </motion.div>
          <motion.div
            className="border border-border p-5 bg-card font-mono text-xs text-muted-foreground hover:border-accent/20 hover:shadow-[0_0_15px_hsl(150_60%_45%/0.05)] transition-all duration-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <p className="text-accent/60 mb-2 text-[10px] tracking-wider">&#47;&#47; EDGE CASES</p>
            <p>Chunked Upload · WARC Integration</p>
            <p>VM-Metadaten · Emulations-Links</p>
          </motion.div>
        </div>

        <NetworkDiagram />
      </div>
    </section>
  );
};

export default ArchitectureSection;
