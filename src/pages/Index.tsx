
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { QuestionCard } from "../components/QuestionCard";
import { ThemeToggle } from "../components/ThemeToggle";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface Question {
  id: number;
  created_at: string;
  title: string;
  description: string;
  answer: string;
  tags: string[];
}

async function fetchQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
  
  return data || [];
}

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Migrate localStorage data if it exists
  useEffect(() => {
    const migrateLocalStorage = async () => {
      const localQuestions = localStorage.getItem('questions');
      if (localQuestions) {
        try {
          const questions = JSON.parse(localQuestions);
          for (const question of questions) {
            const { error } = await supabase
              .from('questions')
              .insert({
                title: question.title,
                description: question.description,
                answer: question.answer,
                tags: question.tags || []
              });
            
            if (error) throw error;
          }
          
          // Clear localStorage after successful migration
          localStorage.removeItem('questions');
          
          toast({
            title: "Data Migration Complete",
            description: "Your previously entered questions have been recovered.",
          });
        } catch (error) {
          console.error('Migration error:', error);
          toast({
            title: "Migration Error",
            description: "There was an error recovering your questions.",
            variant: "destructive",
          });
        }
      }
    };

    migrateLocalStorage();
  }, [toast]);
  
  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  });

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">Error loading questions</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8 transition-colors dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle />
      
      <div className="mx-auto max-w-8xl">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            Coding Q&A Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common coding questions
          </p>
          <div className="flex w-full max-w-xl items-center gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <Link
              to="/add"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-2 text-sm text-white transition-all duration-300 hover:opacity-90 dark:from-gray-100 dark:to-gray-300 dark:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}
