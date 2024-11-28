export interface SPI {
  id: string;
  name: string;
  deliverable: string;
  details: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: 'on-track' | 'delayed' | 'completed' | 'cancelled';
  projectId?: string;
  fortune30Id?: string;
  internalPartnerId?: string;
  departmentId?: string;
  sitrepIds: string[];
  createdAt: string;
}