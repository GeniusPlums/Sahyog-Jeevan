import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  location: string;
  salary: string;
  type: string;
  shift: string;
  status: 'open' | 'closed';
  employerId: number;
  companyName: string;
  companyLogo?: string;
  previewImage?: string;
  createdAt: Date;
  postedDate?: Date;
  applications?: number;
  views?: number;
  applicationsToday?: number;
  positions?: number; // Number of people to be employed
  workingDays?: string;
  category: string;
  image?: string;
  applied?: boolean;
}

export interface Application {
  id: number;
  jobId: number;
  status: 'pending' | 'shortlisted' | 'rejected' | 'accepted';
  createdAt: Date;
  job: Job;
  startDate?: string;
  applicant?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    resume?: string;
  };
}

export const jobsApi = {
  getAll: async () => {
    try {
      const response = await api.get<Job[]>('/jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get<Job>(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },
  create: (data: FormData) => api.post<Job>('/jobs', data).then(res => res.data),
  update: (id: number, data: FormData) => api.put<Job>(`/jobs/${id}`, data).then(res => res.data),
  getEmployerJobs: () => api.get<Job[]>('/employer/jobs').then(res => res.data),
  delete: (id: number) => api.delete<void>(`/jobs/${id}`).then(res => res.data),
};

export const applicationsApi = {
  getAll: async () => {
    try {
      const response = await api.get<Application[]>('/applications/worker');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  },
  getAccepted: () => api.get<Application[]>('/applications/accepted').then(res => res.data),
  create: (jobId: number, data: FormData) => api.post<Application>(`/jobs/${jobId}/apply`, data).then(res => res.data),
  getEmployerApplications: () => api.get<Application[]>('/employer/applications').then(res => res.data),
  getJobApplications: (jobId: number) => api.get<Application[]>(`/jobs/${jobId}/applications`).then(res => res.data),
  updateStatus: (applicationId: number, status: Application['status']) => 
    api.patch<Application>(`/applications/${applicationId}/status`, { status }).then(res => res.data),
};

export default api;
