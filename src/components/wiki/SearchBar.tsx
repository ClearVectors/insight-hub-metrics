import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search wiki..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-background/60 backdrop-blur-sm"
      />
    </div>
  );
}