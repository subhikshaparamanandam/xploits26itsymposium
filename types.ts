
export interface EventData {
  id: string;
  title: string;
  category: 'technical' | 'non-technical' | 'workshop';
  theme: 'fire' | 'ice';
  description: string;
  rules: string[];
  date: string;
  time: string;
  venue: string;
  coordinators: { name: string; contact: string }[];
  image: string;
}

export interface Coordinator {
  name: string;
  designation: string;
  department: string;
  image: string;
  role?: string;
  phone?: string;
}

export interface Instruction {
  id: number;
  icon: string;
  title: string;
  text: string;
}
