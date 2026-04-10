import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Dices } from "lucide-react";

// ─── Pixel-Art Characters as CSS art ───────────────────────────

const PixelDevil = () => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    exit={{ scale: 0, rotate: 180 }}
    transition={{ type: "spring", damping: 12 }}
    className="flex flex-col items-center"
  >
    {/* Devil - pixel art style */}
    <div className="relative">
      {/* Horns */}
      <div className="flex justify-between w-12 -mb-1">
        <div className="w-2 h-4 bg-red-600 skew-x-[-10deg]" />
        <div className="w-2 h-4 bg-red-600 skew-x-[10deg]" />
      </div>
      {/* Head */}
      <div className="w-12 h-12 bg-red-500 relative flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-yellow-300" />
          <div className="w-2 h-2 bg-yellow-300" />
        </div>
        <div className="absolute bottom-2 w-4 h-1 bg-red-800" />
      </div>
      {/* Body */}
      <div className="w-10 h-8 bg-red-600 mx-auto flex items-center justify-center">
        <span className="text-[8px] font-mono text-yellow-300">ERR</span>
      </div>
      {/* Tail */}
      <motion.div 
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-1 h-6 bg-red-700 ml-auto mr-1 origin-top rounded-b"
      />
    </div>
    <span className="text-[10px] font-mono text-destructive mt-1 tracking-wider">FEHLERTEUFEL</span>
  </motion.div>
);

const PixelCat = () => (
  <motion.div
    initial={{ x: -60, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 60, opacity: 0 }}
    transition={{ delay: 0.3 }}
    className="flex flex-col items-center"
  >
    <div className="relative">
      {/* Ears */}
      <div className="flex justify-between w-10 -mb-0.5">
        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent border-b-amber-600" />
        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent border-b-amber-600" />
      </div>
      {/* Head */}
      <div className="w-10 h-8 bg-amber-500 relative flex items-center justify-center">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-2 bg-green-400 rounded-full" />
          <div className="w-1.5 h-2 bg-green-400 rounded-full" />
        </div>
        {/* Whiskers */}
        <div className="absolute bottom-1.5 flex gap-0.5">
          <div className="w-3 h-px bg-amber-800 -rotate-6" />
          <div className="w-1 h-1 bg-pink-400 rounded-full" />
          <div className="w-3 h-px bg-amber-800 rotate-6" />
        </div>
      </div>
      {/* Body */}
      <div className="w-8 h-6 bg-amber-500 mx-auto" />
      {/* Belt */}
      <div className="w-8 h-1.5 bg-amber-900 mx-auto flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-sm" />
      </div>
      <div className="w-8 h-4 bg-amber-500 mx-auto" />
    </div>
    <span className="text-[10px] font-mono text-primary mt-1 tracking-wider">KATZE</span>
  </motion.div>
);

const BremenMusicians = () => (
  <motion.div
    initial={{ y: 80, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 80, opacity: 0 }}
    transition={{ type: "spring", damping: 10, delay: 0.5 }}
    className="flex flex-col items-center"
  >
    {/* Stacked animals - Bremen style */}
    <div className="relative flex flex-col items-center">
      {/* Rooster on top */}
      <div className="w-5 h-4 bg-red-400 relative mb-0">
        <div className="absolute -top-1 left-1 w-3 h-2 bg-red-500" />
        <div className="absolute top-1 right-0 w-1 h-0.5 bg-yellow-500" />
      </div>
      {/* Cat */}
      <div className="w-7 h-5 bg-amber-500 relative">
        <div className="absolute top-0.5 left-1 flex gap-1">
          <div className="w-1 h-1 bg-green-300" />
          <div className="w-1 h-1 bg-green-300" />
        </div>
      </div>
      {/* Dog */}
      <div className="w-9 h-5 bg-amber-800 relative">
        <div className="absolute top-0.5 left-1.5 flex gap-1.5">
          <div className="w-1 h-1 bg-amber-300" />
          <div className="w-1 h-1 bg-amber-300" />
        </div>
      </div>
      {/* Donkey at bottom */}
      <div className="w-11 h-6 bg-gray-500 relative">
        <div className="absolute -top-1 left-0.5 w-2 h-3 bg-gray-600 -rotate-12" />
        <div className="absolute -top-1 right-0.5 w-2 h-3 bg-gray-600 rotate-12" />
        <div className="absolute top-1 left-2 flex gap-2">
          <div className="w-1.5 h-1.5 bg-gray-800" />
          <div className="w-1.5 h-1.5 bg-gray-800" />
        </div>
      </div>
    </div>
    <motion.span 
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ repeat: Infinity, duration: 1.2 }}
      className="text-[10px] font-mono text-accent mt-1 tracking-wider"
    >
      ♪ STADTMUSIKANTEN ♪
    </motion.span>
  </motion.div>
);

