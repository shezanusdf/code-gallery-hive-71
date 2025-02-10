
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar flex items-center gap-2">
      <Search className="h-4 w-4 text-foreground/60" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search coding questions..."
        className="w-full bg-transparent outline-none placeholder:text-foreground/60"
      />
    </div>
  );
}
