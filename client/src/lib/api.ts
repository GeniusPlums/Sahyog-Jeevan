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
  status: 'active' | 'draft';
  employerId: number;
  companyName: string;
  companyLogo?: string;
  previewImage?: string;
  createdAt: Date;
}

export const jobsApi = {
  getAll: () => api.get<Job[]>('/jobs').then(res => res.data),
  getById: (id: number) => api.get<Job>(`/jobs/${id}`).then(res => res.data),
  create: (data: FormData) => api.post<Job>('/jobs', data).then(res => res.data),
  getEmployerJobs: () => api.get<Job[]>('/employer/jobs').then(res => res.data),
};

export default api;