// ─── 3D Dice Face ──────────────────────────────────────────────

const dotPositions: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

const DiceFace = ({ value, size = 56 }: { value: number; size?: number }) => (
  <div
    className="bg-card border border-border/60 flex items-center justify-center relative"
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 100 100">
      {dotPositions[value]?.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={8} className="fill-primary" />
      ))}
    </svg>
  </div>
);

// ─── Spinning 3D Dice ──────────────────────────────────────────

const SpinningDice = ({ rolling, value }: { rolling: boolean; value: number }) => (
  <div className="perspective-[600px] w-16 h-16">
    <motion.div
      animate={
        rolling
          ? { rotateX: [0, 360, 720, 1080], rotateY: [0, 360, 720, 1080], rotateZ: [0, 180, 360] }
          : { rotateX: 0, rotateY: 0, rotateZ: 0 }
      }
      transition={rolling ? { duration: 1.2, ease: "easeInOut" } : { duration: 0.4 }}
      style={{ transformStyle: "preserve-3d" }}
      className="w-16 h-16 relative"
    >
      <DiceFace value={value} size={64} />
    </motion.div>
  </div>
);

// ─── Marching Banner ───────────────────────────────────────────

const MarchBanner = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ x: "110%" }}
        animate={{ x: "-110%" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute top-0 left-0 right-0 overflow-hidden h-8 flex items-center pointer-events-none z-50"
      >
        <div className="whitespace-nowrap flex items-center gap-3 text-sm font-mono">
          <span className="text-primary">♪♫♪</span>
          <span className="text-accent">🎵 Die Bremer Stadtmusikanten spielen euch einen Marsch! 🎵</span>
          <span className="text-primary">♪♫♪</span>
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: 3, duration: 0.3 }}
            className="text-destructive font-bold"
          >
            😂 HaHa!
          </motion.span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Heart Drawing ─────────────────────────────────────────────

const HeartDrawing = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: "spring", damping: 8 }}
        className="flex flex-col items-center gap-1"
      >
        <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-lg">
          {/* Heart path drawn with animation */}
          <motion.path
            d="M50 88 C25 65 5 50 5 30 C5 15 15 5 30 5 C40 5 48 12 50 18 C52 12 60 5 70 5 C85 5 95 15 95 30 C95 50 75 65 50 88Z"
            fill="none"
            stroke="hsl(var(--destructive))"
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Arrow through heart */}
          <motion.line
            x1="10" y1="55" x2="90" y2="25"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          />
          {/* Arrow tip */}
          <motion.polygon
            points="90,25 82,22 85,30"
            fill="hsl(var(--primary))"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          />
        </svg>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-xs font-mono text-muted-foreground text-center max-w-[200px]"
        >
          Liebe & Vertrauen kennen keine Negativität ♡
        </motion.p>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Main Game Component ───────────────────────────────────────

type GamePhase = "idle" | "rolling" | "result-win" | "result-lose" | "ohoh";

