import { useState } from "react";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { DatabaseClearingService } from "@/lib/services/db/DatabaseClearingService";

export function useDataClearing() {
  const [isClearing, setIsClearing] = useState(false);

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      // Initialize database first
      await db.init();
      
      // Create a new instance of DatabaseClearingService with the initialized db
      const clearingService = new DatabaseClearingService((db as any).getDatabase());
      await clearingService.clearDatabase();
      
      // Reinitialize after clearing
      await db.init();
      
      toast({
        title: "Success",
        description: "Database cleared successfully",
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Error",
        description: "Failed to clear database",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return { isClearing, clearDatabase };
}