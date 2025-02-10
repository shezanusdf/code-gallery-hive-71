
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    description: string;
    answer: string;
    tags: string[];
  };
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card mb-4 break-inside-avoid animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent px-2 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold">{question.title}</h3>
        <p className="text-sm text-muted-foreground">{question.description}</p>
        
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mt-4 rounded-md bg-accent p-4">
            <pre className="whitespace-pre-wrap text-sm">{question.answer}</pre>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {isExpanded ? "Hide" : "Show"} answer
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
