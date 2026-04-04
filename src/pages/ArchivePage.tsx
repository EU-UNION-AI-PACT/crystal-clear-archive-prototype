import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { archiveCategories } from "@/data/archiveData";

const statusStyles: Record<string, { label: string; dot: string; badge: string }> = {
  active: { label: "Aktiv", dot: "bg-accent", badge: "text-accent border-accent/30" },
  archived: { label: "Archiviert", dot: "bg-amber-dim", badge: "text-amber-dim border-amber-dim/30" },
  historic: { label: "Historisch", dot: "bg-primary", badge: "text-primary border-primary/30" },
};

const ArchivePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const category = archiveCategories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-primary text-sm mb-4">404 — Kategorie nicht gefunden</p>
          <Link to="/" className="text-muted-foreground hover:text-primary font-mono text-xs transition-colors">
            ← Zurück zum Archiv
          </Link>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Heritage Archive
          </button>
          <span className="font-mono text-[10px] text-muted-foreground/50 tracking-widest uppercase">
            {category.tag}
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-dots opacity-10" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-5 mb-6">
              <div
                className="w-14 h-14 flex items-center justify-center border border-border"
                style={{ boxShadow: `0 0 20px ${category.glowColor}` }}
              >
                <Icon className={`w-6 h-6 ${category.color}`} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
                  &#47;&#47; Archive / {category.tag}
                </p>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                  {category.title}
                </h1>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed ml-[76px]">
              {category.description}
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="mt-8 ml-[76px] flex gap-6 font-mono text-[10px] text-muted-foreground/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span>{category.entries.length} Einträge</span>
            <span>{category.entries.filter(e => e.status === "active").length} aktiv</span>
            <span>{category.entries.filter(e => e.status === "historic").length} historisch</span>
          </motion.div>
        </div>
      </section>

      {/* Entries */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-3">
            {category.entries.map((entry, i) => {
              const st = statusStyles[entry.status];
              return (
                <motion.div
                  key={entry.name}
                  className="group border border-border bg-card/20 hover:bg-card/50 hover:border-primary/20 transition-all duration-500 overflow-hidden"
                  style={{
                    boxShadow: "none",
                  }}
                  whileHover={{
                    boxShadow: `0 0 25px ${category.glowColor.replace("0.3", "0.08")}`,
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  {/* Top glow */}
                  <div className="h-px bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-primary/20 transition-all duration-700" />

                  <div className="p-5 flex flex-col md:flex-row md:items-start gap-4">
                    {/* Left: year + status */}
                    <div className="flex items-center gap-3 md:w-32 shrink-0">
                      {entry.year && (
                        <span className="font-mono text-xs text-primary/60">{entry.year}</span>
                      )}
                      <span className={`flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${st.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </div>

                    {/* Center: content */}
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                        {entry.name}
                        <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {entry.desc}
                      </p>
                    </div>

                    {/* Right: tags */}
                    <div className="flex flex-wrap gap-1.5 md:w-48 md:justify-end shrink-0">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-mono text-muted-foreground/50 px-1.5 py-0.5 border border-border/40 group-hover:border-border group-hover:text-muted-foreground/70 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Back to overview */}
      <footer className="pb-16 px-6 text-center">
        <Link
          to="/#categories"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          Alle Kategorien anzeigen
        </Link>
      </footer>
    </div>
  );
};

export default ArchivePage;
