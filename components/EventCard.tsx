
import React from 'react';
import { EventData } from '../types';
import { ArrowRight, Sparkles, Flame, Snowflake } from 'lucide-react';

interface EventCardProps {
  event: EventData;
  onClick: (event: EventData) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const isFire = event.theme === 'fire';
  const accentColorHover = isFire ? 'group-hover:text-fire' : 'group-hover:text-ice';
  const glowClass = isFire ? 'fire-glow' : 'ice-glow';
  
  // Theme-specific decorative icons for enhanced parallax
  const ThemeIcon = isFire ? Flame : Snowflake;

  return (
    <div 
      onClick={() => onClick(event)}
      className={`group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] glass cursor-pointer transition-all duration-700 ease-out ${glowClass} hover:-translate-y-3 md:hover:-translate-y-4 hover:scale-[1.01] hover:shadow-2xl`}
    >
      {/* Animated Glowing Border Layer */}
      <div className={`absolute inset-0 rounded-[1.5rem] md:rounded-[2.5rem] border border-transparent transition-all duration-500 pointer-events-none z-30 group-hover:${isFire ? 'border-fire/40 shadow-[inset_0_0_15px_rgba(255,138,0,0.15)]' : 'border-ice/40 shadow-[inset_0_0_15px_rgba(0,198,255,0.15)]'}`}></div>

      {/* Parallax Depth Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: Deep Ambient Glow */}
        <div className={`absolute -top-10 -right-10 w-48 h-48 md:w-64 md:h-64 rounded-full blur-[80px] md:blur-[100px] opacity-10 transition-all duration-1000 group-hover:opacity-40 group-hover:scale-125 ${isFire ? 'bg-fire' : 'bg-ice'}`}></div>
        
        {/* Layer 2: Distant Background Icon (Reduced motion for mobile) */}
        <div className={`absolute top-1/2 left-0 opacity-0 transition-all duration-[2s] ease-out group-hover:opacity-[0.08] group-hover:translate-x-12 md:group-hover:translate-x-24 ${isFire ? 'text-fire-dark' : 'text-ice-dark'}`}>
          <ThemeIcon className="w-32 h-32 md:w-48 md:h-48 blur-[2px] md:blur-[3px]" strokeWidth={0.3} />
        </div>

        {/* Layer 3: Foreground Thematic Icon */}
        <div className={`absolute top-1/4 right-0 opacity-0 transition-all duration-[1s] ease-out group-hover:opacity-[0.2] group-hover:-translate-x-24 md:group-hover:-translate-x-48 group-hover:-translate-y-20 md:group-hover:-translate-y-40 group-hover:scale-[1.1] md:group-hover:scale-[1.3] ${isFire ? 'text-fire' : 'text-ice'}`}>
          <ThemeIcon className="w-24 h-24 md:w-32 md:h-32" strokeWidth={0.8} />
        </div>
      </div>

      {/* Main Visual Container */}
      <div className="h-56 md:h-64 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transform scale-100 group-hover:scale-115 transition-transform duration-[4s] ease-out" 
        />
        
        <div className={`absolute inset-0 transition-all duration-1000 group-hover:opacity-40 opacity-0 ${isFire ? 'bg-gradient-to-tr from-fire-dark/80 via-transparent to-transparent' : 'bg-gradient-to-tr from-ice-dark/80 via-transparent to-transparent'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-alt via-brand-alt/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700"></div>
        
        {/* Status Indicator Chip */}
        <div className="absolute top-4 md:top-6 right-4 md:right-6 p-1.5 md:p-2 rounded-lg md:rounded-xl bg-black/60 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 md:translate-y-3 group-hover:translate-y-0">
          <Sparkles className={`w-3.5 h-3.5 md:w-4 h-4 ${isFire ? 'text-fire-light' : 'text-ice-light'}`} />
        </div>
      </div>
      
      {/* Narrative Section */}
      <div className="p-6 md:p-8 relative z-10 bg-brand-alt/40 backdrop-blur-sm">
        <div className={`text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black mb-3 md:mb-4 flex items-center ${isFire ? 'text-fire' : 'text-ice'}`}>
          <span className={`w-1.5 h-1.5 md:w-2 h-2 rounded-full mr-2 md:mr-3 ${isFire ? 'bg-fire shadow-[0_0_10px_#FF8A00]' : 'bg-ice shadow-[0_0_10px_#00C6FF]'} transition-all duration-500 group-hover:scale-150`}></span>
          {event.category}
        </div>
        
        <h3 className="text-xl md:text-2xl font-heading font-bold mb-3 md:mb-4 tracking-tight transition-all duration-500 group-hover:text-white group-hover:translate-x-1">
          {event.title}
        </h3>
        
        <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mb-6 md:mb-8 font-medium leading-relaxed transition-colors duration-500 group-hover:text-gray-400">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5">
          <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] transition-all duration-500 uppercase flex items-center ${accentColorHover} text-gray-400`}>
            EXPLORE 
            <ArrowRight className={`ml-1.5 md:ml-2 w-3.5 h-3.5 md:w-4 h-4 transform transition-all duration-500 group-hover:translate-x-2`} />
          </span>
          <div className="flex space-x-1 md:space-x-1.5">
             <div className={`w-1 h-1 rounded-full transition-all duration-300 ${isFire ? 'bg-fire/20 group-hover:bg-fire' : 'bg-ice/20 group-hover:bg-ice'}`}></div>
             <div className={`w-1 h-1 rounded-full transition-all duration-500 ${isFire ? 'bg-fire/20 group-hover:bg-fire' : 'bg-ice/20 group-hover:bg-ice'}`}></div>
             <div className={`w-1 h-1 rounded-full transition-all duration-700 ${isFire ? 'bg-fire/20 group-hover:bg-fire' : 'bg-ice/20 group-hover:bg-ice'}`}></div>
          </div>
        </div>
        
        {/* Animated Bottom Sync Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white/5 overflow-hidden">
          <div className={`h-full w-0 transition-all duration-[1s] ease-in-out group-hover:w-full ${isFire ? 'bg-fire shadow-[0_0_20px_#FF8A00]' : 'bg-ice shadow-[0_0_20px_#00C6FF]'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
