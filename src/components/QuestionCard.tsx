
import { useState } from "react";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', question.id);

      if (error) throw error;

      toast({
        title: "Question deleted",
        description: "The question has been successfully deleted.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          title: editedQuestion.title,
          description: editedQuestion.description,
          answer: editedQuestion.answer,
          tags: editedQuestion.tags,
        })
        .eq('id', question.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Question updated",
        description: "Your changes have been saved successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive",
      });
    }
  };

  if (isEditing) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
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

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={editedQuestion.tags.join(", ")}
              onChange={(e) =>
                setEditedQuestion({
                  ...editedQuestion,
                  tags: e.target.value.split(",").map((tag) => tag.trim().toUpperCase()),
                })
              }
              placeholder="Enter tags separated by commas"
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
    <div className="inline-block w-full rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      <div className="flex flex-col gap-2">
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
          <div className="flex gap-2">
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
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {question.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {question.description}
        </p>
        
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="mt-4 rounded-md bg-gray-50 dark:bg-gray-700/50 p-4">
            <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              {question.answer}
            </pre>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
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
