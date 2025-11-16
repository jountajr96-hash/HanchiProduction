import { useEffect, useState } from "react";
import devignLogo from "@/assets/devign-logo.png"; // ensure it exists

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 350);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070B14] overflow-hidden">

      {/* WRAPPER */}
      <div className="relative text-center space-y-10 animate-loader-fade">

        {/* SPINNER */}
        <div className="relative w-72 h-72 mx-auto animate-loader-scale">

          {/* Outer static ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-white/10 
            shadow-[0_0_20px_rgba(255,255,255,0.08)]"></div>

          {/* Fast neon ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-transparent
            border-t-[#08D9FF] border-r-[#C600FF] animate-spin 
            drop-shadow-[0_0_18px_rgba(8,217,255,0.5)]"></div>

          {/* Opposite rotating ring */}
          <div className="absolute inset-4 rounded-full border-[4px] border-transparent
            border-b-[#FF007A] border-l-[#00FFC6] animate-loader-spin-slow"></div>

          {/* Glow Core */}
          <div className="absolute inset-10 rounded-full 
            bg-gradient-to-br from-[#08D9FF]/10 to-[#C600FF]/10 blur-2xl"></div>

          {/* LOGO */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={devignLogo}
              alt="Devign Logo"
              className="w-40 h-40 object-contain animate-logo-pulse
              drop-shadow-[0_0_25px_rgba(255,0,200,0.45)]"
            />
          </div>

        </div>

        {/* PROGRESS BAR */}
        <div className="w-72 mx-auto space-y-3 animate-progress-fade">
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-[#08D9FF] via-[#C600FF] to-[#FF007A] 
              transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(198,0,255,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-2xl font-bold tracking-widest text-white drop-shadow">
            {progress}%
          </p>
        </div>

      </div>
    </div>
  );
};
