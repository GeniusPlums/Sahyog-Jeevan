export interface User {
  id: number;
  username: string;
  role: 'worker' | 'employer';
}

export interface Job {
  id: number;
  employerId: number;
  title: string;
  category: string;
  description: string;
  location: string;
  salary: string;
  requirements: string | string[];
  type: string;
  shift: string;
  workingDays: string;
  status: 'open' | 'closed' | string;
  benefits: Record<string, boolean>;
  companyLogo?: string;
  previewImage?: string;
  createdAt: string;
  companyName?: string;
  applied?: boolean;
  experience?: string;
  education?: string;
}

export interface Application {
  id: number;
  jobId: number;
  workerId: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  job?: Job;
}

export interface Profile {
  id: number;
  userId: number;
  name: string;
  companyName?: string;
  companyDescription?: string;
  location: string;
  contact: string;
}
