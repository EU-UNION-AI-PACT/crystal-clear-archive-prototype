import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { archiveCategories } from "@/data/archiveData";

const layoutMap: Record<number, string> = {
  0: "col-span-2 row-span-2",
  1: "col-span-1",
  2: "col-span-1",
  3: "col-span-2",
  4: "col-span-1",
  5: "col-span-2 row-span-2",
  6: "col-span-1",
  7: "col-span-1",
  8: "col-span-2",
  9: "col-span-1",
  10: "col-span-1",
  11: "col-span-2",
};

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="categories" className="py-24 px-6 relative">
      <div className="absolute inset-0 grid-dots opacity-15" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-lg">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent/60 mb-3">
                &#47;&#47; {archiveCategories.length} Archive
              </p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
                Kategorien &<br/>Archive
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Jede Kategorie ist ein eigenständiges Archiv-Portal. Klicke auf ein Feld, um die vollständige Sammlung zu durchsuchen.
              </p>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground/40 max-w-xs md:text-right">
              {archiveCategories.reduce((acc, c) => acc + c.entries.length, 0)} Einträge · {archiveCategories.filter(c => c.entries.some(e => e.status === "historic")).length} historische Sammlungen
            </p>
          </div>
        </motion.div>

        {/* Asymmetric bento grid with archive links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {archiveCategories.map((cat, i) => {
            const layout = layoutMap[i] || "col-span-1";
            const isFeatured = layout.includes("row-span-2");
            const Icon = cat.icon;

            return (
              <motion.button
                key={cat.slug}
                onClick={() => navigate(`/archive/${cat.slug}`)}
                className={`
                  ${layout}
                  group relative overflow-hidden text-left
                  border border-border bg-card
                  card-hover-lift
                  hover:border-primary/30
                  hover:shadow-[0_0_25px_hsl(38_90%_55%/0.12)]
                `}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
              >
                {/* Top glow line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/40 transition-all duration-700" />
                
                {/* Bottom glow line */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/20 transition-all duration-700" />

                <div className={`relative h-full ${isFeatured ? 'p-7' : 'p-4'}`}>
                  {/* Tag corner */}
                  <span className="absolute top-3 right-3 font-mono text-[8px] tracking-[0.2em] text-muted-foreground/25 group-hover:text-primary/40 transition-colors duration-500">
                    {cat.tag}
                  </span>

                  <div className={`${isFeatured ? 'flex flex-col justify-between h-full' : ''}`}>
                    <div className="hover-content-shift">
                      <Icon
                        className={`
                          ${cat.color} opacity-50 group-hover:opacity-100 transition-all duration-500
                          ${isFeatured ? 'w-7 h-7 mb-5' : 'w-4 h-4 mb-2'}
                        `}
                        strokeWidth={1.5}
                      />
                      <h3 className={`font-display font-semibold text-foreground group-hover:text-primary/90 transition-colors duration-300
                        ${isFeatured ? 'text-base mb-2' : 'text-[11px] mb-1'}
                      `}>
                        {cat.title}
                      </h3>
                      <p className={`text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors duration-500
                        ${isFeatured ? 'text-xs' : 'text-[10px]'}
                      `}>
                        {cat.subtitle}
                      </p>
                    </div>

                    {isFeatured && (
                      <div className="mt-4 border-t border-border/50 pt-3 flex items-center justify-between group-hover:border-primary/20 transition-colors duration-500">
                        <span className="font-mono text-[10px] text-muted-foreground/40">
                          {cat.entries.length} Einträge
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[10px] text-primary/50 group-hover:text-primary transition-colors">
                          Archiv öffnen
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    )}

                    {!isFeatured && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="font-mono text-[9px] text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-300">
                          {cat.entries.length}
                        </span>
                        <ArrowRight className="w-2.5 h-2.5 text-muted-foreground/20 group-hover:text-primary/50 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
