import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const nodes = [
  { id: "user", label: "User / API", x: 80, y: 50, color: "amber", tier: 0, detail: "Web-UI, REST/GraphQL APIs für Forscher, Entwickler und Institutionen" },
  { id: "access", label: "Access Layer", x: 280, y: 50, color: "amber", tier: 0, detail: "React Frontend + Elasticsearch + Vector Search für semantische Ähnlichkeit" },
  { id: "search", label: "Search Engine", x: 480, y: 30, color: "green", tier: 0, detail: "Volltextsuche + facettierte Filterung + Zeitleisten-Navigation" },
  { id: "ingest", label: "Ingest Service", x: 200, y: 150, color: "green", tier: 1, detail: "SIP Creation: Apache Tika + Code-Analyzer extrahieren automatisch Metadaten" },
  { id: "metadata", label: "Metadata Extract", x: 420, y: 120, color: "green", tier: 1, detail: "Dublin Core + PREMIS + CodeMeta Standards für reichhaltige Metadaten" },
  { id: "validate", label: "Validation", x: 530, y: 160, color: "amber", tier: 1, detail: "Format-Validation via DROID/JHOVE, Fixity-Checks mit SHA-256+" },
  { id: "preserve", label: "Preservation", x: 280, y: 250, color: "amber", tier: 2, detail: "AIP Creation: Bitstream + Metadaten + Provenienz. Aktive Migration & Emulation" },
  { id: "aip", label: "AIP Creation", x: 500, y: 240, color: "green", tier: 2, detail: "Archival Information Package nach OAIS: Native + Derived Files" },
  { id: "objstore", label: "Object Store", x: 120, y: 350, color: "green", tier: 3, detail: "MinIO/S3: Tiered Hot/Cold Storage für große Modelle und Datasets" },
  { id: "graphdb", label: "Graph DB", x: 320, y: 350, color: "amber", tier: 3, detail: "Neo4j: Beziehungen zwischen Artefakten — 'Modell X basiert auf Y, beeinflusste Z'" },
  { id: "reldb", label: "PostgreSQL", x: 520, y: 350, color: "green", tier: 3, detail: "Metadaten-Katalog, Suchindex, Nutzerverwaltung" },
  { id: "planning", label: "Planning & Admin", x: 320, y: 430, color: "amber", tier: 4, detail: "PRONOM Format-Registry, Obsoleszenz-Monitoring, Migration-Vorschläge" },
];

const edges: [string, string][] = [
  ["user", "access"], ["access", "search"], ["access", "ingest"],
  ["ingest", "metadata"], ["ingest", "validate"], ["ingest", "preserve"],
  ["preserve", "aip"], ["preserve", "objstore"], ["preserve", "graphdb"], ["preserve", "reldb"],
  ["planning", "objstore"], ["planning", "graphdb"], ["planning", "reldb"],
  // Feedback loops
  ["planning", "preserve"], ["aip", "objstore"],
];

const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

const particles = edges.flatMap(([from, to], ei) => {
  const count = 2 + (ei % 3);
  return Array.from({ length: count }, (_, pi) => ({
    from, to, delay: pi * 1.5 + ei * 0.3, dur: 2.5 + (ei * 0.4 % 2),
  }));
});

