import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PredictionResult } from "@/pages/Dashboard";

interface UploadSectionProps {
  setResults: (results: PredictionResult[]) => void;
}

const UploadSection = ({ setResults }: UploadSectionProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Mock processing - simulate ML prediction
    setTimeout(() => {
      const mockResults: PredictionResult[] = [
        { id: "1", label: "Non-Defective", probability: 0.92 },
        { id: "2", label: "Defective", probability: 0.78 },
        { id: "3", label: "Non-Defective", probability: 0.88 },
        { id: "4", label: "Defective", probability: 0.85 },
        { id: "5", label: "Non-Defective", probability: 0.95 },
      ];

      setResults(mockResults);
      setIsProcessing(false);
      toast({
        title: "Processing Complete",
        description: `Analyzed ${mockResults.length} modules from ${file.name}`,
      });
    }, 2000);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-2xl font-semibold mb-4">Upload Dataset</h2>
      <p className="text-muted-foreground mb-6">
        Upload a CSV file containing software metrics (LOC, Cyclomatic Complexity, Coupling, Cohesion, etc.)
      </p>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-primary hover:underline">Choose a file</span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </label>
          {file && (
            <p className="mt-2 text-sm text-foreground">
              Selected: {file.name}
            </p>
          )}
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isProcessing ? "Processing..." : "Analyze Dataset"}
        </Button>
      </div>
    </Card>
  );
};

export default UploadSection;