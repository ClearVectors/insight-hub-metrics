import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Database, Info, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";

interface DataCounts {
  projects: number;
  spis: number;
  objectives: number;
  sitreps: number;
  fortune30: number;
  internalPartners: number;
  smePartners: number;
}

export function SampleDataSettings() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);
  const [quantities, setQuantities] = useState({
    projects: 10,
    spis: 10,
    objectives: 5,
    sitreps: 10,
    fortune30: 6,  // Changed from 30 to 6
    internalPartners: 20,
    smePartners: 10
  });
  const [generatedCounts, setGeneratedCounts] = useState<DataCounts | null>(null);

  const updateQuantity = (key: keyof typeof quantities, value: string) => {
    const numValue = parseInt(value) || 0;
    setQuantities(prev => ({ ...prev, [key]: numValue }));
  };

  const clearDatabase = async () => {
    setIsClearing(true);
    try {
      await db.clear();
      await db.init();
      setGeneratedCounts(null);
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

  const populateDatabase = async () => {
    setIsPopulating(true);
    try {
      const result = await db.populateSampleData(quantities);
      
      // Get actual counts from database
      const projects = await db.getAllProjects();
      const spis = await db.getAllSPIs();
      const objectives = await db.getAllObjectives();
      const sitreps = await db.getAllSitReps();
      const fortune30 = await db.getAllCollaborators();
      const internalPartners = await db.getAllCollaborators();
      const smePartners = await db.getAllSMEPartners();

      const counts: DataCounts = {
        projects: projects.length,
        spis: spis.length,
        objectives: objectives.length,
        sitreps: sitreps.length,
        fortune30: fortune30.filter(c => c.type === 'fortune30').length,
        internalPartners: internalPartners.filter(c => c.type === 'other').length,
        smePartners: smePartners.length
      };

      setGeneratedCounts(counts);

      // Validate counts match requested quantities
      const mismatches = Object.entries(counts).filter(
        ([key, count]) => count !== quantities[key as keyof typeof quantities]
      );

      if (mismatches.length > 0) {
        toast({
          title: "Warning",
          description: "Some data quantities don't match requested amounts. Check the generated counts.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Sample data generated successfully with requested quantities",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to populate database",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(quantities).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
            <Input
              id={key}
              type="number"
              min="0"
              value={value}
              onChange={(e) => updateQuantity(key as keyof typeof quantities, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isClearing}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Database
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will clear all data from the database. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearDatabase}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button onClick={populateDatabase} disabled={isPopulating}>
          <Database className="h-4 w-4 mr-2" />
          {isPopulating ? "Generating..." : "Generate Sample Data"}
        </Button>
      </div>

      {generatedCounts && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Generated Data Counts</h3>
            <div className="grid gap-2">
              {Object.entries(generatedCounts).map(([key, count]) => (
                <div key={key} className="flex justify-between items-center">
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span className={count === quantities[key as keyof typeof quantities] ? "text-green-600" : "text-red-600"}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}