import { Card } from "@/components/ui/card";
import { Brain, LogOut, BookOpen, Info, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AnimatedBackground from "@/components/AnimatedBackground";

const Analytics = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  // Mock performance data across datasets
  const datasetPerformance = [
    { dataset: 'CM1', accuracy: 92.5, precision: 90.3, recall: 88.7, f1Score: 89.5 },
    { dataset: 'KC1', accuracy: 94.2, precision: 93.1, recall: 91.8, f1Score: 92.4 },
    { dataset: 'KC4', accuracy: 91.8, precision: 89.6, recall: 90.2, f1Score: 89.9 },
    { dataset: 'PC3', accuracy: 93.6, precision: 92.4, recall: 91.1, f1Score: 91.7 },
    { dataset: 'PC5', accuracy: 95.1, precision: 94.3, recall: 93.8, f1Score: 94.0 },
  ];

  // Model comparison data
  const modelComparison = [
    { model: 'XGBoost', accuracy: 93.2 },
    { model: 'MLP', accuracy: 91.5 },
    { model: 'Stacking', accuracy: 95.8 },
  ];

  // Confusion matrix data (example for latest prediction)
  const confusionData = [
    { name: 'True Positive', value: 450, color: '#22c55e' },
    { name: 'True Negative', value: 380, color: '#3b82f6' },
    { name: 'False Positive', value: 35, color: '#f59e0b' },
    { name: 'False Negative', value: 42, color: '#ef4444' },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Analytics & Performance</h1>
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
      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Dataset Performance */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Across Datasets</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={datasetPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dataset" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="hsl(var(--chart-1))" name="Accuracy (%)" />
              <Bar dataKey="precision" fill="hsl(var(--chart-2))" name="Precision (%)" />
              <Bar dataKey="recall" fill="hsl(var(--chart-3))" name="Recall (%)" />
              <Bar dataKey="f1Score" fill="hsl(var(--chart-4))" name="F1-Score (%)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Model Comparison */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Model Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[85, 100]} />
              <YAxis dataKey="model" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" fill="hsl(var(--primary))" name="Accuracy (%)" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            The Stacking Classifier combines Random Forest, XGBoost, and Decision Tree for superior performance.
          </p>
        </Card>

        {/* Confusion Matrix */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Confusion Matrix Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={confusionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {confusionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Confusion Matrix Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">True Positive</p>
                  <p className="text-2xl font-bold text-green-800">450</p>
                </div>
                <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">True Negative</p>
                  <p className="text-2xl font-bold text-blue-800">380</p>
                </div>
                <div className="p-4 bg-orange-50 border-2 border-orange-500 rounded-lg">
                  <p className="text-sm text-orange-700 font-medium">False Positive</p>
                  <p className="text-2xl font-bold text-orange-800">35</p>
                </div>
                <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">False Negative</p>
                  <p className="text-2xl font-bold text-red-800">42</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Total Predictions:</strong> 907
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Accuracy:</strong> 91.51%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Insights */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
          <div className="space-y-3 text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-primary">•</span>
              The Stacking Classifier achieves the highest accuracy at 95.8%, demonstrating the power of ensemble learning.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Dataset PC5 shows the best overall performance with 95.1% accuracy across all metrics.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">•</span>
              The hybrid swarm optimization (LFGOABC/GFGOABC) effectively tunes hyperparameters, leading to consistent performance improvements.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Low false positive and false negative rates (3.9% and 4.6% respectively) indicate robust defect detection.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
