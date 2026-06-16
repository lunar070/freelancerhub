import { Project, UserProfile, Notification } from './types';

export const DEMO_CLIENT: UserProfile = {
  id: 'usr-client',
  name: 'Catherine Vance',
  email: 'client@test.com',
  password: 'test',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  role: 'client',
  bio: 'Product Lead at Apex Digital. I hire talented freelancers to build beautiful web apps, landing pages, and API integrations.',
  rating: 4.9,
  totalSpent: 15000,
  completedJobsCount: 4,
};

export const DEMO_CLIENT_2: UserProfile = {
  id: 'usr-client-2',
  name: 'Julia Thorne',
  email: 'julia@test.com',
  password: 'test',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  role: 'client',
  bio: 'Creative Director at VibeFlow. Building high-fidelity responsive websites with striking typography.',
  rating: 4.7,
  totalSpent: 8500,
  completedJobsCount: 2,
};

export const DEMO_FREELANCER: UserProfile = {
  id: 'usr-freelancer',
  name: 'Alex Rivera',
  email: 'freelancer@test.com',
  password: 'test',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  role: 'freelancer',
  bio: 'Senior Frontend Developer & UI Designer. Expert in React, Tailwind CSS, Framer Motion, and lightweight fullstack integrations.',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'UI Design'],
  hourlyRate: 75,
  rating: 4.8,
  totalEarnings: 23400,
  completedJobsCount: 12,
};

export const DEMO_FREELANCER_2: UserProfile = {
  id: 'usr-freelancer-2',
  name: 'David Chen',
  email: 'david@test.com',
  password: 'test',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  role: 'freelancer',
  bio: 'Full-Stack Engineer. Passionate about performant database pipelines, Stripe integrations, and robust server frameworks.',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Stripe API'],
  hourlyRate: 85,
  rating: 4.9,
  totalEarnings: 15600,
  completedJobsCount: 8,
};

// Seed Users List
export const SEED_USERS: UserProfile[] = [
  DEMO_CLIENT,
  DEMO_CLIENT_2,
  DEMO_FREELANCER,
  DEMO_FREELANCER_2
];

// Helper to get and set local user profiles list
export function getSavedUsers(): UserProfile[] {
  const saved = localStorage.getItem('freelance_hub_users');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing users', e);
    }
  }
  // Initialize with seeds
  localStorage.setItem('freelance_hub_users', JSON.stringify(SEED_USERS));
  return SEED_USERS;
}

export function saveUsers(users: UserProfile[]) {
  localStorage.setItem('freelance_hub_users', JSON.stringify(users));
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Portfolio Website Redesign',
    description: 'Build a fully responsive and interactive developer portfolio in React with sleek micro-animations, customizable dark/light slate theme, and elegant layout grids.',
    skills: ['React', 'Tailwind CSS', 'Framer Motion'],
    budget: 5000,
    clientName: 'Catherine Vance',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    clientEmail: 'client@test.com',
    status: 'active',
    createdAt: '2026-06-10T09:00:00Z',
    proposals: [
      {
        id: 'prop-1',
        projectId: 'proj-1',
        projectTitle: 'Portfolio Website Redesign',
        freelancerName: 'David Chen',
        freelancerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        freelancerEmail: 'david@test.com',
        bidAmount: 4800,
        timelineDays: 7,
        coverLetter: 'Hi Catherine! I have built over 15 portfolios for tech executives. I love your visual guidelines and can deliver standard-conforming clean code inside 7 days.',
        status: 'pending',
        createdAt: '2026-06-12T14:30:00Z',
      },
    ],
    reviews: []
  },
  {
    id: 'proj-2',
    title: 'E-commerce Checkout Pipeline',
    description: 'Looking for an expert to optimize our web app checkout pipeline. Tasks include multi-tier tax computations, Stripe element upgrades, and implementing a quick visual order summary drawer.',
    skills: ['TypeScript', 'Stripe API', 'React'],
    budget: 10000,
    clientName: 'Catherine Vance',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    clientEmail: 'client@test.com',
    status: 'active',
    createdAt: '2026-06-11T16:45:00Z',
    proposals: [
      {
        id: 'prop-2',
        projectId: 'proj-2',
        projectTitle: 'E-commerce Checkout Pipeline',
        freelancerName: 'Alex Rivera',
        freelancerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        freelancerEmail: 'freelancer@test.com',
        bidAmount: 9500,
        timelineDays: 10,
        coverLetter: 'Hello Catherine, I specializing in financial gateways and custom Stripe elements. Ready to integrate stateful fallback buffers to guarantee 0% order dropoffs.',
        status: 'pending',
        createdAt: '2026-06-13T10:15:00Z',
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        projectId: 'proj-2',
        reviewerName: 'Marcus Brodie',
        reviewerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        comment: 'Exceptional visual design and brilliant speed! Reduced checkout clicks from 5 to 2. Highly recommended lead developer.',
        createdAt: '2026-05-20T11:00:00Z',
      }
    ]
  },
  {
    id: 'proj-3',
    title: 'Mobile App Sign-in Restyle',
    description: 'Upgrade the visual onboarding and landing modals of our existing subscription application. Needs high-quality typography spacing, pleasant gradient borders, and reactive input states.',
    skills: ['Figma to React', 'Tailwind CSS'],
    budget: 3500,
    clientName: 'Julia Thorne',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    clientEmail: 'julia@test.com',
    status: 'active',
    createdAt: '2026-06-14T08:20:00Z',
    proposals: [],
    reviews: []
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Bid Received',
    message: 'David Chen submitted a proposal for "Portfolio Website Redesign".',
    type: 'proposal',
    read: false,
    createdAt: '2026-06-12T14:30:00Z',
  },
  {
    id: 'notif-2',
    title: 'Bid Submitted',
    message: 'Your bid for "E-commerce Checkout Pipeline" was successfully submitted.',
    type: 'status_change',
    read: true,
    createdAt: '2026-06-13T10:15:00Z',
  }
];

// Helper to get projects from localStorage or fallback to defaults
export function getSavedProjects(): Project[] {
  const saved = localStorage.getItem('freelance_hub_projects');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing projects from localStorage', e);
    }
  }
  return INITIAL_PROJECTS;
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem('freelance_hub_projects', JSON.stringify(projects));
}

// Helper to get notifications from localStorage
export function getSavedNotifications(): Notification[] {
  const saved = localStorage.getItem('freelance_hub_notifications');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing notifications', e);
    }
  }
  return INITIAL_NOTIFICATIONS;
}

export function saveNotifications(notifications: Notification[]) {
  localStorage.setItem('freelance_hub_notifications', JSON.stringify(notifications));
}
