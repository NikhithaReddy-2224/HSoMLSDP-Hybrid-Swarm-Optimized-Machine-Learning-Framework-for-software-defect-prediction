import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, LogOut, BookOpen, Info, BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UploadSection from "@/components/dashboard/UploadSection";
import ManualInputSection from "@/components/dashboard/ManualInputSection";
import ResultsSection from "@/components/dashboard/ResultsSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PredictionResult {
  id: string;
  label: "Defective" | "Non-Defective";
  probability: number;
  features?: Record<string, number>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [results, setResults] = useState<PredictionResult[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Brain className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">HSoMLSDP Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/notebook")}
              className="border-border hover:bg-secondary"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Notebook
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/analytics")}
              className="border-border hover:bg-secondary"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/about")}
              className="border-border hover:bg-secondary"
            >
              <Info className="w-4 h-4 mr-2" />
              About
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-border hover:bg-secondary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary">
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <UploadSection setResults={setResults} />
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <ManualInputSection setResults={setResults} />
          </TabsContent>
        </Tabs>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="mt-8">
            <ResultsSection results={results} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
