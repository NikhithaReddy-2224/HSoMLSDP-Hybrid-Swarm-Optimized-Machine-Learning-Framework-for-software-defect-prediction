import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface PredictionRequest {
  features: {
    loc: number;
    cyclomaticComplexity: number;
    coupling: number;
    cohesion: number;
    inheritanceDepth: number;
    halsteadVolume: number;
    fanIn: number;
    fanOut: number;
    defectDensity: number;
  };
  moduleId: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { features, moduleId }: PredictionRequest = await req.json();

    // Validate input
    if (!features || !moduleId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // Use Lovable AI to simulate ML prediction
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a software defect prediction AI trained on hybrid swarm optimized ML models (XGBoost, MLP, Stacking Classifier).
            Analyze software metrics and predict if the module is "Defective" or "Non-Defective".
            Consider all 9 metrics: LOC (Lines of Code), Cyclomatic Complexity, Coupling, Cohesion, Inheritance Depth, Halstead Volume, Fan In, Fan Out, and Defect Density.
            
            Higher LOC, complexity, coupling, inheritance depth, fan out, and defect density increase defect probability.
            Higher cohesion and appropriate fan in decrease defect probability.
            Higher Halstead Volume indicates more complex code, increasing defect probability.
            
            Respond in JSON format:
            {
              "label": "Defective" or "Non-Defective",
              "probability": 0.0 to 1.0,
              "limeFeatures": {
                "loc": importance score,
                "cyclomaticComplexity": importance score,
                "coupling": importance score,
                "cohesion": importance score,
                "inheritanceDepth": importance score,
                "halsteadVolume": importance score,
                "fanIn": importance score,
                "fanOut": importance score,
                "defectDensity": importance score
              }
            }`
          },
          {
            role: "user",
            content: `Predict defect for module ${moduleId} with metrics:
            - LOC: ${features.loc}
            - Cyclomatic Complexity: ${features.cyclomaticComplexity}
            - Coupling: ${features.coupling}
            - Cohesion: ${features.cohesion}
            - Inheritance Depth: ${features.inheritanceDepth}
            - Halstead Volume: ${features.halsteadVolume}
            - Fan In: ${features.fanIn}
            - Fan Out: ${features.fanOut}
            - Defect Density: ${features.defectDensity}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;
    
    // Parse JSON from AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }
    
    const prediction = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({
        moduleId,
        label: prediction.label,
        probability: prediction.probability,
        limeFeatures: prediction.limeFeatures,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    console.error("Prediction error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
});