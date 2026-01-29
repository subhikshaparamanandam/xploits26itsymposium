
import React from 'react';
import {
  Users,
  Clock,
  Calendar,
  HelpCircle,
  FileText,
  Zap,
  Cpu,
  Code,
  Globe,
  Ghost,
  Gamepad
} from 'lucide-react';
import { EventData, Coordinator, Instruction } from './types';

export const INSTRUCTIONS: Instruction[] = [
  { id: 1, icon: 'Users', title: 'Eligibility', text: 'Open to all Engineering & Tech students nationwide.' },
  { id: 2, icon: 'Users', title: 'Team Size', text: 'Varies by event (1–4 members per team).' },
  { id: 3, icon: 'Clock', title: 'Deadline', text: 'Register by Feb 10, 2026, 11:59 PM.' },
  { id: 4, icon: 'FileText', title: 'Guidelines', text: 'Carry College ID & Registration confirmation.' },
  { id: 5, icon: 'HelpCircle', title: 'Helpdesk', text: '24/7 technical support via WhatsApp.' },
];

export const EVENTS: EventData[] = [
  {
    id: 'paper-presentation',
    title: 'Paper Presentation',
    category: 'technical',
    theme: 'fire',
    description: 'Unleash your research potential. Present your innovative ideas to a panel of experts.',
    rules: [
      'Abstract must be submitted in PDF format.',
      'Max 2 authors per paper.',
      'Presentation duration: 8 mins + 2 mins Q&A.',
      'Content must be original and plague-free.'
    ],
    date: 'Feb 14, 2026',
    time: '10:00 AM',
    venue: 'Seminar Hall A',
    coordinators: [
      { name: 'VANAJA', contact: '+91 93448 39219' },
      { name: 'PAVITHRA', contact: '+91 79043 10660' }
    ],
    image: '/events/paper-presentation.png'
  },
  {
    id: 'mindblitz',
    title: 'MINDBLITZ',
    category: 'technical',
    theme: 'ice',
    description: 'A technical quiz event with three rounds: Tech Picto-Guess, Flowchart Fixer, and Rapid Tech Fire.',
    rules: [
      'Each team must consist of 2–3 participants.',
      'Elimination applies after each round based on scores.',
      'Discussion is allowed only within the team.',
      'Use of mobile phones or any external help is strictly prohibited.',
      'Laptop is mandatory. Use your own internet connection.'
    ],
    date: 'Feb 14, 2026',
    time: '09:00 AM',
    venue: 'Main Hall',
    coordinators: [
      { name: 'MADHU SRI', contact: '+91 94446 26989' },
      { name: 'MADHUMITHA', contact: '+91 93446 05870' }
    ],
    image: '/events/mindblitz.png'
  },
  {
    id: 'grand-theft-auction',
    title: 'Grand Theft Auction: Data City',
    category: 'technical',
    theme: 'fire',
    description: 'A data-driven simulation event integrating sports analytics and strategic decision-making through an IPL auction.',
    rules: [
      'Round 1: Technical quiz on IPL stats and data fundamentals.',
      'Round 2: Live bidding to acquire players with a ₹100 Crores budget.',
      'Teams must construct a balanced squad (Batsmen, Bowlers, etc.).',
      'Evaluation based on selection strategy (70%) and dashboard design (30%).',
      'Recommended tools: Power BI, Tableau, or standard viz platforms.'
    ],
    date: 'Feb 14, 2026',
    time: '11:00 AM',
    venue: 'Analytics Lab',
    coordinators: [
      { name: 'TARUN PRABAKARAN', contact: '+91 99622 60295' },
      { name: 'MUKESH RAAJ', contact: '+91 99625 73702' }
    ],
    image: '/events/grand-theft-auction.png'
  },
  {
    id: 'trading-emperor',
    title: 'TRADING EMPEROR',
    category: 'technical',
    theme: 'ice',
    description: 'Technical quiz combined with a business-style board game focused on buying and trading programming languages.',
    rules: [
      'Round 1: Build a block tower by answering tech questions (Bottle Flip to answer).',
      'Round 2: Strategic property-style game trading programming languages.',
      'Team Structure: Each team consists of two participants.',
      'Shortlisting based on number of blocks, accuracy, and tower stability.',
      'Final decision based on property ownership and overall performance.'
    ],
    date: 'Feb 14, 2026',
    time: '01:30 PM',
    venue: 'Business Lounge',
    coordinators: [
      { name: 'ROJA', contact: '+91 9150543023' },
      { name: 'VEERA AAKASH', contact: '+91 93428 26426' }
    ],
    image: '/events/trading-emperor.png'
  },
  {
    id: 'heistverse',
    title: 'HeistVerse - The Final Protocol',
    category: 'technical',
    theme: 'fire',
    description: 'A story-driven digital heist investigation with six sequential investigative rounds testing logic and analysis.',
    rules: [
      '6 Rounds: QR Decoding, Simon Logic, Reverse Coding, File Manager, Encrypted Analysis, Frequency Matching.',
      'Team size: 2–3 students. One laptop mandatory.',
      'Offline, on-campus lab and classroom setup.',
      'Once submitted, code/lines cannot be edited (Round 3).',
      'Only one member per team allowed for specific search phases.'
    ],
    date: 'Feb 14, 2026',
    time: '02:00 PM',
    venue: 'Cyber Security Lab',
    coordinators: [
      { name: 'SANJAIKUMAR', contact: '+91 90477 34581' },
      { name: 'TANU', contact: '+91 73052 65129' }
    ],
    image: '/events/heistverse.png'
  }
];

export const STAFF_COORDINATORS: Coordinator[] = [
  {
    name: 'Dr. S. Narayanan',
    designation: 'Professor & Head of Department',
    department: 'Dept. of Information Technology',
    image: '/Staff and Office Bearres/Staff/Head of Department.jpg'
  },
  {
    name: 'Dr. S. Sandhya',
    designation: 'Assistant Professor (Sr.G)',
    department: 'Dept. of Information Technology',
    image: '/Staff and Office Bearres/Staff/Staff Coordinator 1.jpg'
  },
  {
    name: 'Ms. S. Kiruthika',
    designation: 'Assistant Professor (O.G)',
    department: 'Dept. of Information Technology',
    image: '/Staff and Office Bearres/Staff/Staff Coordinator 2.jpg'
  }
];

export const STUDENT_COORDINATORS = [
  { role: 'President', name: 'Dharaneesh R D', phone: '9000000001', image: '/Staff and Office Bearres/Office B/President.jpg' },
  { role: 'Vice President', name: 'Aswin M', phone: '9000000002', image: '/Staff and Office Bearres/Office B/Vice President.jpg' },
  { role: 'Secretary', name: 'Shamitha R', phone: '9000000003', image: '/Staff and Office Bearres/Office B/Secretary.jpg' },
  { role: 'Joint Secretary', name: 'Preya Darsan A', phone: '9000000004', image: '/Staff and Office Bearres/Office B/Joint Secretary.jpg' },
  { role: 'Treasurer 1', name: 'Gayathri M', phone: '9000000005', image: '/Staff and Office Bearres/Office B/Treasurer 1.jpg' },
  { role: 'Treasurer 2', name: 'Pugal B', phone: '9000000006', image: '/Staff and Office Bearres/Office B/Treasurer 2.jpg' },
];
