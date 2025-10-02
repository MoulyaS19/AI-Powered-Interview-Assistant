import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileUploadProps {
  onComplete: (data: {
    name: string;
    email: string;
    phone: string;
    resumeText: string;
  }) => void;
}

export function FileUpload({ onComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<{
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null>(null);
  const [manualData, setManualData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setParsedData(null);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // For simplicity, we'll just use file name as placeholder
    // In production, you'd use a PDF parsing library
    return `Resume content from ${file.name}`;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);

    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(file);

      // Call AI to parse resume
      const { data, error } = await supabase.functions.invoke("parse-resume", {
        body: { resumeText },
      });

      if (error) throw error;

      setParsedData(data);

      // Check if any field is missing
      if (!data.name || !data.email || !data.phone) {
        toast.info("Some information is missing. Please fill in the details.");
      } else {
        // All data present, proceed to interview
        onComplete({
          name: data.name,
          email: data.email,
          phone: data.phone,
          resumeText,
        });
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to parse resume. Please enter your details manually.");
      setParsedData({ name: null, email: null, phone: null });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    const name = parsedData?.name || manualData.name;
    const email = parsedData?.email || manualData.email;
    const phone = parsedData?.phone || manualData.phone;

    if (!name || !email || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    onComplete({
      name,
      email,
      phone,
      resumeText: `Resume content from ${file?.name || "manual entry"}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Upload Your Resume</h2>
        <p className="text-muted-foreground">
          Upload a PDF resume to get started with your AI interview
        </p>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            {file ? (
              <>
                <FileText className="w-12 h-12 text-primary" />
                <p className="font-medium">{file.name}</p>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PDF files only</p>
              </>
            )}
          </div>
        </label>
      </div>

      {file && !parsedData && (
        <Button onClick={handleUpload} disabled={isUploading} className="w-full">
          {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Parse Resume
        </Button>
      )}

      {/* Manual Entry Fields */}
      {parsedData && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={parsedData.name || manualData.name}
              onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
              disabled={!!parsedData.name}
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={parsedData.email || manualData.email}
              onChange={(e) => setManualData({ ...manualData, email: e.target.value })}
              disabled={!!parsedData.email}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              placeholder="+1 234 567 8900"
              value={parsedData.phone || manualData.phone}
              onChange={(e) => setManualData({ ...manualData, phone: e.target.value })}
              disabled={!!parsedData.phone}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Start Interview
          </Button>
        </div>
      )}
    </div>
  );
}