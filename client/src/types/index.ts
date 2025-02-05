export type Job = {
  id: number;
  employerId: number;
  title: string;
  category: string;
  description: string;
  location: string;
  salary: string;
  requirements: string[];
  type: "FULL TIME" | "PART TIME" | "CONTRACT";
  shift: string;
  workingDays: string;
  status: "open" | "closed";
  benefits?: any;
  companyLogo?: string | null;
  previewImage?: string | null;
  createdAt?: Date | null;
  company?: string;
  postedAt?: Date;
  postedDate?: Date;
  applications?: number;
  views?: number;
  applicationsToday?: number;
  applied?: boolean;
  image?: string;
};

export type Application = {
  id: number;
  jobId: number;
  workerId: number;
  status: "pending" | "shortlisted" | "accepted" | "rejected" | "withdrawn";
  note?: string;
  createdAt?: Date;
  interviewDate?: Date;
  documents?: any;
  interviewLocation?: string;
  offeredSalary?: string;
  joinDate?: Date;
};

export type RegisterData = {
  username: string;
  password: string;
  role: "worker" | "employer";
};

export type User = {
  id: number;
  username: string;
  role: "worker" | "employer" | "admin";
  createdAt?: Date;
  isVerified?: boolean;
  lastActive?: Date;
};
