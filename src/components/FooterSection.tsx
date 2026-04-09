import { motion } from "framer-motion";

const FooterSection = () => {
  return (
    <footer className="py-16 px-6 border-t border-border relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          className="flex flex-col md:flex-row items-start justify-between gap-8"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.h3
              className="font-display font-bold text-foreground text-lg mb-2"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              AI & Tech Heritage Archive
            </motion.h3>
            <p className="text-xs text-muted-foreground font-mono max-w-sm leading-relaxed">
              Structured knowledge. Preserved technology.
              <br />
              Ein OAIS-basiertes Archiv für die Bewahrung 
              der KI- und Technologiegeschichte.
            </p>
          </div>

          <div className="font-mono text-xs text-muted-foreground space-y-1">
            <p>Prototyp-Architektur v1.0</p>
            <p>OAIS · ISO 14721 · ISO 16363</p>
            <motion.p
              className="text-primary/50"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              © {new Date().getFullYear()} Heritage Archive Project
            </motion.p>
          </div>
        </motion.div>

        {/* Decorative bottom line */}
        <motion.div
          className="mt-12 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </footer>
  );
};

export default FooterSection;
