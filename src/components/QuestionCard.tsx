
import { useState } from "react";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const { toast } = useToast();

  const handleDelete = () => {
    const questions = JSON.parse(localStorage.getItem("questions") || "[]");
    const updatedQuestions = questions.filter((q: any) => q.id !== question.id);
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    toast({
      title: "Question deleted",
      description: "The question has been successfully deleted.",
    });
    // Force a reload to update the list
    window.location.reload();
  };

  const handleSave = () => {
    const questions = JSON.parse(localStorage.getItem("questions") || "[]");
    const updatedQuestions = questions.map((q: any) =>
      q.id === question.id ? editedQuestion : q
    );
    localStorage.setItem("questions", JSON.stringify(updatedQuestions));
    setIsEditing(false);
    toast({
      title: "Question updated",
      description: "Your changes have been saved successfully.",
    });
  };

  if (isEditing) {
    return (
      <div className="card mb-4 break-inside-avoid animate-fade-in">
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedQuestion.title}
              onChange={(e) =>
                setEditedQuestion({ ...editedQuestion, title: e.target.value })
              }
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editedQuestion.description}
              onChange={(e) =>
                setEditedQuestion({
                  ...editedQuestion,
                  description: e.target.value,
                })
              }
            />
          </div>
          
          <div>
            <Label htmlFor="answer">Answer</Label>
            <textarea
              id="answer"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={editedQuestion.answer}
              onChange={(e) =>
                setEditedQuestion({ ...editedQuestion, answer: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditedQuestion(question);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4 break-inside-avoid animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h3 className="text-lg font-semibold">{question.title}</h3>
        <p className="text-sm text-muted-foreground">{question.description}</p>
        
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mt-4 rounded-md bg-accent p-4">
            <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm">
              {question.answer}
            </pre>
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
