
import { useState } from "react";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";
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
      <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
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
    <div className={`group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 dark:bg-gray-800 animate-fade-in
      ${isExpanded ? "fixed inset-4 z-50 overflow-y-auto" : "p-6 hover:shadow-xl"}`}
    >
      <div className={`flex flex-col gap-2 ${isExpanded ? "h-full p-6" : ""}`}>
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isExpanded ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="h-8 w-8 bg-gray-100 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900/50 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${isExpanded ? "text-2xl" : "text-lg"}`}>
          {question.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {question.description}
        </p>
        
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "block" : "max-h-0"
          }`}
        >
          <div className="mt-4 rounded-md bg-gray-50 dark:bg-gray-700/50 p-4">
            <pre className="max-h-[calc(100vh-12rem)] overflow-y-auto whitespace-pre-wrap text-base leading-relaxed text-gray-700 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              {question.answer}
            </pre>
          </div>
        </div>

        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            Show answer
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
