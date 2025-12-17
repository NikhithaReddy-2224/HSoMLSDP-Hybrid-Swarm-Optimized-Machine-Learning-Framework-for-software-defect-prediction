import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PredictionResult } from "@/pages/Dashboard";
import { CheckCircle2, XCircle } from "lucide-react";
import PerformanceCharts from "./PerformanceCharts";

interface ResultsSectionProps {
  results: PredictionResult[];
}

const ResultsSection = ({ results }: ResultsSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Prediction Results</h2>

      {/* Results Table */}
      <Card className="p-6 bg-card border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">Module ID</th>
              <th className="text-left py-3 px-4">Prediction</th>
              <th className="text-left py-3 px-4">Probability</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-b border-border/50">
                <td className="py-3 px-4">{result.id}</td>
                <td className="py-3 px-4">
                  <Badge
                    variant={result.label === "Defective" ? "destructive" : "default"}
                    className={
                      result.label === "Defective"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                    }
                  >
                    {result.label}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2 max-w-[100px]">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${result.probability * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">
                      {(result.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {result.label === "Defective" ? (
                    <XCircle className="w-5 h-5 text-destructive" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Feature Importance (LIME) */}
      {results[0]?.features && (
        <Card className="p-6 bg-card border-border">
          <h3 className="text-xl font-semibold mb-4">Feature Importance (LIME)</h3>
          <div className="space-y-3">
            {Object.entries(results[0].features).map(([feature, value]) => (
              <div key={feature}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{feature}</span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
                <div className="bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(value / 100) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Performance Charts */}
      <PerformanceCharts results={results} />
    </div>
  );
};

export default ResultsSection;