export type UserRole = 'client' | 'freelancer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  bio: string;
  skills?: string[];
  hourlyRate?: number;
  rating: number;
  totalEarnings?: number;
  totalSpent?: number;
  completedJobsCount: number;
}

export interface Proposal {
  id: string;
  projectId: string;
  projectTitle: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerEmail: string;
  bidAmount: number;
  timelineDays: number;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'declined' | 'interviewing';
  createdAt: string;
  interviewDetails?: {
    dateTime: string;
    platform: string;
    notes?: string;
  };
}

export interface Review {
  id: string;
  projectId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  clientName: string;
  clientAvatar: string;
  clientEmail: string;
  status: 'active' | 'assigned' | 'completed';
  proposals: Proposal[];
  reviews: Review[];
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'proposal' | 'status_change' | 'review' | 'new_project';
  read: boolean;
  createdAt: string;
}
