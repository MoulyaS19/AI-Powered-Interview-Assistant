import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function IntervieweePage() {
  const [step, setStep] = useState<"upload" | "interview" | "complete">("upload");
  const [candidateData, setCandidateData] = useState<{
    name: string;
    email: string;
    phone: string;
    resumeText: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-glow">
            <Bot className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            AI Interview Assistant
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your resume and let AI interview you
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="p-8 shadow-lg border-2">
          {step === "upload" && (
            <FileUpload
              onComplete={(data) => {
                setCandidateData(data);
                setStep("interview");
              }}
            />
          )}

          {step === "interview" && candidateData && (
            <ChatInterface
              candidateData={candidateData}
              onComplete={() => setStep("complete")}
            />
          )}

          {step === "complete" && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <div className="text-4xl">✓</div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your time. Your responses have been recorded and will be reviewed by our team.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Start New Interview
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}