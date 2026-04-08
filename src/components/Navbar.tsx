import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, LogOut, Shield, Users } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useNavigate, useLocation } from "react-router-dom";
import SearchOverlay from "./SearchOverlay";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Prinzipien", href: "#principles" },
  { label: "Architektur", href: "#architecture" },
  { label: "Kategorien", href: "#categories" },
  { label: "Zeitleiste", href: "#timeline" },
  { label: "Roadmap", href: "#roadmap" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      if (!isHome) return;
      const sections = navItems.map((n) => n.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (href: string) => {
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(href.slice(1));
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <AnimatePresence>
        {(scrolled || !isHome) && (
          <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
          >
            <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
              <button
                onClick={() => {
                  if (isHome) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    navigate("/");
                  }
                }}
                className="font-display font-bold text-sm text-primary hover:text-glow-primary transition-all"
              >
                ATHA
              </button>

              <div className="flex items-center gap-1">
                {isHome && navItems.map((item) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className={`
                        relative px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-all duration-300 hidden md:block
                        ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                      `}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-glow"
                          className="absolute inset-0 border border-primary/30 bg-primary/5 -z-10"
                          style={{ boxShadow: "0 0 12px hsl(38 90% 55% / 0.15)" }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Search button */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="ml-2 flex items-center gap-2 px-3 py-1.5 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-[0_0_12px_hsl(38_90%_55%/0.1)] transition-all duration-300 font-mono text-[10px]"
                >
                  <Search className="w-3 h-3" />
                  <span className="hidden sm:inline">Suche</span>
                  <kbd className="hidden sm:inline text-[9px] text-muted-foreground/40 border border-border/40 px-1 py-0.5 ml-1">⌘K</kbd>
                </button>

                {/* Auth buttons */}
                {user ? (
                  <div className="flex items-center gap-1 ml-2">
                    <NotificationBell />
                    {isAdmin && (
                      <button
                        onClick={() => navigate("/admin")}
                        className="flex items-center gap-1 px-2 py-1.5 border border-primary/20 text-primary hover:bg-primary/5 transition-all font-mono text-[10px]"
                        title="Admin Panel"
                      >
                        <Shield className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/member")}
                      className="flex items-center gap-1 px-2 py-1.5 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all font-mono text-[10px]"
                      title="Member"
                    >
                      <Users className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-1 px-2 py-1.5 border border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all font-mono text-[10px]"
                      title="Abmelden"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className="ml-2 flex items-center gap-1 px-3 py-1.5 border border-primary/30 text-primary hover:bg-primary/5 transition-all font-mono text-[10px]"
                  >
                    <User className="w-3 h-3" />
                    Login
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(slug) => navigate(`/archive/${slug}`)}
      />
    </>
  );
};

export default Navbar;
