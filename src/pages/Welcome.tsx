import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Brain, BarChart3, Upload, FileText } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="container relative mx-auto px-4 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                HSoMLSDP
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Hybrid Swarm Optimized Machine Learning Framework for Software Defect Prediction
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Predict software defects with cutting-edge machine learning models optimized through hybrid swarm algorithms
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/signin")}
                className="border-primary/50 hover:bg-primary/10"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <Brain className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">ML Models</h3>
            <p className="text-muted-foreground">
              XGBoost, MLP, and Stacking Classifier for accurate predictions
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <BarChart3 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
            <p className="text-muted-foreground">
              Accuracy, Precision, Recall, F1-score with visual analytics
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <Upload className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">CSV Upload</h3>
            <p className="text-muted-foreground">
              Batch prediction with dataset upload and analysis
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <FileText className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Manual Input</h3>
            <p className="text-muted-foreground">
              Enter software metrics for instant defect prediction
            </p>
          </Card>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="p-8 bg-gradient-to-br from-card to-secondary border-border">
          <h2 className="text-3xl font-bold mb-6 text-center">Core Technology</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Optimization</h3>
              <p className="text-muted-foreground">Hybrid Swarm Algorithms (LFGOABC, GFGOABC)</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Explainability</h3>
              <p className="text-muted-foreground">LIME for interpretable AI predictions</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">Datasets</h3>
              <p className="text-muted-foreground">CM1, KC1, KC4, PC3, PC5 support</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
