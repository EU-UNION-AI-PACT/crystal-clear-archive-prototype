const FooterSection = () => {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <h3 className="font-display font-bold text-foreground text-lg mb-2">
              AI & Tech Heritage Archive
            </h3>
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
            <p className="text-primary/50">
              © {new Date().getFullYear()} Heritage Archive Project
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
