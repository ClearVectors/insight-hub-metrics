import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/types";
import { DEPARTMENTS } from "@/lib/constants";
import { toast } from "@/components/ui/use-toast";
import { memo, useEffect, useState } from "react";

interface ProjectHeaderProps {
  project: Project;
  isEditing: boolean;
  onUpdate: (updates: Partial<Project>) => void;
}

export const ProjectHeader = memo(({ project, isEditing, onUpdate }: ProjectHeaderProps) => {
  const [statusColors, setStatusColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedColors = localStorage.getItem('projectStatusColors');
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      // Convert array format to object format
      const colorMap = colors.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.id] = curr.color;
        return acc;
      }, {});
      console.log('Loaded status colors:', colorMap);
      setStatusColors(colorMap);
    }
  }, []);

  const getDepartmentColor = (id: string) => {
    return DEPARTMENTS.find(d => d.id === id)?.color;
  };

  const handlePOCChange = (value: string) => {
    if (value === project.techLead) {
      toast({
        title: "Invalid Assignment",
        description: "The same person cannot be both POC and Tech Lead.",
        variant: "destructive",
      });
      return;
    }
    onUpdate({ poc: value });
  };

  const handleTechLeadChange = (value: string) => {
    if (value === project.poc) {
      toast({
        title: "Invalid Assignment",
        description: "The same person cannot be both POC and Tech Lead.",
        variant: "destructive",
      });
      return;
    }
    onUpdate({ techLead: value });
  };

  const getStatusColor = (status: string) => {
    console.log('Current status:', status);
    console.log('Current statusColors:', statusColors);
    const color = statusColors[status];
    if (color) {
      return { backgroundColor: color, color: 'white' };
    }
    // Provide default colors if none are set
    const defaultColors: Record<string, string> = {
      active: '#10B981',
      completed: '#3B82F6',
      delayed: '#F59E0B',
      'action-needed': '#991B1B'
    };
    return { backgroundColor: defaultColors[status] || '#666666', color: 'white' };
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="mt-2 space-y-1 text-muted-foreground">
            <p className="flex items-center gap-2">
              POC:{" "}
              <Badge
                style={{ backgroundColor: getDepartmentColor(project.pocDepartment) }}
                className="text-white"
              >
                {project.poc}
              </Badge>
            </p>
            <p className="flex items-center gap-2">
              Tech Lead:{" "}
              <Badge
                style={{ backgroundColor: getDepartmentColor(project.techLeadDepartment) }}
                className="text-white"
              >
                {project.techLead}
              </Badge>
            </p>
          </div>
        </div>
        <Badge 
          style={getStatusColor(project.status)}
          variant={
            project.status === 'completed' ? 'secondary' :
            project.status === 'delayed' ? 'destructive' :
            project.status === 'action-needed' ? 'destructive' :
            'default'
          }
        >
          {project.status}
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={project.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="text-3xl font-bold w-full bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary"
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <input
            type="text"
            value={project.poc}
            onChange={(e) => handlePOCChange(e.target.value)}
            className="bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary w-full"
            placeholder="POC"
          />
          <select
            value={project.pocDepartment}
            onChange={(e) => onUpdate({ pocDepartment: e.target.value })}
            className="bg-transparent border rounded p-1 w-full"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={project.techLead}
            onChange={(e) => handleTechLeadChange(e.target.value)}
            className="bg-transparent border-b border-gray-200 focus:outline-none focus:border-primary w-full"
            placeholder="Tech Lead"
          />
          <select
            value={project.techLeadDepartment}
            onChange={(e) => onUpdate({ techLeadDepartment: e.target.value })}
            className="bg-transparent border rounded p-1 w-full"
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <select
        value={project.status}
        onChange={(e) => onUpdate({ status: e.target.value as Project['status'] })}
        className="bg-transparent border rounded p-1"
      >
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="delayed">Delayed</option>
        <option value="action-needed">Action Needed</option>
      </select>
    </div>
  );
});

ProjectHeader.displayName = 'ProjectHeader';