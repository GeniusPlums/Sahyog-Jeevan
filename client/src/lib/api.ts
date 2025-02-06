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
}

export interface Application {
  id: number;
  jobId: number;
  status: 'pending' | 'shortlisted' | 'rejected' | 'accepted';
  createdAt: Date;
  job: Job;
  startDate?: string;
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
  getEmployerJobs: () => api.get<Job[]>('/employer/jobs').then(res => res.data),
  delete: (id: number) => api.delete<void>(`/jobs/${id}`).then(res => res.data),
};

export const applicationsApi = {
  getAll: () => api.get<Application[]>('/applications/worker').then(res => res.data),
  getAccepted: () => api.get<Application[]>('/applications/accepted').then(res => res.data),
  create: (jobId: number, data: FormData) => api.post<Application>(`/jobs/${jobId}/apply`, data).then(res => res.data),
};

export default api;