const NetworkDiagram = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const activeNodeData = activeNode ? nodeMap[activeNode] : null;

  // Get connected edges for highlighting
  const connectedEdges = activeNode
    ? edges.filter(([f, t]) => f === activeNode || t === activeNode)
    : [];

  return (
    <motion.div
      className="mt-8 border border-border bg-card p-4 overflow-hidden hover:border-primary/20 hover:shadow-[0_0_25px_hsl(38_90%_55%/0.06)] transition-all duration-500 relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[10px] text-primary/50 tracking-[0.3em] uppercase">
          &#47;&#47; Live SVG Netzwerk-Diagramm
        </p>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="font-mono text-[9px] text-muted-foreground/40 hover:text-primary/60 transition-colors px-2 py-0.5 border border-border/30 hover:border-primary/20"
        >
          {isPaused ? "▶ Play" : "⏸ Pause"}
        </button>
      </div>

      <div className="flex justify-center">
        <svg
          viewBox="0 0 640 480"
          className="w-full max-w-[680px] h-auto"
          style={{ "--c-amber": "hsl(38 90% 55%)", "--c-green": "hsl(150 60% 45%)" } as React.CSSProperties}
        >
          <defs>
            <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="hsl(38 90% 55%)" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="hsl(150 60% 45%)" floodOpacity="0.6" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="hsl(38 90% 55%)" floodOpacity="0.8" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Living preservation glow */}
            <filter id="living-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="1" result="noise">
                <animate attributeName="baseFrequency" values="0.02;0.04;0.02" dur="8s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            <linearGradient id="tier-line" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="hsl(38 90% 55%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(38 90% 55%)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(38 90% 55%)" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="halo-amber">
              <stop offset="0%" stopColor="hsl(38 90% 55%)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(38 90% 55%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="halo-green">
              <stop offset="0%" stopColor="hsl(150 60% 45%)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(150 60% 45%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Tier separator lines */}
          {[95, 195, 295, 395].map((y) => (
            <line key={y} x1="20" y1={y} x2="620" y2={y} stroke="url(#tier-line)" strokeWidth="1" />
          ))}

          {/* Tier labels */}
          {[
            { y: 60, label: "INTERFACE" },
            { y: 155, label: "PROCESSING" },
            { y: 255, label: "PRESERVATION" },
            { y: 355, label: "STORAGE" },
            { y: 440, label: "GOVERNANCE" },
          ].map((t) => (
            <text key={t.label} x="620" y={t.y} textAnchor="end" className="fill-muted-foreground/20" style={{ fontSize: "8px", fontFamily: "'Space Mono', monospace" }}>
              {t.label}
            </text>
          ))}

          {/* Edges */}
          {edges.map(([from, to], i) => {
            const a = nodeMap[from];
            const b = nodeMap[to];
            const isHighlighted = connectedEdges.some(([f, t]) => f === from && t === to);
            return (
              <motion.line
                key={`edge-${i}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={isHighlighted ? "hsl(38 90% 55%)" : "hsl(38 90% 55%)"}
                strokeOpacity={isHighlighted ? 0.4 : 0.08}
                strokeWidth={isHighlighted ? 1.5 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.08 }}
                style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
              />
            );
          })}

          {/* Flowing particles */}
          {!isPaused && particles.map((p, i) => {
            const a = nodeMap[p.from];
            const b = nodeMap[p.to];
            const isOnActive = activeNode && (p.from === activeNode || p.to === activeNode);
            return (
              <circle key={`p-${i}`} r={isOnActive ? 3 : 2.5} fill="hsl(38 90% 55%)" filter="url(#particle-glow)" opacity={isOnActive ? 1 : 0.8}>
                <animateMotion
                  dur={`${isOnActive ? p.dur * 0.6 : p.dur}s`}
                  repeatCount="indefinite"
                  begin={`${p.delay}s`}
                  path={`M${a.x},${a.y} L${b.x},${b.y}`}
                />
                <animate attributeName="opacity" values="0;0.9;0.9;0" dur={`${p.dur}s`} repeatCount="indefinite" begin={`${p.delay}s`} />
              </circle>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const isAmber = node.color === "amber";
            const isActive = activeNode === node.id;
            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
                style={{ cursor: "pointer" }}
                onClick={() => setActiveNode(isActive ? null : node.id)}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                {/* Halo */}
                <circle cx={node.x} cy={node.y} r="22" fill={isAmber ? "url(#halo-amber)" : "url(#halo-green)"}>
                  {!isPaused && (
                    <animate attributeName="r" values={isActive ? "22;30;22" : "18;24;18"} dur={isActive ? "2s" : "4s"} repeatCount="indefinite" begin={`${i * 0.5}s`} />
                  )}
                </circle>

                {/* Living glow on preservation nodes */}
                {node.tier === 2 && !isPaused && (
                  <circle cx={node.x} cy={node.y} r="14" fill="none" stroke={isAmber ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)"} strokeWidth="0.3" strokeOpacity="0.2" filter="url(#living-glow)" />
                )}

                {/* Ring */}
                <circle cx={node.x} cy={node.y} r={isActive ? 10 : 7} fill="none" stroke={isAmber ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)"} strokeWidth={isActive ? 1 : 0.5} strokeOpacity={isActive ? 0.6 : 0.3} style={{ transition: "all 0.3s ease" }}>
                  {!isPaused && (
                    <animateTransform attributeName="transform" type="rotate" values={`0 ${node.x} ${node.y};360 ${node.x} ${node.y}`} dur="20s" repeatCount="indefinite" />
                  )}
                </circle>

                {/* Core */}
                <circle cx={node.x} cy={node.y} r={isActive ? 6 : 4} fill={isAmber ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)"} filter={isAmber ? "url(#glow-amber)" : "url(#glow-green)"} style={{ transition: "r 0.3s ease" }}>
                  {!isPaused && (
                    <animate attributeName="r" values={isActive ? "6;7;6" : "4;4.5;4"} dur="2s" repeatCount="indefinite" />
                  )}
                </circle>

                {/* Label */}
                <text x={node.x} y={node.y + 20} textAnchor="middle" className="fill-foreground/50" style={{ fontSize: isActive ? "10px" : "9px", fontFamily: "'Space Mono', monospace", fontWeight: isActive ? 600 : 400, transition: "all 0.3s" }}>
                  {node.label}
                </text>
              </motion.g>
            );
          })}

          {/* Active node detail tooltip */}
          {activeNodeData && (
            <g>
              <rect
                x={Math.min(Math.max(activeNodeData.x - 115, 10), 400)}
                y={activeNodeData.y - 65}
                width={230}
                height={42}
                rx={3}
                fill="hsl(220 20% 8%)"
                fillOpacity="0.92"
                stroke={activeNodeData.color === "amber" ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)"}
                strokeWidth="0.5"
                strokeOpacity="0.4"
              />
              <text
                x={Math.min(Math.max(activeNodeData.x, 125), 515)}
                y={activeNodeData.y - 48}
                textAnchor="middle"
                fill={activeNodeData.color === "amber" ? "hsl(38 90% 55%)" : "hsl(150 60% 45%)"}
                style={{ fontSize: "8px", fontFamily: "'Space Mono', monospace" }}
              >
                {activeNodeData.detail.slice(0, 55)}
              </text>
              <text
                x={Math.min(Math.max(activeNodeData.x, 125), 515)}
                y={activeNodeData.y - 35}
                textAnchor="middle"
                fill="hsl(0 0% 60%)"
                style={{ fontSize: "7px", fontFamily: "'Space Mono', monospace" }}
              >
                {activeNodeData.detail.slice(55, 110)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-4 font-mono text-[9px] text-muted-foreground/40">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> OAIS Core</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Services</span>
        </div>
        <p className="font-mono text-[8px] text-muted-foreground/30">
          Hover/Klick auf Nodes für Details
        </p>
      </div>
    </motion.div>
  );
};

export default NetworkDiagram;
