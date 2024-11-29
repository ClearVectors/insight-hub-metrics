import { Project, Collaborator } from '@/lib/types';
import { generateFortune30Partners } from '@/lib/services/data/generators/fortune30Generator';
import { generateInternalPartners } from '@/lib/services/data/generators/internalPartnersGenerator';
import { generateSMEPartners } from '@/lib/services/data/generators/smePartnersGenerator';
import { generateSampleProjects } from '@/components/data/SampleData';
import { generateSampleSPIs, generateSampleObjectives, generateSampleSitReps } from '@/lib/services/data/generators/spiGenerator';
import { DataQuantities } from '@/lib/types/data';
import { toast } from "@/components/ui/use-toast";

export class SampleDataService {
  private validateQuantities(available: number, requested: number, type: string): number {
    if (requested > available) {
      console.log(`Adjusting ${type} quantity from ${requested} to ${available} (maximum available)`);
      toast({
        title: "Notice",
        description: `Requested ${requested} ${type}, but only ${available} are available. Adjusting quantity.`,
        variant: "default",
      });
      return available;
    }
    return requested;
  }

  async generateSampleData(quantities: DataQuantities = {
    projects: 10,
    spis: 10,
    objectives: 5,
    sitreps: 10,
    fortune30: 6,
    internalPartners: 20,
    smePartners: 10
  }) {
    try {
      console.log('Starting sample data generation with quantities:', quantities);
      
      const allFortune30 = generateFortune30Partners();
      console.log('Generated Fortune 30 partners:', allFortune30.length);
      
      const allInternalPartners = await generateInternalPartners();
      console.log('Generated internal partners:', allInternalPartners.length);
      
      const allSMEPartners = generateSMEPartners();
      console.log('Generated SME partners:', allSMEPartners.length);

      // Validate and adjust quantities
      const fortune30Count = this.validateQuantities(allFortune30.length, quantities.fortune30, "Fortune 30 partners");
      const internalCount = this.validateQuantities(allInternalPartners.length, quantities.internalPartners, "internal partners");

      const fortune30Partners = allFortune30.slice(0, fortune30Count);
      const internalPartners = allInternalPartners.slice(0, internalCount);

      const { projects, spis, objectives, sitreps } = await generateSampleProjects(quantities);

      return {
        fortune30Partners,
        internalPartners,
        smePartners: allSMEPartners,
        projects,
        spis,
        objectives,
        sitreps
      };
    } catch (error) {
      console.error('Error in sample data generation:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      toast({
        title: "Error",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }
}