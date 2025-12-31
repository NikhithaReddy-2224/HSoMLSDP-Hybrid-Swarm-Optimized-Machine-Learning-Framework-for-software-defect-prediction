import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PredictionResult } from "@/pages/Dashboard";
import { supabase } from "@/integrations/client";
import { useAuth } from "@/hooks/useAuth";

interface ManualInputSectionProps {
  setResults: (results: PredictionResult[]) => void;
}

const ManualInputSection = ({ setResults }: ManualInputSectionProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    loc: "",
    cyclomaticComplexity: "",
    coupling: "",
    cohesion: "",
    inheritanceDepth: "",
    halsteadVolume: "",
    fanIn: "",
    fanOut: "",
    defectDensity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("predict-defect", {
        body: {
          features: {
            loc: parseFloat(formData.loc),
            cyclomaticComplexity: parseFloat(formData.cyclomaticComplexity),
            coupling: parseFloat(formData.coupling),
            cohesion: parseFloat(formData.cohesion),
            inheritanceDepth: parseFloat(formData.inheritanceDepth),
            halsteadVolume: parseFloat(formData.halsteadVolume),
            fanIn: parseFloat(formData.fanIn),
            fanOut: parseFloat(formData.fanOut),
            defectDensity: parseFloat(formData.defectDensity),
          },
          moduleId: `manual-${Date.now()}`,
        },
      });

      if (error) throw error;

      const result: PredictionResult = {
        id: data.moduleId,
        label: data.label,
        probability: data.probability,
        features: data.limeFeatures,
      };

      // Save to database
      await supabase.from("predictions").insert({
        user_id: user?.id,
        module_id: result.id,
        prediction_label: result.label,
        probability: result.probability,
        input_features: formData,
        lime_features: data.limeFeatures,
      });

      setResults([result]);
      toast({
        title: "Prediction Complete",
        description: `Module classified as ${result.label} ${result.label === "Defective" ? "❌" : "✅"}`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Unable to process prediction. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-card-peach border-card-peach/30 text-card-peach-foreground">
      <h2 className="text-2xl font-semibold mb-4 text-card-peach-foreground">Manual Input</h2>
      <p className="text-card-peach-foreground/70 mb-6">
        Enter software metrics manually for instant defect prediction
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="loc" className="text-card-peach-foreground">Lines of Code (LOC)</Label>
            <Input
              id="loc"
              type="number"
              placeholder="e.g., 250"
              value={formData.loc}
              onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>

          <div>
            <Label htmlFor="complexity" className="text-card-peach-foreground">Cyclomatic Complexity</Label>
            <Input
              id="complexity"
              type="number"
              placeholder="e.g., 15"
              value={formData.cyclomaticComplexity}
              onChange={(e) =>
                setFormData({ ...formData, cyclomaticComplexity: e.target.value })
              }
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>

          <div>
            <Label htmlFor="coupling" className="text-card-peach-foreground">Coupling</Label>
            <Input
              id="coupling"
              type="number"
              step="0.01"
              placeholder="e.g., 0.45"
              value={formData.coupling}
              onChange={(e) => setFormData({ ...formData, coupling: e.target.value })}
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>

          <div>
            <Label htmlFor="cohesion" className="text-card-peach-foreground">Cohesion</Label>
            <Input
              id="cohesion"
              type="number"
              step="0.01"
              placeholder="e.g., 0.78"
              value={formData.cohesion}
              onChange={(e) => setFormData({ ...formData, cohesion: e.target.value })}
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>

          <div>
            <Label htmlFor="inheritanceDepth" className="text-card-peach-foreground">Inheritance Depth</Label>
            <Input
              id="inheritanceDepth"
              type="number"
              placeholder="e.g., 3"
              value={formData.inheritanceDepth}
              onChange={(e) => setFormData({ ...formData, inheritanceDepth: e.target.value })}
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>

          <div>
            <Label htmlFor="halsteadVolume" className="text-card-peach-foreground">Halstead Volume</Label>
            <Input
              id="halsteadVolume"
              type="number"
              step="0.01"
              placeholder="e.g., 1250.5"
              value={formData.halsteadVolume}
              onChange={(e) => setFormData({ ...formData, halsteadVolume: e.target.value })}
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>

          <div>
            <Label htmlFor="fanIn" className="text-card-peach-foreground">Fan In</Label>
            <Input
              id="fanIn"
              type="number"
              placeholder="e.g., 5"
              value={formData.fanIn}
              onChange={(e) => setFormData({ ...formData, fanIn: e.target.value })}
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>

          <div>
            <Label htmlFor="fanOut" className="text-card-peach-foreground">Fan Out</Label>
            <Input
              id="fanOut"
              type="number"
              placeholder="e.g., 8"
              value={formData.fanOut}
              onChange={(e) => setFormData({ ...formData, fanOut: e.target.value })}
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>

          <div>
            <Label htmlFor="defectDensity" className="text-card-peach-foreground">Defect Density</Label>
            <Input
              id="defectDensity"
              type="number"
              step="0.01"
              placeholder="e.g., 0.05"
              value={formData.defectDensity}
              onChange={(e) => setFormData({ ...formData, defectDensity: e.target.value })}
              required
              className="bg-card-peach-foreground/10 border-card-peach-foreground/30 text-card-peach-foreground placeholder:text-card-peach-foreground/50"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {loading ? "Analyzing..." : "Predict Defect"}
        </Button>
      </form>
    </Card>
  );
};

export default ManualInputSection;
