import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Login fehlgeschlagen: " + error.message);
    } else {
      toast.success("Erfolgreich eingeloggt!");
      navigate("/");
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !age.trim()) {
      toast.error("Bitte alle Felder ausfüllen.");
      return;
    }
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 150) {
      toast.error("Alter muss zwischen 13 und 150 liegen.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          phone: phone,
          age: ageNum,
        },
      },
    });

    if (error) {
      toast.error("Registrierung fehlgeschlagen: " + error.message);
    } else {
      toast.success(
        "Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse. Deine Anfrage wird vom Admin geprüft."
      );
      setMode("login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 grid-dots opacity-15" />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-primary/30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <button onClick={() => navigate("/")} className="font-display font-bold text-xl text-primary hover:text-glow-primary transition-all">
            ATHA
          </button>
          <p className="font-mono text-xs text-muted-foreground mt-2 tracking-widest uppercase">
            {mode === "login" ? "// Zugang" : "// Registrierung"}
          </p>
        </div>

        <div className="border border-border bg-card p-8">
          {/* Tab switcher */}
          <div className="flex mb-6 border border-border">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 font-mono text-xs tracking-wider transition-all ${
                mode === "login"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 font-mono text-xs tracking-wider transition-all ${
                mode === "register"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              REGISTRIEREN
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="name@beispiel.de"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase block mb-1">
                    Passwort
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-primary-foreground font-mono text-sm tracking-wider uppercase border border-primary hover:bg-primary/90 transition-colors disabled:opacity-50 border-glow"
                >
                  {loading ? "Laden..." : "Einloggen"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase block mb-1">
                    Vollständiger Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Max Mustermann"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="name@beispiel.de"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase block mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                      placeholder="+49..."
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase block mb-1">
                      Alter *
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      min={13}
                      max={150}
                      className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                      placeholder="25"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase block mb-1">
                    Passwort *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-background border border-border px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none transition-colors"
                    placeholder="Mindestens 8 Zeichen"
                  />
                </div>

                <div className="border border-border/50 bg-background/50 p-3">
                  <p className="font-mono text-[9px] text-muted-foreground leading-relaxed">
                    ⚡ Nach der Registrierung erhältst du eine Bestätigungs-Email.
                    <br />
                    ⚡ Dein Zugang wird vom Admin geprüft und freigeschaltet.
                    <br />
                    ⚡ Du erhältst eine einzigartige 5-stellige Auth-ID.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-primary-foreground font-mono text-sm tracking-wider uppercase border border-primary hover:bg-primary/90 transition-colors disabled:opacity-50 border-glow"
                >
                  {loading ? "Laden..." : "Registrieren"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center font-mono text-[10px] text-muted-foreground/40 mt-4">
          Compliance: EU-DSGVO · AI PACT · ISO 27001
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
