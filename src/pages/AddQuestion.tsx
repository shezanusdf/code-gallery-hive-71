
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tags = ["MYSQL", "STACK", "BINARY", "CSV", "TXT"];

export default function AddQuestion() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send this to a backend
    const newQuestion = {
      id: Date.now(), // temporary ID generation
      title,
      description,
      answer,
      tags: selectedTags,
    };
    
    // For now, we'll just store in localStorage
    const existingQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
    localStorage.setItem("questions", JSON.stringify([...existingQuestions, newQuestion]));
    
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Add New Question</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded-md border bg-card text-card-foreground"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded-md border bg-card text-card-foreground"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Answer</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 rounded-md border bg-card text-card-foreground"
              rows={6}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Add Question
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
