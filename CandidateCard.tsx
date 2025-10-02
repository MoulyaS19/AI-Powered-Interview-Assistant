import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Trophy } from "lucide-react";

interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    email: string;
    phone: string;
    score: number | null;
    created_at: string;
  };
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const getScoreColor = (score: number | null) => {
    if (!score) return "bg-muted";
    if (score >= 80) return "bg-success/10 text-success border-success/20";
    if (score >= 60) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <Card
      className="p-6 cursor-pointer hover-scale transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(candidate.created_at).toLocaleDateString()}
          </p>
        </div>
        {candidate.score !== null ? (
          <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${getScoreColor(candidate.score)}`}>
            <span className="font-bold text-lg">{candidate.score}</span>
          </div>
        ) : (
          <Badge variant="outline">Pending</Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{candidate.phone}</span>
        </div>
      </div>

      {candidate.score !== null && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-muted-foreground">Interview completed</span>
          </div>
        </div>
      )}
    </Card>
  );
}