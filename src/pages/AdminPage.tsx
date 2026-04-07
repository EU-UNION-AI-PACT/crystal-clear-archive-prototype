import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, X, Eye, Users, FileText, Heart, Shield } from "lucide-react";

type Tab = "requests" | "members" | "wishes" | "ids";

const AdminPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("requests");
  const [requests, setRequests] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);
  const [memberIds, setMemberIds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin, tab]);

  const loadData = async () => {
    setLoading(true);
    if (tab === "requests") {
      const { data } = await supabase
        .from("registration_requests")
        .select("*")
        .order("created_at", { ascending: false });
      setRequests(data || []);
    } else if (tab === "members") {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setMembers(data || []);
    } else if (tab === "wishes") {
      const { data } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false });
      setWishes(data || []);
    } else if (tab === "ids") {
      const { data } = await supabase
        .from("member_ids")
        .select("*")
        .order("created_at", { ascending: false });
      setMemberIds(data || []);
    }
    setLoading(false);
  };

  const handleRequest = async (requestId: string, userId: string, action: "approved" | "rejected") => {
    await supabase
      .from("registration_requests")
      .update({ status: action, reviewed_by: user!.id, reviewed_at: new Date().toISOString() })
      .eq("id", requestId);

    await supabase
      .from("profiles")
      .update({ registration_status: action })
      .eq("user_id", userId);

    if (action === "approved") {
      await supabase.from("user_roles").upsert({
        user_id: userId,
        role: "viewer" as any,
      });
      toast.success("Anfrage genehmigt, Viewer-Rolle zugewiesen.");
    } else {
      toast.info("Anfrage abgelehnt.");
    }
    loadData();
  };

  const assignRole = async (userId: string, role: string) => {
    await supabase.from("user_roles").upsert({
      user_id: userId,
      role: role as any,
    });
    toast.success(`Rolle "${role}" zugewiesen.`);
  };

  const handleWishStatus = async (wishId: string, status: string) => {
    const update: any = { status, reviewed_by: user!.id, reviewed_at: new Date().toISOString() };
    if (status === "published") update.published_at = new Date().toISOString();
    await supabase.from("wishes").update(update).eq("id", wishId);
    toast.success(`Wunsch ${status === "published" ? "veröffentlicht" : status === "approved" ? "genehmigt" : "abgelehnt"}.`);
    loadData();
  };

  const verifyId = async (idRecord: string, verified: boolean) => {
    await supabase.from("member_ids").update({ verified }).eq("id", idRecord);
    toast.success(verified ? "ID verifiziert." : "Verifizierung zurückgezogen.");
    loadData();
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-sm">Laden...</div>;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "requests", label: "Anfragen", icon: FileText },
    { id: "members", label: "Mitglieder", icon: Users },
    { id: "wishes", label: "Wünsche", icon: Heart },
    { id: "ids", label: "ID-Verifizierung", icon: Shield },
  ];

  const statusColors: Record<string, string> = {
    pending: "text-amber bg-amber/10 border-amber/30",
    approved: "text-accent bg-accent/10 border-accent/30",
    rejected: "text-destructive bg-destructive/10 border-destructive/30",
    published: "text-primary bg-primary/10 border-primary/30",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="font-display font-bold text-sm text-primary hover:text-glow-primary transition-all">
              ATHA
            </button>
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest">// ADMIN PANEL</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Zurück
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-mono text-xs tracking-wider transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground font-mono text-sm py-12">Laden...</p>
        ) : (
          <>
            {/* Requests Tab */}
            {tab === "requests" && (
              <div className="space-y-3">
                <h2 className="font-display font-bold text-foreground text-lg mb-4">
                  Registrierungsanfragen ({requests.length})
                </h2>
                {requests.length === 0 && (
                  <p className="text-muted-foreground font-mono text-sm py-8 text-center">Keine Anfragen vorhanden.</p>
                )}
                {requests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border bg-card p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-foreground text-sm">{req.full_name}</h3>
                        <p className="font-mono text-[11px] text-muted-foreground mt-1">
                          {req.email} · {req.phone || "Kein Telefon"} · Alter: {req.age || "—"}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
                          {new Date(req.created_at).toLocaleString("de-DE")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 border ${statusColors[req.status]}`}>
                          {req.status}
                        </span>
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleRequest(req.id, req.user_id, "approved")}
                              className="p-2 border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                              title="Genehmigen"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRequest(req.id, req.user_id, "rejected")}
                              className="p-2 border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                              title="Ablehnen"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Members Tab */}
            {tab === "members" && (
              <div className="space-y-3">
                <h2 className="font-display font-bold text-foreground text-lg mb-4">
                  Mitglieder ({members.length})
                </h2>
                {members.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border bg-card p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-semibold text-foreground text-sm">{m.full_name}</h3>
                          <span className="font-mono text-[9px] text-primary border border-primary/30 px-1.5 py-0.5">
                            ID: {m.auth_id}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-muted-foreground mt-1">
                          {m.email} · {m.phone || "—"} · Alter: {m.age || "—"}
                        </p>
                        <span className={`inline-block mt-1 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 border ${statusColors[m.registration_status]}`}>
                          {m.registration_status}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {(["viewer", "member", "admin"] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => assignRole(m.user_id, role)}
                            className="px-2 py-1 font-mono text-[9px] border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                          >
                            +{role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Wishes Tab */}
            {tab === "wishes" && (
              <div className="space-y-3">
                <h2 className="font-display font-bold text-foreground text-lg mb-4">
                  Wünsche ({wishes.length})
                </h2>
                {wishes.length === 0 && (
                  <p className="text-muted-foreground font-mono text-sm py-8 text-center">Keine Wünsche vorhanden.</p>
                )}
                {wishes.map((w) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border bg-card p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-foreground text-sm">{w.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{w.content}</p>
                        <p className="font-mono text-[10px] text-muted-foreground/50 mt-2">
                          {new Date(w.created_at).toLocaleString("de-DE")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 border ${statusColors[w.status]}`}>
                          {w.status}
                        </span>
                        {w.status !== "published" && (
                          <div className="flex gap-1">
                            <button onClick={() => handleWishStatus(w.id, "published")} className="p-1.5 border border-primary/30 text-primary hover:bg-primary/10 transition-colors" title="Veröffentlichen">
                              <Eye className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleWishStatus(w.id, "rejected")} className="p-1.5 border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors" title="Ablehnen">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* IDs Tab */}
            {tab === "ids" && (
              <div className="space-y-3">
                <h2 className="font-display font-bold text-foreground text-lg mb-4">
                  ID-Verifizierungen ({memberIds.length})
                </h2>
                {memberIds.length === 0 && (
                  <p className="text-muted-foreground font-mono text-sm py-8 text-center">Keine IDs eingereicht.</p>
                )}
                {memberIds.map((mid) => (
                  <motion.div
                    key={mid.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border bg-card p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-primary uppercase">{mid.id_type}</span>
                          <span className="font-mono text-sm text-foreground">{mid.id_value}</span>
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground mt-1">
                          Auto-Verifiziert: {mid.auto_verified ? "Ja ✓" : "Nein"} · Manuell: {mid.verified ? "Verifiziert ✓" : "Ausstehend"}
                        </p>
                      </div>
                      <button
                        onClick={() => verifyId(mid.id, !mid.verified)}
                        className={`px-3 py-1.5 font-mono text-[10px] border transition-colors ${
                          mid.verified
                            ? "border-accent/30 text-accent hover:bg-accent/10"
                            : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                        }`}
                      >
                        {mid.verified ? "✓ Verifiziert" : "Verifizieren"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
