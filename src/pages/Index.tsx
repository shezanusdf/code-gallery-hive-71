
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { QuestionCard } from "../components/QuestionCard";
import { ThemeToggle } from "../components/ThemeToggle";
import { Plus } from "lucide-react";

// Default questions if localStorage is empty
const defaultQuestions = [
  {
    id: 1,
    title: "How to export MySQL database to CSV?",
    description: "Learn how to export your MySQL database to a CSV file format",
    answer: `There are several ways to export a MySQL database to CSV:

1. Using MySQL Command Line:
SELECT * FROM table_name
INTO OUTFILE 'file_path.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

2. Using mysqldump:
mysqldump -u username -p database_name table_name --tab=/tmp/

3. Using phpMyAdmin:
- Select your table
- Click on "Export"
- Choose "CSV" as the format
- Configure options
- Click "Go"`,
    tags: ["MYSQL", "CSV"],
  },
  {
    id: 2,
    title: "Understanding Stack Operations",
    description: "Basic operations and implementation of a stack data structure",
    answer: `A stack is a Last-In-First-Out (LIFO) data structure. Here are the main operations:

1. Push: Add element to top
stack.push(element)

2. Pop: Remove top element
stack.pop()

3. Peek/Top: View top element
stack.peek()

4. isEmpty: Check if stack is empty
stack.isEmpty()

Common implementations:
- Using arrays
- Using linked lists
- Using dynamic arrays`,
    tags: ["STACK"],
  },
  {
    id: 3,
    title: "Converting Text to Binary",
    description: "How to convert text files to binary format",
    answer: `Here are methods to convert text to binary:

1. Using JavaScript:
const text = "Hello";
const binary = text.split('').map(char => 
  char.charCodeAt(0).toString(2).padStart(8, '0')
).join(' ');

2. Using Python:
text = "Hello"
binary = ' '.join(format(ord(c), '08b') for c in text)

3. Using Unix command:
xxd -b input.txt output.bin`,
    tags: ["BINARY", "TXT"],
  }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [questions, setQuestions] = useState(defaultQuestions);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      localStorage.setItem("questions", JSON.stringify(defaultQuestions));
    }
  }, []);

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}
