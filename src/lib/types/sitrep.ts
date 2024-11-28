export type SitRep = {
  id: string;
  title: string;
  date: string;
  spiId: string;
  projectId?: string;
  update: string;
  challenges: string;
  nextSteps: string;
  status: 'on-track' | 'at-risk' | 'blocked';
  summary: string;
  departmentId: string;
};