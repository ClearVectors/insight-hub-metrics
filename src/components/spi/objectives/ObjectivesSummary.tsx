import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle2, Clock, Activity } from "lucide-react";

export function ObjectivesSummary() {
  const { data: objectives = [] } = useQuery({
    queryKey: ['objectives'],
    queryFn: () => db.getAllObjectives()
  });

  const stats = [
    {
      title: "Total Objectives",
      value: objectives.length,
      icon: Target,
      color: "text-blue-500"
    },
    {
      title: "Completed",
      value: objectives.filter(obj => obj.desiredOutcome.includes("100%")).length,
      icon: CheckCircle2,
      color: "text-green-500"
    },
    {
      title: "In Progress",
      value: objectives.filter(obj => !obj.desiredOutcome.includes("100%")).length,
      icon: Clock,
      color: "text-orange-500"
    },
    {
      title: "Active Initiatives",
      value: [...new Set(objectives.map(obj => obj.initiative))].length,
      icon: Activity,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}