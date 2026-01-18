
import React, { useState, useEffect } from 'react';

const Countdown: React.FC = () => {
  const targetDate = new Date('2026-02-14T09:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label, max, color }: { value: number; label: string; max: number; color: 'fire' | 'ice' | 'mixed' }) => {
    const percentage = (value / max) * 100;
    const strokeDasharray = 251.2; // 2 * PI * 40
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    const accentColor = color === 'fire' ? '#FF8A00' : color === 'ice' ? '#00C6FF' : '#FFFFFF';
    const shadowClass = color === 'fire' ? 'drop-shadow-[0_0_8px_rgba(255,138,0,0.5)]' : color === 'ice' ? 'drop-shadow-[0_0_8px_rgba(0,198,255,0.5)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]';

    return (
      <div className="relative group flex flex-col items-center">
        {/* Progress Ring */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              className="fill-none stroke-white/5 stroke-[2]"
            />
            {/* Foreground Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              style={{
                strokeDasharray: '251%',
                strokeDashoffset: `${251 - (251 * percentage) / 100}%`,
                stroke: accentColor,
                transition: 'stroke-dashoffset 1s linear'
              }}
              className={`fill-none stroke-[3] group-hover:stroke-[4] transition-all duration-500`}
            />
          </svg>
          
          {/* Inner Number Container */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-lg sm:text-2xl md:text-3xl font-heading font-black tracking-tighter text-white ${shadowClass}`}>
              {value.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Label */}
        <div className="mt-2 md:mt-4">
          <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-gray-500 group-hover:text-white transition-colors duration-300">
            {label}
          </span>
        </div>

        {/* HUD Deco */}
        <div className={`absolute -top-1 -left-1 w-2 md:w-3 h-2 md:h-3 border-t border-l opacity-20 group-hover:opacity-100 transition-opacity duration-500 ${color === 'fire' ? 'border-fire' : 'border-ice'}`}></div>
        <div className={`absolute -bottom-1 -right-1 w-2 md:w-3 h-2 md:h-3 border-b border-r opacity-20 group-hover:opacity-100 transition-opacity duration-500 ${color === 'fire' ? 'border-fire' : 'border-ice'}`}></div>
      </div>
    );
  };

  return (
    <div className="relative p-6 md:p-12 glass rounded-[2rem] md:rounded-[3rem] border-white/5 backdrop-blur-2xl flex flex-col items-center overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-tr from-fire/5 via-transparent to-ice/5"></div>
      
      {/* HUD Scanner Line */}
      <div className="absolute inset-x-0 h-[1px] bg-white/10 animate-[scan_4s_ease-in-out_infinite] pointer-events-none"></div>

      <div className="relative z-10 flex items-center justify-center space-x-4 sm:space-x-6 md:space-x-12">
        <TimeUnit value={timeLeft.days} label="Days" max={30} color="fire" />
        <div className="hidden sm:block w-[1px] h-8 md:h-12 bg-white/5 self-center translate-y-[-5px] md:translate-y-[-10px]"></div>
        <TimeUnit value={timeLeft.hours} label="Hrs" max={24} color="fire" />
        <div className="hidden sm:block w-[1px] h-8 md:h-12 bg-white/5 self-center translate-y-[-5px] md:translate-y-[-10px]"></div>
        <TimeUnit value={timeLeft.minutes} label="Min" max={60} color="ice" />
        <div className="hidden sm:block w-[1px] h-8 md:h-12 bg-white/5 self-center translate-y-[-5px] md:translate-y-[-10px]"></div>
        <TimeUnit value={timeLeft.seconds} label="Sec" max={60} color="ice" />
      </div>

      <div className="mt-6 md:mt-10 flex items-center space-x-2 md:space-x-3">
        <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-400">Chronometer Synced</span>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          50% { top: 100%; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default Countdown;
