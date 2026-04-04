import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import bgPrinciplesTemple from "@/assets/bg-principles-temple.jpg";

const principles = [
  { id: "01", title: "OAIS-Konformität", desc: "Ingest (SIP → AIP), Preservation Planning, Dissemination (DIP)", icon: "◈" },
  { id: "02", title: "Modularität", desc: "Microservices für leichte Erweiterbarkeit — neue Parser jederzeit", icon: "⬡" },
  { id: "03", title: "Langfristige Preservation", desc: "Bitstream-Erhaltung + aktive Migration/Emulation. Native + Derived Files", icon: "◇" },
  { id: "04", title: "Metadaten-First", desc: "Dublin Core, PREMIS, CodeMeta, PROV — reichhaltig und standardisiert", icon: "▣" },
  { id: "05", title: "Skalierbarkeit", desc: "Object Storage (S3), tiered hot/cold Storage, Kosteneffizienz", icon: "△" },
  { id: "06", title: "Offenheit", desc: "REST/GraphQL-APIs, SWHID-ähnliche persistente Identifier, Open Source", icon: "◎" },
  { id: "07", title: "Trust & Sicherheit", desc: "SHA-256+ Checksums, Audit-Trails, ISO 16363 Trusted Repository", icon: "⬢" },
  { id: "08", title: "Nutzerzentriert", desc: "Zeitleisten, semantische Suche, Evolution entdecken", icon: "◉" },
];

const cardVariants = [
  "col-span-1",
  "col-span-1 md:col-span-2",
  "col-span-1",
  "col-span-1",
  "col-span-1 md:col-span-2",
  "col-span-1",
  "col-span-1",
  "col-span-1",
];

const PrinciplesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={sectionRef} id="principles" className="py-24 px-6 border-t border-border relative overflow-hidden">
      {/* Architectural sketch background — sharp, no blur */}
      <motion.img
        src={bgPrinciplesTemple}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 0.12,
          filter: "saturate(0.25) brightness(0.5)",
          mixBlendMode: "luminosity",
          y: bgY,
        }}
        loading="lazy"
        width={1920}
        height={1080}
      />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/60 mb-3">
                &#47;&#47; Foundations
              </p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                Design-Prinzipien
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed md:text-right">
              Acht Grundsätze aus OAIS und modernen Best Practices — die Basis des Archivs.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {principles.map((p, i) => {
            const isWide = cardVariants[i].includes("col-span-2");
            
            return (
              <motion.div
                key={p.id}
                className={`
                  ${cardVariants[i]} group relative overflow-hidden
                  border border-border bg-card
                  hover:border-primary/30
                  transition-all duration-500
                  hover:shadow-[0_0_20px_hsl(38_90%_55%/0.08)]
                `}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/50 transition-all duration-500" />
                
                <div className={`p-6 ${isWide ? 'flex items-start gap-6' : ''}`}>
                  <div className={`flex items-center gap-3 ${isWide ? 'shrink-0' : 'mb-4'}`}>
                    <span className="text-2xl text-primary/40 group-hover:text-primary/70 transition-colors">
                      {p.icon}
                    </span>
                    <span className="font-mono text-[10px] text-primary/50 tracking-wider">
                      {p.id}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-sm mb-2 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PrinciplesSection;
