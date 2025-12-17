import { Card } from "@/components/ui/card";
import { PredictionResult } from "@/pages/Dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PerformanceChartsProps {
  results: PredictionResult[];
}

const PerformanceCharts = ({ results }: PerformanceChartsProps) => {
  // Calculate statistics
  const defectiveCount = results.filter((r) => r.label === "Defective").length;
  const nonDefectiveCount = results.filter((r) => r.label === "Non-Defective").length;

  const pieData = [
    { name: "Defective", value: defectiveCount, color: "hsl(var(--destructive))" },
    { name: "Non-Defective", value: nonDefectiveCount, color: "hsl(var(--primary))" },
  ];

  // Mock performance metrics
  const performanceData = [
    { metric: "Accuracy", value: 0.94 },
    { metric: "Precision", value: 0.91 },
    { metric: "Recall", value: 0.89 },
    { metric: "F1-Score", value: 0.90 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Performance Metrics Chart */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-semibold mb-4">Model Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="metric"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
              domain={[0, 1]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="hsl(var(--primary))" name="Score" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Distribution Pie Chart */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-xl font-semibold mb-4">Prediction Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default PerformanceCharts;
