import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Edit, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";
import { InitiativeEditDialog } from "./InitiativeEditDialog";
import { toast } from "@/components/ui/use-toast";

interface Initiative {
  id: string;
  objectiveId: string;
  initiative: string;
  desiredOutcome: string;
}

export function ObjectivesList() {
  const { data: objectives, refetch } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives()
  });

  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);

  const handleUpdateInitiative = async (updatedInitiative: Initiative) => {
    await db.updateObjective(updatedInitiative.objectiveId, {
      initiative: updatedInitiative.initiative,
      desiredOutcome: updatedInitiative.desiredOutcome
    });
    refetch();
    setEditingInitiative(null);
    toast({
      title: "Success",
      description: "Initiative updated successfully",
    });
  };

  const handleDeleteInitiative = async (objectiveId: string, initiativeId: string) => {
    await db.deleteInitiative(objectiveId, initiativeId);
    refetch();
    toast({
      title: "Success",
      description: "Initiative deleted successfully",
    });
  };

  if (!objectives) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Strategic Objectives</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objectives.map((objective) => (
          <div key={objective.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{objective.title}</h3>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p>{objective.desiredOutcome}</p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>

            <div className="space-y-2">
              {[1, 2, 3].map((index) => {
                const initiative = {
                  id: `${objective.id}-initiative-${index}`,
                  objectiveId: objective.id,
                  initiative: objective.initiative || `Initiative ${index}`,
                  desiredOutcome: objective.desiredOutcome || `Desired outcome for initiative ${index}`
                };

                return (
                  <Card key={initiative.id} className="p-4 bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{initiative.initiative}</p>
                        <p className="text-sm text-muted-foreground">{initiative.desiredOutcome}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingInitiative(initiative)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteInitiative(objective.id, initiative.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <InitiativeEditDialog
        initiative={editingInitiative}
        onClose={() => setEditingInitiative(null)}
        onSave={handleUpdateInitiative}
      />
    </div>
  );
}