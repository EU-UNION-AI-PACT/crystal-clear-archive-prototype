import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, Shield, Feather, ExternalLink } from "lucide-react";

const idTypes = [
  { value: "duns", label: "D-U-N-S ID", help: "https://www.dnb.com/duns.html" },
  { value: "vat", label: "VAT ID (USt-IdNr.)", help: "https://ec.europa.eu/taxation_customs/vies/" },
  { value: "orcid", label: "ORCID ID", help: "https://orcid.org/register" },
  { value: "lei", label: "LEI (Legal Entity Identifier)", help: "https://www.gleif.org/en/about-lei/get-an-lei-find-lei-issuing-organizations" },
  { value: "pic", label: "PIC ID (EU)", help: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/how-to-participate/participant-register" },
  { value: "ungm", label: "UNGM ID", help: "https://www.ungm.org/Account/Registration" },
  { value: "handelsregister", label: "Handelsregister ID", help: "https://www.handelsregister.de" },
];

const MemberPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"ids" | "wishes" | "peace">("ids");
  const [myIds, setMyIds] = useState<any[]>([]);
  const [myWishes, setMyWishes] = useState<any[]>([]);
  const [publishedWishes, setPublishedWishes] = useState<any[]>([]);
  const [hasSigned, setHasSigned] = useState(false);

  // ID form
  const [selectedIdType, setSelectedIdType] = useState("duns");
  const [idValue, setIdValue] = useState("");

  // Wish form
  const [wishTitle, setWishTitle] = useState("");
  const [wishContent, setWishContent] = useState("");

  // Peace message
  const [peaceMessage, setPeaceMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) loadData();
  }, [user, tab]);

  const loadData = async () => {
    if (tab === "ids") {
      const { data } = await supabase.from("member_ids").select("*").eq("user_id", user!.id);
      setMyIds(data || []);
    } else if (tab === "wishes") {
      const { data: mine } = await supabase.from("wishes").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      setMyWishes(mine || []);
      const { data: published } = await supabase.from("wishes").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(20);
      setPublishedWishes(published || []);
    } else if (tab === "peace") {
      const { data } = await supabase.from("peace_signatures").select("*").eq("user_id", user!.id);
      setHasSigned((data || []).length > 0);
    }
  };

  const [verifying, setVerifying] = useState(false);

  const submitId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idValue.trim()) return toast.error("Bitte ID-Wert eingeben.");

    const { data: inserted, error } = await supabase.from("member_ids").insert({
      user_id: user!.id,
      id_type: selectedIdType,
      id_value: idValue.trim(),
    }).select().single();

    if (error) {
      if (error.code === "23505") toast.error("Diese ID-Art hast du bereits eingereicht.");
      else toast.error("Fehler: " + error.message);
      return;
    }

    toast.success("ID eingereicht! Automatische Prüfung läuft...");
    setIdValue("");
    setVerifying(true);

    // Trigger auto-verification
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("verify-id", {
        body: {
          id_type: selectedIdType,
          id_value: idValue.trim() || inserted.id_value,
          member_id_record: inserted.id,
        },
      });

      if (res.data?.result?.verified) {
        toast.success(`✓ ${selectedIdType.toUpperCase()} automatisch verifiziert via ${res.data.result.source}!`);
      } else {
        toast.info(`Automatische Prüfung abgeschlossen — manuelle Verifizierung durch Admin erforderlich.`);
      }
    } catch (err) {
      console.error("Auto-verify error:", err);
      toast.info("Automatische Prüfung fehlgeschlagen — wird manuell geprüft.");
    }

    setVerifying(false);
    loadData();
  };

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishTitle.trim() || !wishContent.trim()) return toast.error("Bitte Titel und Inhalt ausfüllen.");

    const { error } = await supabase.from("wishes").insert({
      user_id: user!.id,
      title: wishTitle.trim(),
      content: wishContent.trim(),
    });

    if (error) {
      toast.error("Fehler: " + error.message);
    } else {
      toast.success("Herzenswunsch eingereicht! Der Admin prüft ihn.");
      setWishTitle("");
      setWishContent("");
      loadData();
    }
  };

  const signPeace = async () => {
    const { error } = await supabase.from("peace_signatures").insert({
      user_id: user!.id,
      message: peaceMessage.trim() || null,
    });

    if (error) {
      if (error.code === "23505") toast.info("Du hast bereits unterschrieben.");
      else toast.error("Fehler: " + error.message);
    } else {
      toast.success("Danke für dein Zeichen des Friedens! 🕊️");
      setHasSigned(true);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-sm">Laden...</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="font-display font-bold text-sm text-primary hover:text-glow-primary transition-all">ATHA</button>
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest">// MEMBER</span>
            {profile && (
              <span className="font-mono text-[9px] text-primary border border-primary/30 px-1.5 py-0.5">
                ID: {profile.auth_id}
              </span>
            )}
          </div>
          <button onClick={() => navigate("/")} className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">← Zurück</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border border-border">
          {[
            { id: "ids" as const, label: "ID-Verifizierung", icon: Shield },
            { id: "wishes" as const, label: "Wunschportal", icon: Heart },
            { id: "peace" as const, label: "Friedensengel", icon: Feather },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-xs tracking-wider transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ID Verification */}
        {tab === "ids" && (
          <div className="space-y-6">
            <div className="border border-border bg-card p-6">
              <h2 className="font-display font-bold text-foreground text-lg mb-2">ID einreichen</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Reiche eine deiner offiziellen IDs ein. Sie wird automatisch geprüft und vom Admin verifiziert.
              </p>
              <form onSubmit={submitId} className="space-y-4">
                <div>
                  <select
                    value={selectedIdType}
                    onChange={(e) => setSelectedIdType(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground focus:border-primary/50 focus:outline-none"
                  >
                    {idTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={idValue}
                    onChange={(e) => setIdValue(e.target.value)}
                    placeholder="ID-Nummer eingeben..."
                    className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <button type="submit" disabled={verifying} className="px-6 py-2.5 bg-primary text-primary-foreground font-mono text-xs tracking-wider uppercase border border-primary hover:bg-primary/90 transition-colors border-glow disabled:opacity-50">
                  {verifying ? "Prüfung läuft..." : "ID einreichen"}
                </button>
              </form>
            </div>

            {/* Help section */}
            <div className="border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground text-sm mb-3">Wo bekommst du eine ID?</h3>
              <div className="space-y-2">
                {idTypes.map((t) => (
                  <a
                    key={t.value}
                    href={t.help}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 border border-border/50 hover:border-primary/30 transition-colors group"
                  >
                    <span className="font-mono text-xs text-foreground group-hover:text-primary transition-colors">{t.label}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </div>

            {/* My IDs */}
            {myIds.length > 0 && (
              <div className="border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-foreground text-sm mb-3">Meine IDs</h3>
                <div className="space-y-2">
                  {myIds.map((mid) => (
                    <div key={mid.id} className="flex items-center justify-between p-3 border border-border/50">
                      <div>
                        <span className="font-mono text-xs text-primary uppercase">{mid.id_type}</span>
                        <span className="font-mono text-sm text-foreground ml-2">{mid.id_value}</span>
                        {mid.auto_verified && (
                          <span className="font-mono text-[9px] text-accent ml-2">⚡ Auto-verifiziert</span>
                        )}
                        {mid.verification_details && (
                          <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
                            {mid.verification_details.legalName || mid.verification_details.givenName || mid.verification_details.name || mid.verification_details.note || ""}
                          </p>
                        )}
                      </div>
                      <span className={`font-mono text-[9px] px-2 py-0.5 border shrink-0 ${
                        mid.verified ? "text-accent border-accent/30" : mid.auto_verified ? "text-primary border-primary/30" : "text-muted-foreground border-border"
                      }`}>
                        {mid.verified ? "✓ Verifiziert" : mid.auto_verified ? "⚡ Auto-OK" : "Ausstehend"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wish Portal */}
        {tab === "wishes" && (
          <div className="space-y-6">
            <div className="border border-border bg-card p-6">
              <h2 className="font-display font-bold text-foreground text-lg mb-2">🌟 Herzenswunsch einreichen</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Teile einen Wunsch für das gemeinsame Wohlergehen — nicht eigensinnig, sondern von Herzen.
              </p>
              <form onSubmit={submitWish} className="space-y-4">
                <input
                  type="text"
                  value={wishTitle}
                  onChange={(e) => setWishTitle(e.target.value)}
                  placeholder="Titel deines Wunsches..."
                  maxLength={200}
                  className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none"
                />
                <textarea
                  value={wishContent}
                  onChange={(e) => setWishContent(e.target.value)}
                  placeholder="Beschreibe deinen Herzenswunsch..."
                  maxLength={2000}
                  rows={4}
                  className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground/50">{wishContent.length}/2000</span>
                  <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground font-mono text-xs tracking-wider uppercase border border-primary hover:bg-primary/90 transition-colors border-glow">
                    Wunsch einreichen
                  </button>
                </div>
              </form>
            </div>

            {/* Published wishes - Life Ticker */}
            {publishedWishes.length > 0 && (
              <div className="border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-foreground text-sm mb-4">🌍 Wunsch-Timeline (Life Ticker)</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {publishedWishes.map((w, i) => (
                    <motion.div
                      key={w.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 p-3 border-l-2 border-primary/30"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <h4 className="font-display font-semibold text-foreground text-xs">{w.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{w.content}</p>
                        <p className="font-mono text-[9px] text-muted-foreground/40 mt-1">
                          {w.published_at ? new Date(w.published_at).toLocaleString("de-DE") : ""}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* My wishes */}
            {myWishes.length > 0 && (
              <div className="border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-foreground text-sm mb-3">Meine Wünsche</h3>
                <div className="space-y-2">
                  {myWishes.map((w) => (
                    <div key={w.id} className="p-3 border border-border/50 flex items-start justify-between">
                      <div>
                        <span className="text-xs font-display font-semibold text-foreground">{w.title}</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{w.content.slice(0, 100)}...</p>
                      </div>
                      <span className={`font-mono text-[9px] px-2 py-0.5 border shrink-0 ${
                        w.status === "published" ? "text-primary border-primary/30" : w.status === "pending" ? "text-amber border-amber/30" : "text-destructive border-destructive/30"
                      }`}>
                        {w.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Peace Angel */}
        {tab === "peace" && (
          <div className="max-w-lg mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border bg-card p-8"
            >
              <div className="text-6xl mb-4">🕊️</div>
              <h2 className="font-display font-bold text-foreground text-xl mb-2">
                Friedensengel
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Setze ein Zeichen für den Zusammenhalt und das gemeinsame globale Wohlergehen.
                <br />
                <span className="text-xs text-muted-foreground/60 mt-1 block">
                  Im Geiste der EU-Union, des Völkergrundgesetzes, des AI PACT und der Digitalisierungs-Verordnung.
                </span>
              </p>

              {hasSigned ? (
                <div className="border border-accent/30 bg-accent/5 p-4">
                  <p className="font-mono text-sm text-accent">✓ Du hast bereits unterschrieben. Danke!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={peaceMessage}
                    onChange={(e) => setPeaceMessage(e.target.value)}
                    placeholder="Optionale Nachricht für den Frieden... (max 500 Zeichen)"
                    maxLength={500}
                    rows={3}
                    className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none resize-none"
                  />
                  <button
                    onClick={signPeace}
                    className="w-full py-4 bg-primary text-primary-foreground font-display font-bold text-sm tracking-wider border border-primary hover:bg-primary/90 transition-colors border-glow"
                  >
                    🕊️ Zeichen setzen — Für den Frieden
                  </button>
                </div>
              )}
            </motion.div>

            <div className="border border-border/50 p-4">
              <p className="font-mono text-[9px] text-muted-foreground/50 leading-relaxed">
                Restringiert durch die Grundsätze des gemeinschaftlichen Friedens und gemeinsamen Wohlergehens.
                <br />
                EU-UNION · Völkergrundgesetz · Humanitäres Grundgesetz · AI PACT · Digitalisierungs-PACT
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberPage;
