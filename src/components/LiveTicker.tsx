import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Wish {
  id: string;
  title: string;
  content: string;
  published_at: string | null;
}

const LiveTicker = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWishId, setNewWishId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial published wishes
    const fetchWishes = async () => {
      const { data } = await supabase
        .from("wishes")
        .select("id, title, content, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(8);
      if (data) setWishes(data);
    };
    fetchWishes();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("live-ticker-wishes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishes",
          filter: "status=eq.published",
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const newWish = payload.new as Wish;
            if ((payload.new as any).status === "published") {
              setWishes((prev) => {
                const filtered = prev.filter((w) => w.id !== newWish.id);
                return [newWish, ...filtered].slice(0, 8);
              });
              setNewWishId(newWish.id);
              setTimeout(() => setNewWishId(null), 3000);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (wishes.length === 0) return null;

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-mono tracking-wider text-primary uppercase">
              Live
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
            Herzenswünsche — Live-Ticker
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Die neuesten veröffentlichten Wünsche in Echtzeit
          </p>
        </motion.div>

        {/* Ticker Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {wishes.map((wish, i) => (
              <motion.div
                key={wish.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`
                  relative p-4 rounded-lg border bg-card
                  transition-colors duration-500
                  ${newWishId === wish.id ? "border-primary/60 shadow-[0_0_20px_-6px_hsl(var(--primary)/0.3)]" : "border-border/30"}
                `}
              >
                {newWishId === wish.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-2 right-2"
                  >
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </motion.div>
                )}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded bg-primary/10">
                    <Heart className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {wish.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {wish.content}
                    </p>
                    {wish.published_at && (
                      <span className="text-[10px] text-muted-foreground/60 font-mono mt-2 block">
                        {new Date(wish.published_at).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LiveTicker;
