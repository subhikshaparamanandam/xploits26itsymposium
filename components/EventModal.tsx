
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Globe, 
  MessageCircle, 
  Loader2, 
  ShieldCheck, 
  AlertCircle,
  Share2,
  Trophy,
  Users
} from 'lucide-react';
import { EventData } from '../types';

interface EventModalProps {
  event: EventData | null;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [event]);

  if (!event) return null;

  const isFire = event.theme === 'fire';
  const accentColor = isFire ? 'text-fire' : 'text-ice';
  const accentBg = isFire ? 'bg-fire' : 'bg-ice';
  const accentBorder = isFire ? 'border-fire' : 'border-ice';
  const accentShadow = isFire ? 'shadow-fire/20' : 'shadow-ice/20';
  const accentGlow = isFire ? 'group-hover:shadow-fire/40' : 'group-hover:shadow-ice/40';

  const handleRegister = () => {
    setRegisterStatus('processing');
    setTimeout(() => {
      setRegisterStatus('success');
    }, 2500);
  };

  const handleReset = () => {
    setRegisterStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 sm:p-4 md:p-8 overflow-hidden">
      {/* Dynamic Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl transition-opacity duration-700 animate-in fade-in" 
        onClick={onClose}
      >
        <div className={`absolute inset-0 opacity-10 bg-gradient-to-tr ${isFire ? 'from-fire/20 via-transparent to-transparent' : 'from-ice/20 via-transparent to-transparent'}`}></div>
      </div>
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] bg-[#0A0A0A] sm:rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out`}>
        
        {/* Decorative Corner Accents */}
        <div className={`absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 ${accentBorder} opacity-20 pointer-events-none rounded-tl-[3.5rem]`}></div>
        <div className={`absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 ${accentBorder} opacity-20 pointer-events-none rounded-br-[3.5rem]`}></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 md:p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-50 border border-white/5 backdrop-blur-xl group"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform" />
        </button>

        {/* Left: Cinematic Visual */}
        <div className="w-full md:w-5/12 h-64 sm:h-80 md:h-auto relative overflow-hidden group/img shrink-0">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transform scale-105 group-hover/img:scale-110 transition-transform duration-[10s] ease-linear" 
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent"></div>
          
          {/* Overlay Content */}
          <div className="absolute bottom-8 left-8 right-8 md:bottom-16 md:left-16 md:right-16 space-y-4">
            <div className="flex items-center space-x-3">
               <span className={`px-4 py-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black rounded-full text-white ${accentBg} shadow-xl backdrop-blur-md`}>
                {event.category}
              </span>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md`}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] md:text-[9px] font-bold text-white/70 uppercase tracking-widest">Status: Open</span>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
              {event.title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h2>
          </div>
        </div>

        {/* Right: Technical Dossier */}
        <div className="flex-1 p-8 md:p-20 overflow-y-auto no-scrollbar relative">
          {registerStatus === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
               <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full ${accentBg}/10 flex items-center justify-center border-2 border-dashed ${accentBorder} relative`}>
                  <ShieldCheck className={`w-12 h-12 md:w-16 md:h-16 ${accentColor}`} />
                  <div className={`absolute inset-0 rounded-full ${accentBg} blur-2xl opacity-20 animate-pulse`}></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tighter">Protocol Activated</h3>
                  <p className="text-gray-400 text-sm md:text-lg max-w-sm mx-auto leading-relaxed">Your registration for {event.title} has been encrypted and synced with the main grid. Confirmation sent to uplink.</p>
               </div>
               <button 
                onClick={handleReset}
                className={`px-12 py-4 rounded-2xl ${accentBg} text-white font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px] hover:scale-105 active:scale-95 transition-all shadow-2xl ${accentShadow}`}
               >
                 Return to Lobby
               </button>
            </div>
          ) : (
            <div className="space-y-12 md:space-y-16">
              {/* Event Brief */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-[2px] ${accentBg}`}></div>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">Mission Brief</span>
                  </div>
                  <button className="text-white/30 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-200 text-lg md:text-2xl font-medium leading-relaxed tracking-tight">
                  {event.description}
                </p>
                
                {/* Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Calendar, label: 'Deployment', val: event.date },
                    { icon: Clock, label: 'Time window', val: event.time },
                    { icon: MapPin, label: 'Coordinates', val: event.venue },
                    { icon: Users, label: 'Team Matrix', val: '1 - 3 Members' }
                  ].map((stat, i) => (
                    <div key={i} className="group/stat glass p-5 md:p-6 rounded-3xl border-white/5 flex items-center hover:bg-white/5 transition-all">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${accentBg}/10 flex items-center justify-center ${accentColor} mr-4 md:mr-6 shrink-0 group-hover/stat:scale-110 transition-transform`}>
                        <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black">{stat.label}</div>
                        <div className="text-sm md:text-base font-bold text-white uppercase tracking-tight">{stat.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Engagement Rules */}
              <section className="space-y-8">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-[2px] ${accentBg}`}></div>
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">Protocols</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {event.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <div className={`w-6 h-6 rounded-full ${accentBg}/20 flex items-center justify-center shrink-0 mt-0.5`}>
                        <span className={`text-[10px] font-bold ${accentColor}`}>{idx + 1}</span>
                      </div>
                      <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Support Units */}
              <section className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-[2px] ${accentBg}`}></div>
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-gray-500">Support Units</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {event.coordinators.map((coord, i) => (
                    <div key={i} className="glass pl-5 pr-3 py-3 rounded-2xl border-white/5 flex items-center justify-between min-w-[240px] flex-1">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${isFire ? 'from-fire to-fire-dark' : 'from-ice to-ice-dark'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                          {coord.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[10px] md:text-[11px] font-bold text-white tracking-tight">{coord.name}</div>
                          <div className="text-[8px] uppercase tracking-[0.2em] text-gray-500 font-bold">Field Liaison</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a href={`tel:${coord.contact}`} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                          <Phone className="w-4 h-4" />
                        </a>
                        <a href={`https://wa.me/${coord.contact.replace(/\D/g,'')}`} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Action Suite */}
              <section className="pt-10 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                  <button 
                    onClick={handleRegister}
                    disabled={registerStatus === 'processing'}
                    className={`flex-1 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] md:text-[12px] transition-all relative overflow-hidden group/btn ${accentBg} text-white shadow-2xl ${accentShadow} disabled:opacity-70`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative flex items-center justify-center">
                      {registerStatus === 'processing' ? (
                        <>
                          <Loader2 className="mr-3 w-5 h-5 animate-spin" />
                          Initiating Protocol...
                        </>
                      ) : (
                        <>Initiate Protocol <ShieldCheck className="ml-3 w-5 h-5" /></>
                      )}
                    </span>
                  </button>
                  <div className="flex flex-col justify-center px-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-500">Limited Slots</span>
                    </div>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Registration closes in 4 days</p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