const DiceGame = () => {
  const [open, setOpen] = useState(false);
  const [dice, setDice] = useState([1, 1, 1]);
  const [rolling, setRolling] = useState(false);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [rollsLeft, setRollsLeft] = useState(3);
  const [showBanner, setShowBanner] = useState(false);
  const [cursorDancing, setCursorDancing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const rollDice = useCallback(() => {
    if (rolling || rollsLeft <= 0) return;
    setPhase("rolling");
    setRolling(true);
    setRollsLeft((r) => r - 1);

    // Simulate rolling
    const interval = setInterval(() => {
      setDice([
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const final = [
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
      ];
      setDice(final);
      setRolling(false);

      // Check result — Yahtzee = all same
      const isYahtzee = final[0] === final[1] && final[1] === final[2];
      
      if (isYahtzee) {
        setPhase("result-win");
        setCursorDancing(true);
        setTimeout(() => setCursorDancing(false), 4000);
      } else {
        setPhase("result-lose");
        // Show OhOh after a moment
        setTimeout(() => {
          setPhase("ohoh");
          setShowBanner(true);
          setTimeout(() => setShowBanner(false), 5500);
        }, 1500);
      }
    }, 1200);
  }, [rolling, rollsLeft]);

  const resetGame = () => {
    setDice([1, 1, 1]);
    setPhase("idle");
    setRollsLeft(3);
    setShowBanner(false);
    setCursorDancing(false);
  };

  // Dancing cursor effect
  useEffect(() => {
    if (!cursorDancing || !modalRef.current) return;
    const el = modalRef.current;
    el.style.cursor = "none";
    const cursorEl = document.createElement("div");
    cursorEl.id = "dancing-cursor";
    cursorEl.style.cssText = `
      position:fixed;pointer-events:none;z-index:99999;
      font-size:24px;transition:transform 0.1s;
    `;
    cursorEl.textContent = "💖";
    document.body.appendChild(cursorEl);

    const move = (e: MouseEvent) => {
      const wobble = Math.sin(Date.now() / 100) * 10;
      cursorEl.style.left = `${e.clientX + wobble}px`;
      cursorEl.style.top = `${e.clientY + wobble - 12}px`;
      cursorEl.style.transform = `rotate(${Math.sin(Date.now() / 200) * 20}deg)`;
    };
    document.addEventListener("mousemove", move);

    return () => {
      document.removeEventListener("mousemove", move);
      el.style.cursor = "";
      cursorEl.remove();
    };
  }, [cursorDancing]);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => { setOpen(true); resetGame(); }}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 p-3 rounded bg-primary text-primary-foreground shadow-lg border border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-shadow"
        title="Glücks-Würfel"
      >
        <Dices className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-none"
            onClick={() => setOpen(false)}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mx-4 bg-card border border-border/60 rounded-sm p-6 shadow-2xl overflow-hidden"
            >
              {/* March Banner */}
              <MarchBanner show={showBanner} />

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-display font-bold text-foreground tracking-wide">
                  🎲 Glücks-Yahtzee
                </h3>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  3 Würfel · {rollsLeft} Versuch{rollsLeft !== 1 ? "e" : ""} übrig
                </p>
              </div>

              {/* Dice */}
              <div className="flex justify-center gap-4 mb-6">
                {dice.map((d, i) => (
                  <motion.div
                    key={i}
                    animate={rolling ? { y: [0, -15, 0] } : {}}
                    transition={{ repeat: rolling ? Infinity : 0, duration: 0.3, delay: i * 0.1 }}
                  >
                    <SpinningDice rolling={rolling} value={d} />
                  </motion.div>
                ))}
              </div>

              {/* Roll Button */}
              <div className="flex justify-center mb-6">
                <motion.button
                  onClick={rollDice}
                  disabled={rolling || rollsLeft <= 0}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary text-primary-foreground font-mono text-sm tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {rolling ? "Würfelt..." : rollsLeft <= 0 ? "Keine Versuche" : "WÜRFELN!"}
                </motion.button>
              </div>

              {/* Result Area */}
              <div className="min-h-[180px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {/* WIN: Heart + dancing cursor */}
                  {phase === "result-win" && (
                    <motion.div
                      key="win"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.3, 1] }}
                        className="text-2xl font-display font-bold text-primary"
                      >
                        🎉 YAHTZEE! 🎉
                      </motion.p>
                      <HeartDrawing show />
                    </motion.div>
                  )}

                  {/* LOSE: Devil + Cat appear */}
                  {phase === "result-lose" && (
                    <motion.div
                      key="lose"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-end gap-6"
                    >
                      <PixelDevil />
                      <PixelCat />
                    </motion.div>
                  )}

                  {/* OHOH: Bremen Musicians */}
                  {phase === "ohoh" && (
                    <motion.div
                      key="ohoh"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.5, 1] }}
                        transition={{ type: "spring" }}
                        className="text-xl font-display font-bold text-destructive"
                      >
                        Oh Oh! 😱
                      </motion.p>
                      <div className="flex items-end gap-6">
                        <BremenMusicians />
                        <div className="flex flex-col items-center">
                          <PixelDevil />
                        </div>
                        <PixelCat />
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-xs font-mono text-muted-foreground text-center mt-2"
                      >
                        Die Kunst der Verblüffung — es sind die Bremer Stadtmusikanten!
                      </motion.p>
                    </motion.div>
                  )}

                  {/* IDLE */}
                  {phase === "idle" && (
                    <motion.p
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      className="text-xs font-mono text-muted-foreground text-center"
                    >
                      Drück WÜRFELN und versuche dein Glück!<br />
                      Alle 3 gleich = Yahtzee 🎲
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Reset */}
              {(phase === "result-win" || phase === "ohoh") && rollsLeft <= 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mt-4"
                >
                  <button
                    onClick={resetGame}
                    className="px-4 py-1.5 border border-border/60 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    Nochmal spielen
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DiceGame;
