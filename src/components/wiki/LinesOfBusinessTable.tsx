import { Card } from "@/components/ui/card";
import { DEPARTMENTS } from "@/lib/constants";
import { Info } from "lucide-react";
import { useState } from "react";
import { POCEditDialog } from "./POCEditDialog";
import { LOBCard } from "./LOBCard";
import { businessCategories as initialCategories } from "./data/businessCategories";
import { toast } from "../ui/use-toast";
import { LOB } from "./data/businessCategories";

export function LinesOfBusinessTable() {
  const [categories, setCategories] = useState(initialCategories);

  const handleUpdate = (categoryIndex: number, data: { 
    name: string;
    description: string;
  }) => {
    setCategories(prev => prev.map((category, index) => 
      index === categoryIndex 
        ? { 
            ...category, 
            name: data.name,
            description: data.description,
          }
        : category
    ));
    toast({
      title: "Success",
      description: "Category information updated successfully",
    });
  };

  const handleLOBUpdate = (categoryIndex: number, lobIndex: number, updatedLob: LOB) => {
    setCategories(prev => prev.map((category, cIndex) => 
      cIndex === categoryIndex
        ? {
            ...category,
            lobs: category.lobs.map((lob, lIndex) =>
              lIndex === lobIndex ? updatedLob : lob
            )
          }
        : category
    ));
  };

  const handleLOBDelete = (categoryIndex: number, lobToDelete: LOB) => {
    setCategories(prev => prev.map((category, cIndex) => 
      cIndex === categoryIndex
        ? {
            ...category,
            lobs: category.lobs.filter(lob => 
              lob.name !== lobToDelete.name || lob.department !== lobToDelete.department
            )
          }
        : category
    ));
  };

  return (
    <Card className="p-6 relative">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Lines of Business (LOB)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
          {categories.map((category, categoryIndex) => (
            <div key={category.name} className="space-y-3">
              <h3 className="font-medium text-lg border-b pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {category.name}
                  <Info className="h-4 w-4 text-muted-foreground" />
                </span>
                <POCEditDialog
                  categoryName={category.name}
                  description={category.description}
                  onSave={(data) => handleUpdate(categoryIndex, data)}
                />
              </h3>
              <div className="space-y-2">
                {category.lobs.map((lob, lobIndex) => (
                  <LOBCard 
                    key={lob.name}
                    lob={lob}
                    category={category}
                    onUpdate={(updatedLob) => handleLOBUpdate(categoryIndex, lobIndex, updatedLob)}
                    onDelete={(lobToDelete) => handleLOBDelete(categoryIndex, lobToDelete)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4">
          <div className="bg-card/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {dept.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}