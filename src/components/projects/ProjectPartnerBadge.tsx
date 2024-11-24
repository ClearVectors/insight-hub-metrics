import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Collaborator } from "@/lib/types";

interface ProjectPartnerBadgeProps {
  partner: Collaborator;
  departmentColor?: string;
}

export function ProjectPartnerBadge({ partner, departmentColor }: ProjectPartnerBadgeProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/collaborations/${partner.id}`);
  };

  return (
    <Badge
      onClick={handleClick}
      style={{ backgroundColor: departmentColor || partner.color || '#333' }}
      className="text-white cursor-pointer"
    >
      {partner.name}
    </Badge>
  );
}