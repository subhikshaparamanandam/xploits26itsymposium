
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
    coordinators: [{ name: 'Arun Kumar', contact: '+91 9876543210' }],
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'coding-battle',
    title: 'Code Genesis',
    category: 'technical',
    theme: 'ice',
    description: 'A high-speed competitive programming event where logic meets speed.',
    rules: [
      'Individual participation.',
      'Languages: C++, Java, Python.',
      '3 Rounds: MCQ, Debugging, Problem Solving.',
      'Internet usage is strictly prohibited.'
    ],
    date: 'Feb 14, 2026',
    time: '11:30 AM',
    venue: 'Computing Lab 2',
    coordinators: [{ name: 'Sreya V', contact: '+91 9876543211' }],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'ui-ux-design',
    title: 'Pixel Perfect',
    category: 'technical',
    theme: 'fire',
    description: 'Design a premium interface based on the spot theme provided.',
    rules: [
      'Figma or Adobe XD only.',
      'Theme will be revealed at the start.',
      'Focus on usability and aesthetic flow.',
      'Duration: 2 hours.'
    ],
    date: 'Feb 14, 2026',
    time: '09:30 AM',
    venue: 'Design Studio',
    coordinators: [{ name: 'Rahul R', contact: '+91 9876543212' }],
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'cyber-sentry',
    title: 'Cyber Sentry',
    category: 'technical',
    theme: 'ice',
    description: 'Defend your perimeter. A high-stakes capture the flag event focusing on network security and cryptography.',
    rules: [
      'Team of 2 members.',
      'Bring your own laptop with required tools.',
      'Exploitation of game servers only.',
      'Points based on flags captured and time.'
    ],
    date: 'Feb 14, 2026',
    time: '02:00 PM',
    venue: 'Cyber Security Hub',
    coordinators: [{ name: 'Manoj P', contact: '+91 9876543214' }],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'robo-rumble',
    title: 'Robo Rumble',
    category: 'technical',
    theme: 'fire',
    description: 'Engineering meets adrenaline. Witness custom-built bots battle for supremacy in the arena.',
    rules: [
      'Bot weight must not exceed 15kg.',
      'Dimensions within 30x30x30 cm.',
      'Wired or wireless control allowed.',
      'Safety goggles are mandatory.'
    ],
    date: 'Feb 14, 2026',
    time: '11:00 AM',
    venue: 'Arena Zero',
    coordinators: [{ name: 'Sanjay T', contact: '+91 9876543215' }],
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=2070&auto=format&fit=crop'
  }
];

export const STAFF_COORDINATORS: Coordinator[] = [
  {
    name: 'Dr. S. Narayanan',
    designation: 'Professor & Head of Department',
    department: 'Dept. of Information Technology',
    image: 'https://via.placeholder.com/400x400?text=HOD'
  },
  {
    name: 'Dr. S. Sandhya',
    designation: 'Assistant Professor (Sr.G)',
    department: 'Staff Coordinator 1',
    image: '/Staff and Office Bearres/Staff/Staff Coordinator 1.jpg'
  },
  {
    name: 'Ms. S. Kiruthika',
    designation: 'Assistant Professor (O.G)',
    department: 'Staff Coordinator 2',
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
