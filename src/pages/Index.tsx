
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { QuestionCard } from "../components/QuestionCard";
import { ThemeToggle } from "../components/ThemeToggle";

// Sample data - in a real app this would come from an API
const questions = [
  {
    id: 1,
    title: "How to center a div?",
    description: "Learn the different ways to center content in CSS",
    answer: `There are several ways to center a div:

1. Using Flexbox:
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

2. Using Grid:
.parent {
  display: grid;
  place-items: center;
}

3. Using position absolute:
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
    tags: ["CSS", "Layout", "Flexbox"],
  },
  {
    id: 2,
    title: "What is the difference between let and const?",
    description: "Understanding variable declarations in JavaScript",
    answer: `let allows you to declare variables that can be reassigned, while const declares variables that cannot be reassigned after initialization.

Example:
let x = 1;
x = 2; // This works

const y = 1;
y = 2; // This throws an error`,
    tags: ["JavaScript", "ES6", "Variables"],
  },
  {
    id: 3,
    title: "How to handle async operations in React?",
    description: "Best practices for managing asynchronous operations",
    answer: `There are several ways to handle async operations in React:

1. Using async/await:
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    setState(data);
  } catch (error) {
    console.error(error);
  }
}

2. Using useEffect:
useEffect(() => {
  fetchData();
}, []);

3. Using Promise.then():
fetch(url)
  .then(response => response.json())
  .then(data => setState(data))
  .catch(error => console.error(error));`,
    tags: ["React", "Async", "Hooks"],
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background px-4 py-8 transition-colors">
      <ThemeToggle />
      
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold">Coding Q&A Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common coding questions
          </p>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="masonry-grid">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}
