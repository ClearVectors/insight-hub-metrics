import { useState } from "react";
import { SPIForm } from "@/components/spi/SPIForm";
import { SPIList } from "@/components/spi/SPIList";
import { ObjectivesList } from "@/components/spi/objectives/ObjectivesList";
import { InitiativesList } from "@/components/spi/initiatives/InitiativesList";
import { SPIAnalytics } from "@/components/spi/analytics/SPIAnalytics";
import { SPIStats } from "@/components/spi/SPIStats";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SPIPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['spis'] });
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule Performance Index</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New SPI</DialogTitle>
            </DialogHeader>
            <SPIForm onSubmitSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <SPIStats />

      <Tabs defaultValue="spis">
        <TabsList>
          <TabsTrigger value="spis">SPIs</TabsTrigger>
          <TabsTrigger value="objectives">Objectives</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="spis">
          <SPIList />
        </TabsContent>
        <TabsContent value="objectives">
          <ObjectivesList />
        </TabsContent>
        <TabsContent value="initiatives">
          <InitiativesList />
        </TabsContent>
        <TabsContent value="analytics">
          <SPIAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}