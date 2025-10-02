import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Timer } from "@/components/Timer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bot, User, Send, Loader2 } from "lucide-react";

interface ChatInterfaceProps {
  candidateData: {
    name: string;
    email: string;
    phone: string;
    resumeText: string;
  };
  onComplete: () => void;
}

interface Message {
  role: "ai" | "user";
  content: string;
}

interface Question {
  question: string;
  difficulty: "easy" | "medium" | "hard";
}

const TIMER_DURATIONS = {
  easy: 20,
  medium: 60,
  hard: 120,
};

export function ChatInterface({ candidateData, onComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: `Welcome ${candidateData.name}! Let's begin your interview. I'll ask you 6 questions. Ready?` },
  ]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [candidateId, setCandidateId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeInterview();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeInterview = async () => {
    setIsLoading(true);
    try {
      // Create candidate record
      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .insert({
          name: candidateData.name,
          email: candidateData.email,
          phone: candidateData.phone,
        })
        .select()
        .single();

      if (candidateError) throw candidateError;
      setCandidateId(candidate.id);

      // Generate questions
      const { data: questionsData, error: questionsError } = await supabase.functions.invoke(
        "generate-questions",
        {
          body: {
            candidateName: candidateData.name,
            resumeText: candidateData.resumeText,
          },
        }
      );

      if (questionsError) throw questionsError;
      setQuestions(questionsData.questions);

      // Show first question
      setTimeout(() => {
        askNextQuestion(questionsData.questions, 0);
      }, 1500);
    } catch (error) {
      console.error("Error initializing interview:", error);
      toast.error("Failed to start interview");
    } finally {
      setIsLoading(false);
    }
  };

  const askNextQuestion = (qs: Question[], index: number) => {
    if (index >= qs.length) {
      completeInterview();
      return;
    }

    const question = qs[index];
    setMessages((prev) => [
      ...prev,
      { role: "ai", content: `Question ${index + 1}/6 (${question.difficulty}): ${question.question}` },
    ]);
    setCurrentQuestionIndex(index);
    setTimeLeft(TIMER_DURATIONS[question.difficulty]);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    const question = questions[currentQuestionIndex];
    setMessages((prev) => [...prev, { role: "user", content: currentAnswer }]);
    setIsLoading(true);

    try {
      // Evaluate response
      const { data: evaluation, error } = await supabase.functions.invoke("evaluate-response", {
        body: {
          question: question.question,
          answer: currentAnswer,
          difficulty: question.difficulty,
        },
      });

      if (error) throw error;

      // Store response
      await supabase.from("interview_responses").insert({
        candidate_id: candidateId,
        question: question.question,
        answer: currentAnswer,
        difficulty: question.difficulty,
        time_taken: TIMER_DURATIONS[question.difficulty] - timeLeft,
      });

      setResponses((prev) => [
        ...prev,
        {
          question: question.question,
          answer: currentAnswer,
          difficulty: question.difficulty,
          score: evaluation.score,
          feedback: evaluation.feedback,
        },
      ]);

      setMessages((prev) => [...prev, { role: "ai", content: evaluation.feedback }]);
      setCurrentAnswer("");
      setTimeLeft(0);

      // Ask next question
      setTimeout(() => {
        askNextQuestion(questions, currentQuestionIndex + 1);
      }, 1500);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUp = () => {
    if (currentAnswer.trim()) {
      handleSubmitAnswer();
    } else {
      toast.warning("Time's up! Moving to next question.");
      setMessages((prev) => [...prev, { role: "user", content: "(No answer provided)" }]);
      setTimeout(() => {
        askNextQuestion(questions, currentQuestionIndex + 1);
      }, 1000);
    }
  };

  const completeInterview = async () => {
    setIsLoading(true);
    try {
      // Generate summary
      const { data: summary, error } = await supabase.functions.invoke("generate-summary", {
        body: {
          candidateName: candidateData.name,
          responses,
        },
      });

      if (error) throw error;

      // Update candidate record
      await supabase
        .from("candidates")
        .update({
          score: summary.score,
          summary: summary.summary,
        })
        .eq("id", candidateId);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `Thank you for completing the interview! Your score: ${summary.score}/100\n\n${summary.summary}`,
        },
      ]);

      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (error) {
      console.error("Error completing interview:", error);
      toast.error("Failed to complete interview");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""} animate-fade-in`}
          >
            {message.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] ${
                message.role === "ai"
                  ? "bg-card border"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.content}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-accent" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Timer */}
      {timeLeft > 0 && (
        <Timer
          timeLeft={timeLeft}
          totalTime={TIMER_DURATIONS[questions[currentQuestionIndex]?.difficulty || "easy"]}
          onTimeUp={handleTimeUp}
        />
      )}

      {/* Answer Input */}
      {currentQuestionIndex >= 0 && currentQuestionIndex < questions.length && (
        <div className="space-y-2">
          <Textarea
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isLoading || timeLeft === 0}
          />
          <Button
            onClick={handleSubmitAnswer}
            disabled={isLoading || !currentAnswer.trim() || timeLeft === 0}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Submit Answer
          </Button>
        </div>
      )}
    </div>
  );
}