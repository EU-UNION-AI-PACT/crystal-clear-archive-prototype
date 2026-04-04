import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { archiveCategories } from "@/data/archiveData";

interface SearchResult {
  type: "category" | "entry" | "timeline" | "principle";
  title: string;
  context: string;
  sectionId?: string;
  categorySlug?: string;
}

// All searchable content
const timelineData = [
  { year: "1943", event: "McCulloch-Pitts Neuron" },
  { year: "1950", event: "Turing-Test" },
  { year: "1956", event: "Dartmouth Conference" },
  { year: "1958", event: "Perceptron" },
  { year: "1966", event: "ELIZA" },
  { year: "1974", event: "Backpropagation" },
  { year: "1985", event: "Connection Machine" },
  { year: "1989", event: "LeNet / CNN" },
  { year: "1997", event: "Deep Blue & LSTM" },
  { year: "2012", event: "AlexNet" },
  { year: "2017", event: "Transformer" },
  { year: "2022", event: "ChatGPT & Diffusion" },
];

const principles = [
  "OAIS-Konformität", "Modularität", "Langfristige Preservation",
  "Metadaten-First", "Skalierbarkeit", "Offenheit", "Trust & Sicherheit", "Nutzerzentriert",
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onNavigate?: (slug: string) => void;
}

const SearchOverlay = ({ open, onClose, onNavigate }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    const r: SearchResult[] = [];

    // Search categories
    archiveCategories.forEach((cat) => {
      if (cat.title.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)) {
        r.push({ type: "category", title: cat.title, context: cat.subtitle, categorySlug: cat.slug });
      }
      // Search entries
      cat.entries.forEach((entry) => {
        if (entry.name.toLowerCase().includes(q) || entry.desc.toLowerCase().includes(q) || entry.tags.some(t => t.toLowerCase().includes(q))) {
          r.push({ type: "entry", title: entry.name, context: `${cat.tag} · ${entry.year || ""} — ${entry.desc.slice(0, 80)}...`, categorySlug: cat.slug });
        }
      });
    });

    // Search timeline
    timelineData.forEach((m) => {
      if (m.event.toLowerCase().includes(q) || m.year.includes(q)) {
        r.push({ type: "timeline", title: `${m.year} — ${m.event}`, context: "Zeitleiste", sectionId: "timeline" });
      }
    });

    // Search principles
    principles.forEach((p) => {
      if (p.toLowerCase().includes(q)) {
        r.push({ type: "principle", title: p, context: "Design-Prinzip", sectionId: "principles" });
      }
    });

    return r.slice(0, 12);
  }, [query]);

  const handleClick = useCallback((result: SearchResult) => {
    if (result.categorySlug && onNavigate) {
      onNavigate(result.categorySlug);
    } else if (result.sectionId) {
      const el = document.getElementById(result.sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
    onClose();
    setQuery("");
  }, [onClose, onNavigate]);

  const typeLabels: Record<string, string> = {
    category: "Kategorie",
    entry: "Eintrag",
    timeline: "Zeitleiste",
    principle: "Prinzip",
  };

  const typeColors: Record<string, string> = {
    category: "text-primary border-primary/30",
    entry: "text-accent border-accent/30",
    timeline: "text-amber-dim border-amber-dim/30",
    principle: "text-terminal-green border-terminal-green/30",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-xl mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="relative border border-border bg-card shadow-[0_0_30px_hsl(38_90%_55%/0.08)] focus-within:border-primary/40 focus-within:shadow-[0_0_40px_hsl(38_90%_55%/0.15)] transition-all duration-300">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Archiv durchsuchen..."
                className="w-full bg-transparent px-12 py-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
              <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 border border-border bg-card max-h-[50vh] overflow-y-auto"
              >
                {results.map((r, i) => (
                  <button
                    key={`${r.title}-${i}`}
                    onClick={() => handleClick(r)}
                    className="w-full text-left px-5 py-3 hover:bg-primary/5 border-b border-border/50 last:border-0 transition-all duration-200 group hover:shadow-[inset_0_0_20px_hsl(38_90%_55%/0.03)]"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${typeColors[r.type]}`}>
                        {typeLabels[r.type]}
                      </span>
                      <span className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {highlightMatch(r.title, query)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      {r.context}
                    </p>
                  </button>
                ))}
              </motion.div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="mt-2 border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground font-mono">Keine Ergebnisse für "{query}"</p>
              </div>
            )}

            {/* Hint */}
            <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground/40">
              ESC zum Schließen · Suche über alle Kategorien, Einträge und Meilensteine
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function highlightMatch(text: string, query: string) {
  if (!query || query.length < 2) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary text-glow-primary">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export default SearchOverlay;
