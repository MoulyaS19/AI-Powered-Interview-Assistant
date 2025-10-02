import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { X, Mail, Phone, Trophy, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface CandidateProfileProps {
  candidate: {
    id: string;
    name: string;
    email: string;
    phone: string;
    score: number | null;
    summary: string | null;
    created_at: string;
  };
  onClose: () => void;
}

interface Response {
  id: string;
  question: string;
  answer: string;
  difficulty: string;
  time_taken: number;
  created_at: string;
}

export function CandidateProfile({ candidate, onClose }: CandidateProfileProps) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, [candidate.id]);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from("interview_responses")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("created_at");

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error("Error fetching responses:", error);
      toast.error("Failed to load interview responses");
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "hard":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{candidate.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {candidate.phone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {candidate.score !== null && (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-1">
                    <span className="font-bold text-xl text-white">{candidate.score}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary */}
          {candidate.summary && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-accent" />
                <h3 className="font-semibold">Summary</h3>
              </div>
              <Card className="p-4 bg-muted/30">
                <p className="text-sm leading-relaxed">{candidate.summary}</p>
              </Card>
            </div>
          )}

          {/* Interview Responses */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Interview Responses</h3>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : responses.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No responses yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {responses.map((response, index) => (
                  <Card key={response.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Question {index + 1}</span>
                        <Badge variant="outline" className={getDifficultyColor(response.difficulty)}>
                          {response.difficulty}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Time: {response.time_taken}s
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1 text-muted-foreground">Question:</p>
                        <p className="text-sm">{response.question}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1 text-muted-foreground">Answer:</p>
                        <p className="text-sm">{response.answer}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}