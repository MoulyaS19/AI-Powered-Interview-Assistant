import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { UserCircle, BarChart3, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-glow">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            AI-Powered Interview Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of technical interviews with AI-driven assessments and instant feedback
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Interviewee Card */}
          <Card className="p-8 hover-scale cursor-pointer group transition-all hover:shadow-xl border-2 hover:border-primary/50">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">I'm a Candidate</h2>
              <p className="text-muted-foreground mb-6">
                Take an AI-powered interview and showcase your skills
              </p>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Upload your resume for personalized questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>6 questions with varying difficulty levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Timed responses with instant AI evaluation</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate("/interviewee")}
                className="w-full"
                size="lg"
              >
                Start Interview
              </Button>
            </div>
          </Card>

          {/* Interviewer Card */}
          <Card className="p-8 hover-scale cursor-pointer group transition-all hover:shadow-xl border-2 hover:border-accent/50">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-3">I'm an Interviewer</h2>
              <p className="text-muted-foreground mb-6">
                Review candidates and access detailed interview analytics
              </p>
              <ul className="text-sm text-left space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>View all candidates sorted by performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>Access complete interview transcripts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">✓</span>
                  <span>AI-generated summaries and scores</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate("/interviewer")}
                className="w-full"
                size="lg"
                variant="secondary"
              >
                View Dashboard
              </Button>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Powered by advanced AI • Real-time evaluation • Comprehensive analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
