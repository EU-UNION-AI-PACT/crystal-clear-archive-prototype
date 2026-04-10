import { useState, useCallback } from "react";
import { motion } from "framer-motion";

const HimmelspforteChime = () => {
  const [playing, setPlaying] = useState(false);

  const playChime = useCallback(() => {
    if (playing) return;
    setPlaying(true);

    const ctx = new AudioContext();
    // 3 harmonische Töne: C5, E5, G5 (Dur-Dreiklang)
    const freqs = [523.25, 659.25, 783.99];
    const now = ctx.currentTime;

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.25);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.25 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.25);
      osc.stop(now + i * 0.25 + 0.8);
    });

    setTimeout(() => {
      setPlaying(false);
      ctx.close();
    }, 1200);
  }, [playing]);

  return (
    <motion.button
      onClick={playChime}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      animate={playing ? { rotate: [0, -8, 8, -5, 5, 0] } : {}}
      transition={playing ? { duration: 0.5 } : {}}
      className="fixed bottom-[72px] right-6 z-50 p-2.5 rounded bg-card border border-border/60 text-primary hover:border-primary/40 hover:shadow-[0_0_12px_hsl(var(--primary)/0.2)] transition-shadow"
      title="Himmelspforte anklopfen ✨"
    >
      <span className="text-lg leading-none">🔔</span>
    </motion.button>
  );
};

export default HimmelspforteChime;
