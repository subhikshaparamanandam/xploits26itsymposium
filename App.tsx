
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MapPin, 
  Mail, 
  Instagram, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Phone, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Loader2, 
  Building2, 
  GraduationCap, 
  Award, 
  Library,
  HelpCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { EventData } from './types';
import { 
  EVENTS, 
  STAFF_COORDINATORS, 
  STUDENT_COORDINATORS, 
  INSTRUCTIONS 
} from './constants';
import Countdown from './components/Countdown';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';

// Custom Hook for Scroll Reveal
const useRevealOnScroll = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);
};

const StudentCoordCard: React.FC<{ student: typeof STUDENT_COORDINATORS[0] }> = ({ student }) => {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="reveal glass rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-center group transition-all hover:border-ice/30 hover:-translate-y-2 duration-500 relative overflow-hidden flex flex-col h-full min-h-[380px] md:min-h-[420px]">
      {/* Background Decorative Layer */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-ice/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 md:mb-8 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ring-4 ring-white/5 group-hover:ring-ice/20 relative shrink-0">
          <img 
            src={student.image} 
            alt={student.name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ice/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
          <h3 className="text-xl md:text-2xl font-heading font-bold group-hover:text-ice transition-colors tracking-tight">{student.name}</h3>
          <p className="text-ice-light text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]">{student.role}</p>
        </div>

        <div className="w-12 md:w-16 h-[1px] bg-white/10 mx-auto mb-4 md:mb-6"></div>
        
        <p className="text-gray-500 text-[9px] md:text-[10px] leading-relaxed uppercase tracking-[0.2em] font-bold mb-auto">
          Council Member • IT Division
        </p>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5">
          {showContact ? (
            <div className="flex items-center justify-center space-x-3 md:space-x-4 animate-in fade-in zoom-in duration-300">
              <a href={`https://wa.me/${student.phone}`} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all hover:scale-110 border border-green-500/20">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={`tel:${student.phone}`} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-ice/10 text-ice hover:bg-ice/20 transition-all hover:scale-110 border border-ice/20">
                <Phone className="w-5 h-5" />
              </a>
              <button 
                onClick={() => setShowContact(false)}
                className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 text-gray-500 hover:text-white transition-all"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowContact(true)}
              className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 text-gray-400 group-hover:text-white group-hover:bg-ice/10 group-hover:border-ice/30 transition-all text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center"
            >
              Contact Protocol <Info className="ml-2 md:ml-3 w-4 h-4 opacity-50" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeroRegistering, setIsHeroRegistering] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Get unique categories from EVENTS
  const categories = ['All', ...new Set(EVENTS.map(event => event.category))];

  // Initialize Scroll Reveals
  useRevealOnScroll();

  useEffect(() => {
    let glitchTimeout: any;
    const scrollProgress = document.getElementById('scroll-progress');

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      if (scrollProgress) {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (currentScrollY / height) * 100;
        scrollProgress.style.width = scrolled + "%";
      }

      if (currentScrollY < 1000) {
        setIsGlitching(true);
        clearTimeout(glitchTimeout);
        glitchTimeout = setTimeout(() => setIsGlitching(false), 250);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(glitchTimeout);
    };
  }, []);

  const handleHeroRegister = () => {
    setIsHeroRegistering(true);
    setTimeout(() => {
      setIsHeroRegistering(false);
    }, 2000);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5 md:w-6 md:h-6" /> : <Info className="w-5 h-5 md:w-6 md:h-6" />;
  };

  const filteredEvents = activeCategory === 'All' 
    ? EVENTS 
    : EVENTS.filter(event => event.category === activeCategory);

  return (
    <div className="min-h-screen selection:bg-fire selection:text-white bg-[#050505] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-brand-bg/90 backdrop-blur-md py-3 md:py-4 border-b border-white/5' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-fire to-ice rounded-lg md:rounded-xl flex items-center justify-center font-bold text-white text-lg md:text-xl shadow-lg border border-white/10">X</div>
            <div className="hidden xs:block">
              <span className="font-heading font-bold text-base md:text-xl tracking-tighter uppercase block leading-none">XPLOITS 26</span>
              <span className="text-[7px] md:text-[8px] tracking-[0.4em] font-bold text-gray-500 uppercase">National Symposium</span>
            </div>
          </div>
          <div className="hidden md:flex space-x-10 text-[10px] font-bold tracking-[0.3em] uppercase">
            <a href="#about" className="hover:text-white transition-colors">Odyssey</a>
            <a href="#events" className="hover:text-white transition-colors">Arenas</a>
            <a href="#team" className="hover:text-white transition-colors">Team</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <button className="px-4 md:px-6 py-2 md:py-2.5 border border-white/10 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all shadow-xl backdrop-blur-sm">
            Portal Access
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden hero-split">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className={`w-full h-full object-cover scale-105 transition-filter duration-700 ${isGlitching ? 'glitch-effect' : ''}`}
            poster="https://storage.googleapis.com/veo-public-assets/veo_logo_fire_ice.jpg"
          >
            <source src="https://storage.googleapis.com/veo-public-assets/veo_logo_fire_ice.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-fire-dark/10 via-transparent to-ice-dark/10 opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-[80%] md:h-[60%] bg-gradient-radial from-white/10 to-transparent blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/60 via-transparent to-brand-bg"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-6 md:space-y-10 pt-28 pb-20 md:py-32 animate-in fade-in zoom-in duration-1000">
          
          {/* Enhanced Institutional Branding */}
          <div className="relative flex flex-col items-center justify-center mb-8 md:mb-12 px-2 group">
             {/* Tech Accents */}
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-fire/40 to-transparent"></div>
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-ice/40 to-transparent"></div>
             
             <div className="reveal flex flex-col items-center">
               <span className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-[0.6em] mb-2 md:mb-4 bg-white/5 px-3 py-1 rounded-full border border-white/5">Autonomous Institution • NBA Accredited</span>
               <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-black metallic-text tracking-tighter uppercase leading-tight drop-shadow-2xl">
                 SRM Valliammai Engineering College
               </h2>
             </div>
             
             <div className="reveal mt-4 md:mt-6" style={{ transitionDelay: '200ms' }}>
               <div className="relative inline-block px-8 md:px-12 py-3 md:py-4">
                 {/* High-tech brackets */}
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-fire/50"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ice/50"></div>
                 
                 <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold text-white tracking-widest uppercase flex items-center">
                   <Cpu className="w-4 md:w-6 h-4 md:h-6 mr-3 text-fire animate-pulse" />
                   Department of <span className="text-ice ml-2">Information Technology</span>
                 </h3>
               </div>
             </div>
          </div>

          <div className="flex flex-col items-center space-y-4 md:space-y-8">
            <div className="logo-breathe relative flex flex-col items-center py-4 md:py-6">
               <div className="absolute inset-0 bg-gradient-to-r from-fire/20 to-ice/20 blur-[60px] md:blur-[100px] opacity-30 rounded-full animate-pulse"></div>
               <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-heading font-black tracking-tighter leading-none relative z-20">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fire via-white to-ice filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] md:drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">XPLOITS</span>
                <div className="text-3xl sm:text-5xl md:text-7xl mt-1 md:mt-2 metallic-text tracking-[0.4em] md:tracking-[0.6em] font-light opacity-90">26</div>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[12px] md:text-sm text-gray-100 tracking-[0.3em] sm:tracking-[0.6em] uppercase max-w-2xl mx-auto leading-relaxed font-black border-y border-white/20 py-3 md:py-5 backdrop-blur-md px-6 md:px-10 rounded-full shadow-2xl">
              National Level Technical Symposium • 14.02.2026
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center transform scale-[0.85] sm:scale-90 md:scale-100">
            <Countdown />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4 md:pt-6 px-4">
            <button 
              onClick={handleHeroRegister}
              disabled={isHeroRegistering}
              className="w-full sm:w-auto px-10 md:px-16 py-4 md:py-6 bg-fire text-white font-bold rounded-xl md:rounded-2xl uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[11px] hover:bg-fire-dark transition-all shadow-[0_0_30px_rgba(255,138,0,0.4)] md:shadow-[0_0_50px_rgba(255,138,0,0.5)] hover:scale-105 active:scale-95 group border border-fire-light/20 disabled:opacity-70"
            >
              <span className="flex items-center justify-center">
                {isHeroRegistering ? (
                  <>
                    <Loader2 className="mr-2 md:mr-3 w-4 md:w-5 h-4 md:h-5 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    Register Now <ArrowRight className="ml-2 md:ml-3 w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-40">
          <div className="text-[8px] md:text-[9px] tracking-[0.5em] uppercase mb-3 md:mb-4 font-black text-white">Engage Protocol</div>
          <div className="w-[1px] h-10 md:h-16 bg-gradient-to-b from-white via-white/50 to-transparent"></div>
        </div>
      </section>

      {/* Section 2: Instructions - Horizontal Glassmorphism Cards */}
      <section className="py-16 md:py-32 bg-brand-bg relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 md:mb-20 text-center reveal">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-gray-500 uppercase mb-4 md:mb-6">Intelligence Briefing</div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tighter">Mission <span className="text-fire">Protocols</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {INSTRUCTIONS.map((item, idx) => (
              <div 
                key={item.id} 
                className="reveal glass group p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-white/5 hover:border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] duration-500 relative overflow-hidden flex items-center space-x-6 md:space-x-8"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Decorative Accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 group-hover:w-[4px] ${idx % 2 === 0 ? 'bg-fire' : 'bg-ice'}`}></div>
                
                {/* Icon Container */}
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${idx % 2 === 0 ? 'bg-fire/10 text-fire border border-fire/20' : 'bg-ice/10 text-ice border border-ice/20'}`}>
                    {getIcon(item.icon)}
                  </div>
                  <div className={`absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${idx % 2 === 0 ? 'bg-fire' : 'bg-ice'}`}></div>
                </div>

                {/* Content */}
                <div className="space-y-1 md:space-y-2">
                  <h4 className="font-heading font-bold text-xs md:text-sm uppercase tracking-[0.2em] text-white group-hover:translate-x-1 transition-transform">{item.title}</h4>
                  <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed font-bold tracking-wider uppercase">{item.text}</p>
                </div>

                {/* Corner Tech Detail */}
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                  <div className="w-4 h-4 border-t border-r border-white/30"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: About */}
      <section id="about" className="py-16 md:py-32 relative overflow-hidden bg-brand-bg">
        <div className="absolute top-1/2 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-ice-dark/5 blur-[80px] md:blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-fire-dark/5 blur-[80px] md:blur-[120px] rounded-full opacity-30"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16 md:mb-24 space-y-4 reveal">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-gray-400 uppercase">The Foundation</div>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-heading font-bold tracking-tighter leading-tight">Pillars of <span className="text-transparent bg-clip-text bg-gradient-to-r from-ice via-white to-fire">Excellence</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
            {/* College Card */}
            <div className="reveal-left group relative glass p-8 md:p-14 rounded-[2rem] md:rounded-[3.5rem] border-white/5 overflow-hidden transition-all duration-700 hover:border-ice/30 hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-ice/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-ice/10 flex items-center justify-center text-ice border border-ice/20 group-hover:scale-110 transition-transform">
                    <Building2 className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] md:text-[9px] font-bold text-ice uppercase tracking-[0.3em] mb-1">Established</div>
                    <div className="text-xl md:text-2xl font-heading font-bold text-white">1999</div>
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-2xl md:text-4xl font-heading font-bold tracking-tight text-white leading-tight">SRM Valliammai <br className="hidden md:block" /><span className="text-ice">Engineering College</span></h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-ice/5 border border-ice/20 text-[8px] md:text-[9px] font-bold text-ice uppercase tracking-widest">Autonomous Institution</div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Part of the prestigious SRM Group of Educational Institutions, SRM Valliammai Engineering College spans 13.35 acres of lush greenery on NH 45. Founded by Dr. T.R. Paarivendhar, the institution is dedicated to the ideals of Tmt. R. Valliammai.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-ice/60" />
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tambaram, Chennai</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Library className="w-4 h-4 text-ice/60" />
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">NBA Accredited</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Card */}
            <div className="reveal-right group relative glass p-8 md:p-14 rounded-[2rem] md:rounded-[3.5rem] border-white/5 overflow-hidden transition-all duration-700 hover:border-fire/30 hover:-translate-y-2 flex flex-col justify-between">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-fire/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-fire/10 flex items-center justify-center text-fire border border-fire/20 group-hover:scale-110 transition-transform">
                    <Cpu className="w-8 h-8 md:w-10 md:h-10" />
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] md:text-[9px] font-bold text-fire uppercase tracking-[0.3em] mb-1">Since</div>
                    <div className="text-xl md:text-2xl font-heading font-bold text-white">2004</div>
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-2xl md:text-4xl font-heading font-bold tracking-tight text-white leading-tight">Dept. of <br className="hidden md:block" /><span className="text-fire">Information Technology</span></h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-fire/5 border border-fire/20 text-[8px] md:text-[9px] font-bold text-fire uppercase tracking-widest">Excellence Hub</div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Established in 1999 to meet global IT demands, the B.Tech-IT programme is renowned for creativity and software excellence. Home to "XPLOITS" since 2004, featuring specialized Labs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div className="flex items-center space-x-3">
                    <Award className="w-4 h-4 text-fire/60" />
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">Elite Placements</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-4 h-4 text-fire/60" />
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expert Faculty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Events Section */}
      <section id="events" className="py-16 md:py-32 bg-brand-alt border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-20 gap-8 reveal">
            <div className="space-y-3 md:space-y-4">
              <div className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-ice uppercase text-center lg:text-left">Operational Domains</div>
              <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter text-center lg:text-left">Arena <span className="text-ice italic">Selection</span></h2>
            </div>
            <div className="flex items-center justify-center space-x-2 md:space-x-3 bg-white/5 p-1.5 rounded-xl md:rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-ice text-white shadow-lg shadow-ice/20' 
                      : 'hover:bg-white/5 text-gray-400'
                  }`}
                >
                  {cat === 'technical' ? 'Technical' : cat === 'non-technical' ? 'Non-Technical' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 min-h-[400px]">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, idx) => (
                <div key={event.id} className="reveal-scale animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ transitionDelay: `${idx * 150}ms` }}>
                  <EventCard 
                    event={event} 
                    onClick={setSelectedEvent} 
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
                <HelpCircle className="w-12 h-12 opacity-20" />
                <p className="font-bold tracking-[0.2em] uppercase text-xs">No matching arenas found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 5: Staff Coordinators */}
      <section id="team" className="py-16 md:py-32 bg-brand-bg relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-fire-dark/5 blur-[100px] md:blur-[150px] rounded-full"></div>
        <div className="container mx-auto px-4 md:px-6 text-center mb-16 md:mb-24 reveal">
          <div className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] text-fire uppercase mb-4 md:mb-6">Expertise</div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter">Symposium <span className="text-fire">Leadership</span></h2>
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {STAFF_COORDINATORS.map((staff, idx) => (
              <div key={idx} className="reveal glass rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 text-center group transition-all hover:border-fire/30 hover:-translate-y-2 duration-500" style={{ transitionDelay: `${idx * 200}ms` }}>
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 md:mb-8 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ring-4 ring-white/5 group-hover:ring-fire/20 relative">
                  <img src={staff.image} alt={staff.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-fire/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 group-hover:text-fire transition-colors">{staff.name}</h3>
                <p className="text-fire-light text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mb-4 md:mb-6">{staff.designation}</p>
                <div className="w-12 md:w-16 h-[1px] bg-white/10 mx-auto mb-4 md:mb-6"></div>
                <p className="text-gray-500 text-[9px] md:text-[10px] leading-relaxed uppercase tracking-[0.2em] font-bold">{staff.department}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Student Coordinators (Council) */}
      <section className="py-16 md:py-32 bg-brand-alt border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-ice-dark/5 blur-[120px] md:blur-[180px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24 reveal">
            <div className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] md:tracking-[0.5em] text-ice uppercase mb-4 md:mb-6">Strategic Ops</div>
            <h2 className="text-4xl md:text-5 font-heading font-bold tracking-tighter">Architects of <span className="text-ice">Engagement</span></h2>
            <div className="mt-4 md:mt-6 flex items-center justify-center space-x-3 md:space-x-4">
              <div className="h-[1px] w-8 md:w-12 bg-ice/30"></div>
              <p className="text-gray-400 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em]">The Student Council</p>
              <div className="h-[1px] w-8 md:w-12 bg-ice/30"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {STUDENT_COORDINATORS.map((student, idx) => (
              <div key={idx} style={{ transitionDelay: `${idx * 100}ms` }} className="reveal">
                <StudentCoordCard student={student} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Maps & Gallery */}
      <section className="relative min-h-[500px] md:h-[700px] overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          <div className="reveal-left w-full md:w-1/2 h-64 md:h-full relative overflow-hidden group">
             <div className="absolute inset-0 bg-ice-dark/5 z-10 pointer-events-none"></div>
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.852378943963!2d80.2227181152636!3d13.04434221650893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52664539655f4d%3A0xe54911d33f2d2421!2sAnna%20University!5e0!3m2!1sen!2sin!4v1679313204961!5m2!1sen!2sin" 
                className="w-full h-full opacity-40 grayscale contrast-125 invert brightness-90 hover:opacity-60 transition-opacity duration-700"
                loading="lazy" 
                title="Venue Map"
             ></iframe>
             <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/80 via-transparent to-transparent pointer-events-none"></div>
             <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 p-6 md:p-8 glass rounded-[1.5rem] md:rounded-[2rem] border-ice/30 backdrop-blur-3xl z-20 max-w-[calc(100%-3rem)] md:max-w-sm">
                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-ice/10 flex items-center justify-center text-ice border border-ice/20">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="font-heading font-bold text-lg md:text-xl">Symposium HQ</span>
                </div>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
                  Knowledge Hub • Dept of IT<br/>
                  SRM Valliammai Engineering College<br/>
                  Chennai, Tamil Nadu - 603203
                </p>
             </div>
          </div>
          <div className="reveal-right w-full md:w-1/2 p-10 md:p-24 bg-brand-bg relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-4 p-4 md:p-8 opacity-20 scale-110 rotate-3">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="overflow-hidden rounded-2xl md:rounded-3xl grayscale">
                  <img src={`https://picsum.photos/seed/symp${n}/800/800`} className="w-full h-full object-cover" alt="Gallery" />
                </div>
              ))}
            </div>
            <div className="relative z-10 glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center max-w-md border-white/10 shadow-2xl backdrop-blur-md">
              <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4 md:mb-6 tracking-tighter">Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-fire to-ice">Chronicles</span></h3>
              <p className="text-gray-400 text-[11px] md:text-sm mb-6 md:mb-10 font-medium leading-relaxed">A legacy of technical excellence. Revisit the moments that define the symposium experience.</p>
              <button className="w-full py-3 md:py-4 glass rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-brand-bg transition-all duration-500 shadow-xl">Launch Gallery</button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Footer */}
      <footer id="contact" className="py-12 md:py-24 bg-brand-bg border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4 md:px-6 reveal">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-20 mb-12 md:mb-20">
            <div className="lg:col-span-2 space-y-6 md:space-y-10">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-fire to-ice rounded-xl flex items-center justify-center font-bold text-white text-xl md:text-2xl shadow-xl border border-white/10">X</div>
                <div>
                   <span className="font-heading font-bold text-2xl md:text-3xl tracking-tighter uppercase block">XPLOITS 26</span>
                   <span className="text-[9px] md:text-[10px] tracking-[0.3em] font-bold text-gray-500 uppercase">Information Technology</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md font-medium">
                Designing the future requires the heat of innovation and the cold logic of engineering. Join us for the odyssey.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <a href="#" className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:text-fire hover:bg-white/10 transition-all border border-white/5"><Instagram className="w-4 md:w-5 h-4 md:h-5" /></a>
                <a href="#" className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:text-ice hover:bg-white/10 transition-all border border-white/5"><Twitter className="w-4 md:w-5 h-4 md:h-5" /></a>
                <a href="#" className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:text-fire hover:bg-white/10 transition-all border border-white/5"><Linkedin className="w-4 md:w-5 h-4 md:h-5" /></a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-3 gap-8 md:gap-12">
              <div>
                <h4 className="font-heading font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-10 text-fire">Navigation</h4>
                <ul className="space-y-3 md:space-y-6 text-[9px] md:text-[11px] font-bold tracking-widest text-gray-500 uppercase">
                  <li><a href="#about" className="hover:text-white transition-colors">The Odyssey</a></li>
                  <li><a href="#events" className="hover:text-white transition-colors">Arena Maps</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Log</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-10 text-ice">Protocols</h4>
                <ul className="space-y-3 md:space-y-6 text-[9px] md:text-[11px] font-bold tracking-widest text-gray-500 uppercase">
                  <li><a href="#" className="hover:text-white transition-colors">Mission Intel</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Logistics</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-heading font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-10 text-white">HQ Details</h4>
                <ul className="space-y-3 md:space-y-6 text-[9px] md:text-[11px] font-bold tracking-widest text-gray-500 uppercase">
                  <li className="flex items-center"><Mail className="w-4 h-4 mr-3 text-fire" /> dispatch@xploits.tech</li>
                  <li className="flex items-center"><Phone className="w-4 h-4 mr-3 text-ice" /> +91 98765 43210</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] text-gray-600 uppercase text-center md:text-left gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
              <p>&copy; 2026 XPLOITS. Authorized Personnel Only.</p>
              <div className="hidden md:block w-10 h-[1px] bg-white/10"></div>
              <div className="text-fire">Fire & Ice Edition</div>
            </div>
            <div className="flex space-x-6 md:space-x-10">
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Render */}
      <EventModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
};

export default App;
