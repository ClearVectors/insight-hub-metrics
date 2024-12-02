import { z } from 'zod';
import { dataQuantitiesSchema } from '../validation/databaseSchemas';

export type DataQuantities = z.infer<typeof dataQuantitiesSchema>;

export interface DataCounts {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
  initiatives: number;
}