import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { DEPARTMENTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function DepartmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const department = DEPARTMENTS.find(d => d.id === id);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      await db.init();
      const allProjects = await db.getAllProjects();
      return allProjects.filter(p => p.departmentId === id);
    }
  });

  const handleViewCollaborators = () => {
    navigate(`/collaborations/department/${id}`);
  };

  const getDepartmentColor = (departmentId: string) => {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    return department?.color || '#333';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!department) {
    return <div className="container mx-auto px-4 py-8">Department not found</div>;
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">
          {department.name}
        </h1>
        <div className="mt-4 flex gap-4">
          <Card className="p-4 flex-1 bg-card text-card-foreground">
            <div className="text-sm text-muted-foreground">Total Budget</div>
            <div className="text-2xl font-bold">${(department.budget / 1000000).toFixed(1)}M</div>
          </Card>
          <Card className="p-4 flex-1 bg-card text-card-foreground">
            <div className="text-sm text-muted-foreground">Projects</div>
            <div className="text-2xl font-bold">{department.projectCount}</div>
          </Card>
          <Card className="p-4 flex-1 bg-card text-card-foreground">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleViewCollaborators}
            >
              <Users className="h-4 w-4 mr-2" />
              View Internal Partners
            </Button>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Projects</h2>
        {projects?.map((project) => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`}
            className="block transition-transform hover:scale-[1.01] duration-200"
          >
            <Card className="p-6 bg-card text-card-foreground">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    POC:{" "}
                    <Badge
                      style={{ 
                        backgroundColor: getDepartmentColor(project.pocDepartment),
                        color: 'white',
                        borderColor: getDepartmentColor(project.pocDepartment)
                      }}
                    >
                      {project.poc}
                    </Badge>
                  </p>
                </div>
                <Badge 
                  className={`${getStatusColor(project.status)} text-white`}
                >
                  {project.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Usage:</span>
                  <span>{Math.round((project.spent / project.budget) * 100)}%</span>
                </div>
                <Progress value={(project.spent / project.budget) * 100} className="h-2" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}