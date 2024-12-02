import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SelectionSection } from "./SelectionSection";
import { OrgPosition } from "./types";
import { useState } from "react";

interface RelationshipSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  position: OrgPosition;
  onSave: (position: OrgPosition) => void;
}

export function RelationshipSelectionDialog({ 
  isOpen, 
  onClose, 
  position,
  onSave 
}: RelationshipSelectionDialogProps) {
  const [tempPosition, setTempPosition] = useState<OrgPosition>(position);

  const handleSave = () => {
    onSave(tempPosition);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {position.title} Relationships</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <SelectionSection
            title="Projects"
            type="projects"
            position={tempPosition}
            onPositionChange={setTempPosition}
          />
          <SelectionSection
            title="Fortune 30 Partners"
            type="fortune30Partners"
            position={tempPosition}
            onPositionChange={setTempPosition}
          />
          <SelectionSection
            title="SME Partners"
            type="smePartners"
            position={tempPosition}
            onPositionChange={setTempPosition}
          />
          <SelectionSection
            title="SPIs"
            type="spis"
            position={tempPosition}
            onPositionChange={setTempPosition}
          />
          <SelectionSection
            title="SitReps"
            type="sitreps"
            position={tempPosition}
            onPositionChange={setTempPosition}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}