import { Card } from "@/components/ui/card";
import { Brain, Target, Zap, Shield, TrendingUp, Users, LogOut, BookOpen, Info, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AnimatedBackground from "@/components/AnimatedBackground";

const About = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">About HSoMLSDP</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-border hover:bg-secondary"
            >
              <Brain className="w-4 h-4 mr-2" />
              Dashboard
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
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4 text-primary">
              Hybrid Swarm Optimized Machine Learning Framework
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              HSoMLSDP is an advanced AI-powered system for Software Defect Prediction that combines
              hybrid swarm optimization algorithms with machine learning models to achieve superior
              prediction accuracy.
            </p>
          </Card>

          {/* Key Features */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Advanced ML Models</h4>
                    <p className="text-sm text-muted-foreground">
                      Utilizes XGBoost, MLP, and Stacking Classifiers for accurate predictions
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Swarm Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic hyperparameter tuning using hybrid swarm algorithms
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Explainable AI</h4>
                    <p className="text-sm text-muted-foreground">
                      LIME integration for feature importance and prediction explanations
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">High Accuracy</h4>
                    <p className="text-sm text-muted-foreground">
                      Trained on industry-standard datasets (CM1, KC1, KC4, PC3, PC5)
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Secure & Reliable</h4>
                    <p className="text-sm text-muted-foreground">
                      Enterprise-grade security with cloud-based infrastructure
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">User-Friendly</h4>
                    <p className="text-sm text-muted-foreground">
                      Intuitive interface for both CSV upload and manual input
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Technology Stack */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Technology Stack</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-32 font-semibold">Frontend:</div>
                <div className="text-muted-foreground">React, TypeScript, Tailwind CSS</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 font-semibold">Backend:</div>
                <div className="text-muted-foreground">Python Flask, scikit-learn, XGBoost, LIME</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 font-semibold">ML Models:</div>
                <div className="text-muted-foreground">XGBoost, MLP, Stacking Classifier</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 font-semibold">Optimization:</div>
                <div className="text-muted-foreground">Hybrid Swarm Algorithms (LFGOABC/GFGOABC)</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 font-semibold">Explainability:</div>
                <div className="text-muted-foreground">LIME (Local Interpretable Model-agnostic Explanations)</div>
              </div>
            </div>
          </Card>

          {/* Metrics */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4">Evaluation Metrics</h3>
            <p className="text-muted-foreground mb-4">
              Our system evaluates model performance using industry-standard metrics:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span><strong>Accuracy:</strong> Overall correctness of predictions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span><strong>Precision:</strong> Accuracy of positive predictions</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span><strong>Recall:</strong> Ability to find all positive instances</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span><strong>F1-Score:</strong> Harmonic mean of precision and recall</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
