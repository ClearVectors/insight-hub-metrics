import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { DataCounts } from "../types/dataTypes";

export function useDataCounts(isInitialized: boolean) {
  const queryClient = useQueryClient();

  const fetchDataCounts = async (): Promise<DataCounts> => {
    if (!isInitialized) {
      console.log('Database not initialized, returning empty counts');
      return {
        projects: 0,
        spis: 0,
        objectives: 0,
        sitreps: 0,
        fortune30: 0,
        internalPartners: 0,
        smePartners: 0
      };
    }
    
    try {
      console.log('Initializing database...');
      await db.init();
      console.log('Database initialized, fetching counts...');
      
      // Fetch all data with proper error handling
      const [
        projects = [],
        spis = [],
        objectives = [],
        sitreps = [],
        collaborators = [],
        smePartners = []
      ] = await Promise.all([
        db.getAllProjects().catch(err => {
          console.error('Error fetching projects:', err);
          return [];
        }),
        db.getAllSPIs().catch(err => {
          console.error('Error fetching SPIs:', err);
          return [];
        }),
        db.getAllObjectives().catch(err => {
          console.error('Error fetching objectives:', err);
          return [];
        }),
        db.getAllSitReps().catch(err => {
          console.error('Error fetching sitreps:', err);
          return [];
        }),
        db.getAllCollaborators().catch(err => {
          console.error('Error fetching collaborators:', err);
          return [];
        }),
        db.getAllSMEPartners().catch(err => {
          console.error('Error fetching SME partners:', err);
          return [];
        })
      ]);

      const counts = {
        projects: projects.length,
        spis: spis.length,
        objectives: objectives.length,
        sitreps: sitreps.length,
        fortune30: collaborators.filter(c => c.type === 'fortune30').length,
        internalPartners: collaborators.filter(c => c.type === 'internal').length,
        smePartners: smePartners.length
      };

      console.log('Data fetched successfully:', counts);
      return counts;
    } catch (error) {
      console.error('Error in fetchDataCounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data counts. Please ensure the database is properly initialized.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data: dataCounts = {
    projects: 0,
    spis: 0,
    objectives: 0,
    sitreps: 0,
    fortune30: 0,
    internalPartners: 0,
    smePartners: 0
  }, isLoading, refetch } = useQuery({
    queryKey: ['data-counts'],
    queryFn: fetchDataCounts,
    enabled: isInitialized,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache the data
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const updateDataCounts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['data-counts'] });
    // Also invalidate individual count queries
    Object.keys(dataCounts).forEach(key => {
      queryClient.invalidateQueries({ queryKey: ['data-count', key] });
    });
    await refetch();
  };

  return { dataCounts, updateDataCounts, isLoading };
}