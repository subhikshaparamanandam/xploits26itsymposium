
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
import HeroScrollSequence from './components/ui/HeroScrollSequence';
import GalleryModal from './components/GalleryModal';

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
  return (
    <div className="reveal glass rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-center group transition-all hover:border-ice/30 hover:-translate-y-2 duration-500 relative overflow-hidden flex flex-col h-full min-h-[380px] md:min-h-[420px]">
      {/* Background Decorative Layer */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-ice/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="w-32 h-44 md:w-40 md:h-52 mx-auto mb-6 md:mb-8 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ring-4 ring-white/5 group-hover:ring-ice/20 relative shrink-0">
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
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(false);
  const [isHeroRegistering, setIsHeroRegistering] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Get unique categories from EVENTS
  const categories = ['All', ...new Set(EVENTS.map(event => event.category))];

  // Initialize Scroll Reveals
  useRevealOnScroll();

  useEffect(() => {
    let glitchTimeout: any;
    const scrollProgress = document.getElementById('scroll-progress');

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroScrollHeight = window.innerHeight * 2.5; // 300vh hero section

      setIsScrolled(currentScrollY > 50);
      // Hide header during hero animation scroll (between 50px and end of hero section)
      setIsInHeroSection(currentScrollY > 50 && currentScrollY < heroScrollHeight);

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
    window.open('http://docs.google.com/forms/d/e/1FAIpQLSfJed2QS8YsxEVeK5lXW7TlOnzNW9c-A5Feuwfj1YBItJKLHA/viewform?pli=1', '_blank');
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5 md:w-6 md:h-6" /> : <Info className="w-5 h-5 md:w-6 md:h-6" />;
  };

  const filteredEvents = activeCategory === 'All'
    ? EVENTS
    : EVENTS.filter(event => event.category === activeCategory);

  return (
    <div className="min-h-screen selection:bg-fire selection:text-white bg-[#050505]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isInHeroSection ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} ${isScrolled && !isInHeroSection ? 'bg-brand-bg/90 backdrop-blur-md py-3 md:py-4 border-b border-white/5' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-fire to-ice rounded-lg md:rounded-xl flex items-center justify-center font-bold text-white text-lg md:text-xl shadow-lg border border-white/10">X</div> */}
            <img
              src="/xploits-header-logo.png"
              alt="XPLOITS 26"
              className="h-8 md:h-12 object-contain filter drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            />
            {/* <div className="hidden xs:block">
              <span className="font-heading font-bold text-base md:text-xl tracking-tighter uppercase block leading-none">XPLOITS 26</span>
              <span className="text-[7px] md:text-[8px] tracking-[0.4em] font-bold text-gray-500 uppercase">National Symposium</span>
            </div> */}
          </div>
          <div className="hidden md:flex space-x-10 text-[10px] font-bold tracking-[0.3em] uppercase">
            <a href="#about" className="hover:text-white transition-colors">Odyssey</a>
            <a href="#events" className="hover:text-white transition-colors">Arenas</a>
            <a href="#team" className="hover:text-white transition-colors">Team</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <a
            href="http://docs.google.com/forms/d/e/1FAIpQLSfJed2QS8YsxEVeK5lXW7TlOnzNW9c-A5Feuwfj1YBItJKLHA/viewform?pli=1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 md:px-6 py-2 md:py-2.5 border border-white/10 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all shadow-xl backdrop-blur-sm"
          >
            Register
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroScrollSequence
        frameCount={80}
        baseUrl="/hero-animation"
        prefix="lv_0_20260125155018_"
        extension="jpg"
        mobileBaseUrl="/hero-animation-mobile"
        mobilePrefix="lv_0_20260125190320_"
        mobileCount={64}
      >
        <div className="relative h-full flex flex-col justify-between text-center px-4 md:px-6">
          {/* Subtle gradient overlays - optimized for visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/80 via-transparent to-brand-bg/90 pointer-events-none"></div>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-bg to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent pointer-events-none"></div>

          {/* Top Section - Compact Institutional Branding */}
          <div className="relative z-20 pt-20 md:pt-24">
            <div className="inline-flex items-center justify-center gap-4 md:gap-8 px-6 md:px-10 py-3 md:py-4 backdrop-blur-xl bg-black/40 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl">
              <img src="/srm-logo.png" alt="SRM Logo" className="h-10 md:h-14 lg:h-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
              <div className="text-center border-l border-r border-white/10 px-4 md:px-8">
                <h2 className="text-sm md:text-xl lg:text-2xl font-heading font-black text-white tracking-tight uppercase leading-tight drop-shadow-lg">
                  SRM Valliammai Engineering College
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <div className="h-[1px] w-4 md:w-8 bg-gradient-to-r from-transparent to-ice/50"></div>
                  <p className="text-[8px] md:text-[10px] font-bold text-ice uppercase tracking-[0.25em]">
                    Department of Information Technology
                  </p>
                  <div className="h-[1px] w-4 md:w-8 bg-gradient-to-l from-transparent to-fire/50"></div>
                </div>
              </div>
              <img src="/vec-logo.png" alt="VEC Logo" className="h-10 md:h-14 lg:h-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
            </div>
          </div>

          {/* Center - Spacer for animation visibility */}
          <div className="flex-1 min-h-[250px] md:min-h-[350px]"></div>

          {/* Bottom Section - Compact Event Info, Countdown, CTA */}
          <div className="relative z-20 pb-4 md:pb-8 space-y-3 md:space-y-4">
            {/* Event Title Badge */}
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 backdrop-blur-xl bg-black/50 rounded-full border border-white/10 shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-fire animate-pulse"></div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-white tracking-[0.15em] uppercase font-bold">
                  National Level Technical Symposium
                </p>
                <span className="text-white/30">•</span>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-ice tracking-[0.1em] font-black">
                  14.02.2026
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-ice animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>

            {/* Register Button - Compact */}
            <div className="flex items-center justify-center">
              <button
                onClick={handleHeroRegister}
                disabled={isHeroRegistering}
                className="px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-fire to-fire-dark text-white font-bold rounded-xl uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px] hover:from-fire-dark hover:to-fire transition-all shadow-[0_0_30px_rgba(255,138,0,0.5)] hover:shadow-[0_0_50px_rgba(255,138,0,0.7)] hover:scale-105 active:scale-95 group border border-fire-light/30 disabled:opacity-70"
              >
                <span className="flex items-center justify-center gap-2">
                  {isHeroRegistering ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      Register Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Scroll indicator - Minimal */}
            <div className="flex flex-col items-center opacity-40 pt-2">
              <div className="text-[7px] md:text-[8px] tracking-[0.3em] uppercase mb-2 font-bold text-white/70">Scroll</div>
              <div className="w-4 h-6 rounded-full border border-white/30 flex items-start justify-center p-1">
                <div className="w-0.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </HeroScrollSequence>

      {/* Section 2: Instructions - Horizontal Glassmorphism Cards */}
      <section className="py-16 md:py-32 bg-brand-bg relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 md:mb-16 text-center reveal">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-gray-500 uppercase mb-4 md:mb-6">Intelligence Briefing</div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tighter">Mission <span className="text-fire">Protocols</span></h2>
          </div>

          {/* Countdown Timer - Moved from Hero */}
          <div className="flex flex-col items-center justify-center mb-12 md:mb-16 reveal">
            <Countdown />
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
              <div className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.5em] text-ice uppercase text-center lg:text-left">Technical Events</div>
              <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter text-center lg:text-left">Arena <span className="text-ice italic">Selection</span></h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {EVENTS.map((event, idx) => (
              <div key={event.id} className="reveal-scale animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ transitionDelay: `${idx * 150}ms` }}>
                <EventCard
                  event={event}
                  onClick={setSelectedEvent}
                />
              </div>
            ))}
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
                <div className="w-32 h-44 md:w-40 md:h-52 mx-auto mb-6 md:mb-8 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ring-4 ring-white/5 group-hover:ring-fire/20 relative">
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.2680217675515!2d80.03873787454442!3d12.825949418055925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52f70d79722631%3A0x49afcd4648f94894!2sSRM%20Valliammai%20Engineering%20College!5e0!3m2!1sen!2sin!4v1769664353540!5m2!1sen!2sin"
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
                Dept of IT<br />
                <span className="text-white font-bold">SRM Valliammai Engineering College</span><br />
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
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="w-full py-3 md:py-4 glass rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-brand-bg transition-all duration-500 shadow-xl"
              >
                Launch Gallery
              </button>
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
                <img
                  src="/xploits-header-logo.png"
                  alt="XPLOITS 26"
                  className="h-10 md:h-14 object-contain filter drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                />
              </div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md font-medium">
                Designing the future requires the heat of innovation and the cold logic of engineering. Join us for the odyssey.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <a href="https://www.instagram.com/xploits26/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center hover:text-fire hover:bg-white/10 transition-all border border-white/5"><Instagram className="w-4 md:w-5 h-4 md:h-5" /></a>
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
                {/* Contact Details Removed */}
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

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
};

export default App;
