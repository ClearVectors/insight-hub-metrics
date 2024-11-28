import { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { DatabaseActions } from "./DatabaseActions";
import { DataStats } from "./stats/DataStats";
import { useDataInitialization } from "./hooks/useDataInitialization";
import { DataCounts } from "./types/dataTypes";
import { toast } from "@/components/ui/use-toast";
import { LoadingStep, executeWithRetry } from "@/lib/utils/loadingRetry";
import { sampleFortune30 } from "@/lib/services/data/fortune30Partners";
import { generateSampleProjects, getSampleInternalPartners } from "@/lib/services/sampleData/sampleProjectGenerator";

export default function DataManagement() {
  const { isInitialized } = useDataInitialization();
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [dataCounts, setDataCounts] = useState<DataCounts>({
    projects: 0,
    spis: 0,
    objectives: 0,
    sitreps: 0,
    fortune30: 0,
    internalPartners: 0,
    smePartners: 0
  });

  useEffect(() => {
    if (isInitialized) {
      updateDataCounts();
    }
  }, [isInitialized]);

  const updateDataCounts = async () => {
    try {
      const projects = await db.getAllProjects();
      const spis = await db.getAllSPIs();
      const objectives = await db.getAllObjectives();
      const sitreps = await db.getAllSitReps();
      const collaborators = await db.getAllCollaborators();
      const smePartners = await db.getAllSMEPartners();

      setDataCounts({
        projects: projects.length,
        spis: spis.length,
        objectives: objectives.length,
        sitreps: sitreps.length,
        fortune30: collaborators.filter(c => c.type === 'fortune30').length,
        internalPartners: collaborators.filter(c => c.type === 'other').length,
        smePartners: smePartners.length
      });
    } catch (error) {
      console.error('Error updating data counts:', error);
      toast({
        title: "Error",
        description: "Failed to update data counts",
        variant: "destructive",
      });
    }
  };

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      await db.clear();
      await db.init();
      await updateDataCounts();
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const populateSampleData = async () => {
    if (!isInitialized) {
      toast({
        title: "Error",
        description: "Please wait for database initialization to complete.",
        variant: "destructive",
      });
      return;
    }

    setIsPopulating(true);
    
    try {
      const populateStep: LoadingStep = {
        name: "Sample Data Population",
        action: async () => {
          try {
            console.log('Starting sample data population...');
            
            // Add Fortune 30 collaborators
            console.log('Adding Fortune 30 collaborators...');
            for (const collaborator of sampleFortune30) {
              await db.addCollaborator(collaborator);
            }
            
            // Add internal partners
            console.log('Adding internal partners...');
            const internalPartners = await getSampleInternalPartners();
            for (const collaborator of internalPartners) {
              await db.addCollaborator(collaborator);
            }

            // Generate and add all sample data
            console.log('Generating and adding sample data...');
            const { projects, spis, objectives, sitreps } = await generateSampleProjects();
            
            // Add projects
            for (const project of projects) {
              await db.addProject(project);
            }
            
            // Add SPIs
            console.log('Adding SPIs...');
            for (const spi of spis) {
              await db.addSPI(spi);
            }

            // Add objectives
            console.log('Adding objectives...');
            for (const objective of objectives) {
              await db.addObjective(objective);
            }

            // Add sitreps
            console.log('Adding sitreps...');
            for (const sitrep of sitreps) {
              await db.addSitRep(sitrep);
            }
            
            await updateDataCounts();
            
            toast({
              title: "Success",
              description: `Sample data populated successfully`,
            });

            return true;
          } catch (error) {
            console.error('Sample data population error:', error);
            toast({
              title: "Error",
              description: `Failed to populate sample data: ${error?.message || 'Unknown error'}`,
              variant: "destructive",
            });
            return false;
          }
        }
      };

      await executeWithRetry(populateStep);
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Data Management</h2>
      <DatabaseActions
        isInitialized={isInitialized}
        isClearing={isClearing}
        isPopulating={isPopulating}
        onClear={clearDatabase}
        onPopulate={populateSampleData}
      />
      <DataStats dataCounts={dataCounts} />
    </div>
  );
}

