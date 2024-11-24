import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Info } from "lucide-react";
import { Collaborator } from "@/lib/types/collaboration";
import { DEPARTMENTS } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type OtherPartnersListProps = {
  collaborators: Collaborator[];
};

export function OtherPartnersList({ collaborators }: OtherPartnersListProps) {
  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-yellow-500';
      case 'action-needed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="w-[400px]">Projects</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborators.map((collaborator) => (
            <TableRow key={collaborator.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{collaborator.name}</TableCell>
              <TableCell>{collaborator.role}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  style={{ 
                    backgroundColor: getDepartmentColor(collaborator.department),
                    color: 'white',
                    borderColor: getDepartmentColor(collaborator.department)
                  }}
                >
                  {DEPARTMENTS.find(d => d.id === collaborator.department)?.name || collaborator.department}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  {collaborator.projects && collaborator.projects.length > 0 ? (
                    collaborator.projects.map((project) => (
                      <div key={project.id} className="flex items-center gap-2">
                        <Badge 
                          className={`${getStatusColor(project.status)} text-white`}
                        >
                          {project.name}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{project.description}</p>
                              <p>Status: {project.status || 'Not specified'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No active projects</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(collaborator.lastActive).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <a 
                  href={`mailto:${collaborator.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}