import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PredictionResult } from "@/pages/Dashboard";



// NASA MDP datasets (KC1, CM1, JM1, PC1, KC2) columns
interface CSVRow {
  moduleId: string;
  loc: number;
  vg: number;           // v(g) - McCabe cyclomatic complexity
  evg: number;          // ev(g) - McCabe essential complexity
  ivg: number;          // iv(g) - McCabe design complexity
  n: number;            // Halstead total operators + operands
  v: number;            // Halstead volume
  l: number;            // Halstead program level
  d: number;            // Halstead difficulty
  i: number;            // Halstead intelligence
  e: number;            // Halstead effort
  b: number;            // Halstead estimated bugs
  t: number;            // Halstead time to program
  lOCode: number;       // Halstead lines of code
  lOComment: number;    // Halstead lines of comment
  lOBlank: number;      // Halstead blank lines
  locCodeAndComment: number;
  uniqOp: number;       // Halstead unique operators
  uniqOpnd: number;     // Halstead unique operands
  totalOp: number;      // Halstead total operators
  totalOpnd: number;    // Halstead total operands
  branchCount: number;  // Branch count
  defects: number;      // Target variable (defective: true/1, false/0)
}




// Fast rules-based defect prediction (no AI calls)
const predictDefect = (row: CSVRow): { label: "Defective" | "Non-Defective"; probability: number; limeFeatures: Record<string, number> } => {
  let score = 0;
  const weights: Record<string, number> = {};
  
  // High cyclomatic complexity (>10) strongly indicates defects
  if (row.vg > 10) {
    score += 0.25;
    weights.vg = 0.25;
  } else if (row.vg > 5) {
    score += 0.1;
    weights.vg = 0.1;
  } else {
    weights.vg = -0.05;
  }
  
  // High essential complexity (>4) indicates structural problems
  if (row.evg > 4) {
    score += 0.2;
    weights.evg = 0.2;
  } else {
    weights.evg = -0.05;
  }
  
  // High design complexity
  if (row.ivg > 4) {
    score += 0.1;
    weights.ivg = 0.1;
  } else {
    weights.ivg = -0.03;
  }
  
  // High Halstead difficulty (>20)
  if (row.d > 20) {
    score += 0.15;
    weights.d = 0.15;
  } else if (row.d > 10) {
    score += 0.05;
    weights.d = 0.05;
  } else {
    weights.d = -0.05;
  }
  
  // Halstead estimated bugs (>0.1)
  if (row.b > 0.1) {
    score += 0.2;
    weights.b = 0.2;
  } else if (row.b > 0.05) {
    score += 0.1;
    weights.b = 0.1;
  } else {
    weights.b = -0.05;
  }
  
  // Low program level (<0.1) indicates error-prone code
  if (row.l < 0.1 && row.l > 0) {
    score += 0.1;
    weights.l = 0.1;
  } else {
    weights.l = -0.03;
  }
  
  // High effort (>1000)
  if (row.e > 1000) {
    score += 0.1;
    weights.e = 0.1;
  } else {
    weights.e = -0.03;
  }
  
  // Large LOC (>100)
  if (row.loc > 100) {
    score += 0.1;
    weights.loc = 0.1;
  } else if (row.loc > 50) {
    score += 0.05;
    weights.loc = 0.05;
  } else {
    weights.loc = -0.05;
  }
  
  // High branch count relative to LOC
  const branchRatio = row.loc > 0 ? row.branchCount / row.loc : 0;
  if (branchRatio > 0.1) {
    score += 0.1;
    weights.branchCount = 0.1;
  } else {
    weights.branchCount = -0.03;
  }
  
  // Low comment ratio (poor documentation)
  const commentRatio = row.loc > 0 ? row.lOComment / row.loc : 0;
  if (commentRatio < 0.1) {
    score += 0.05;
    weights.lOComment = 0.05;
  } else {
    weights.lOComment = -0.05;
  }
  
  // Halstead volume
  if (row.v > 1000) {
    score += 0.05;
    weights.v = 0.05;
  } else {
    weights.v = -0.02;
  }
  
  // Normalize probability to 0-1 range
  const probability = Math.min(Math.max(score, 0), 1);
  const label = probability >= 0.5 ? "Defective" : "Non-Defective";
  
  return { label, probability, limeFeatures: weights };
};



const parseCSV = (csvText: string): CSVRow[] => {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
  
  // Map NASA MDP dataset header names (KC1, CM1, JM1, PC1, KC2)
  const headerMap: Record<string, string> = {
    // Module ID variations
    "moduleid": "moduleId",
    "module_id": "moduleId",
    "module": "moduleId",
    "id": "moduleId",
    "name": "moduleId",
    "entityid": "moduleId",
    
    // LOC - Lines of Code
    "loc": "loc",
    "lines_of_code": "loc",
    
    // McCabe Cyclomatic Complexity v(g)
    "v(g)": "vg",
    "vg": "vg",
    "v_g": "vg",
    "cyclomatic_complexity": "vg",
    "cyclomaticcomplexity": "vg",
    "cc": "vg",
    
    // McCabe Essential Complexity ev(g)
    "ev(g)": "evg",
    "evg": "evg",
    "ev_g": "evg",
    "essential_complexity": "evg",
    "essentialcomplexity": "evg",
    
    // McCabe Design Complexity iv(g)
    "iv(g)": "ivg",
    "ivg": "ivg",
    "iv_g": "ivg",
    "design_complexity": "ivg",
    "designcomplexity": "ivg",
    
    // Halstead metrics
    "n": "n",
    "v": "v",
    "l": "l",
    "d": "d",
    "i": "i",
    "e": "e",
    "b": "b",
    "t": "t",
    "halstead_n": "n",
    "halstead_v": "v",
    "halstead_l": "l",
    "halstead_d": "d",
    "halstead_i": "i",
    "halstead_e": "e",
    "halstead_b": "b",
    "halstead_t": "t",
    "volume": "v",
    "length": "n",
    "difficulty": "d",
    "effort": "e",
    "time": "t",
    "bugs": "b",
    
    // Lines metrics
    "locode": "lOCode",
    "lo_code": "lOCode",
    "loc_code": "lOCode",
    "lines_code": "lOCode",
    "linesofcode": "lOCode",
    "locomment": "lOComment",
    "lo_comment": "lOComment",
    "loc_comment": "lOComment",
    "lines_comment": "lOComment",
    "linesofcomment": "lOComment",
    "loblank": "lOBlank",
    "lo_blank": "lOBlank",
    "loc_blank": "lOBlank",
    "blank_lines": "lOBlank",
    "blanklines": "lOBlank",
    "loccodeandcomment": "locCodeAndComment",
    "loc_code_and_comment": "locCodeAndComment",
    "loccodeandc": "locCodeAndComment",
    
    // Operator/operand counts
    "uniq_op": "uniqOp",
    "uniqop": "uniqOp",
    "unique_op": "uniqOp",
    "uniqueop": "uniqOp",
    "unique_operators": "uniqOp",
    "uniqueoperators": "uniqOp",
    "uniq_opnd": "uniqOpnd",
    "uniqopnd": "uniqOpnd",
    "unique_opnd": "uniqOpnd",
    "uniqueopnd": "uniqOpnd",
    "unique_operands": "uniqOpnd",
    "uniqueoperands": "uniqOpnd",
    "total_op": "totalOp",
    "totalop": "totalOp",
    "total_operators": "totalOp",
    "totaloperators": "totalOp",
    "total_opnd": "totalOpnd",
    "totalopnd": "totalOpnd",
    "total_operands": "totalOpnd",
    "totaloperands": "totalOpnd",
    
    // Branch count
    "branchcount": "branchCount",
    "branch_count": "branchCount",
    "branches": "branchCount",
    "branch": "branchCount",
    
    // Defects (target variable) - can be boolean or numeric
    "defects": "defects",
    "defect": "defects",
    "defective": "defects",
    "error_prone": "defects",
    "errorprone": "defects",
    "label": "defects",
    "class": "defects",
    "target": "defects",
    "problems": "defects",
    "c": "defects",  // Some datasets use 'c' for class
  };

  const columnIndices: Record<string, number> = {};
  headers.forEach((header, index) => {
    // Try exact match first
    if (headerMap[header]) {
      columnIndices[headerMap[header]] = index;
      return;
    }
    // Normalize header: remove special chars except parentheses for v(g), ev(g), iv(g)
    const normalizedHeader = header.replace(/[^a-z0-9_()]/g, "");
    if (headerMap[normalizedHeader]) {
      columnIndices[headerMap[normalizedHeader]] = index;
    }
  });

  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map(v => v.trim());
    if (values.length < 2) continue;

    // Parse defects - can be "true", "false", "TRUE", "FALSE", "yes", "no", 1, 0
    let defectsValue = 0;
    const defectsRaw = values[columnIndices["defects"]]?.toLowerCase();
    if (defectsRaw === "true" || defectsRaw === "yes" || defectsRaw === "y" || defectsRaw === "1") {
      defectsValue = 1;
    } else if (defectsRaw === "false" || defectsRaw === "no" || defectsRaw === "n" || defectsRaw === "0") {
      defectsValue = 0;
    } else {
      defectsValue = parseFloat(defectsRaw) || 0;
    }

    const row: CSVRow = {
      moduleId: values[columnIndices["moduleId"]] || `Module_${i}`,
      loc: parseFloat(values[columnIndices["loc"]]) || 0,
      vg: parseFloat(values[columnIndices["vg"]]) || 0,
      evg: parseFloat(values[columnIndices["evg"]]) || 0,
      ivg: parseFloat(values[columnIndices["ivg"]]) || 0,
      n: parseFloat(values[columnIndices["n"]]) || 0,
      v: parseFloat(values[columnIndices["v"]]) || 0,
      l: parseFloat(values[columnIndices["l"]]) || 0,
      d: parseFloat(values[columnIndices["d"]]) || 0,
      i: parseFloat(values[columnIndices["i"]]) || 0,
      e: parseFloat(values[columnIndices["e"]]) || 0,
      b: parseFloat(values[columnIndices["b"]]) || 0,
      t: parseFloat(values[columnIndices["t"]]) || 0,
      lOCode: parseFloat(values[columnIndices["lOCode"]]) || 0,
      lOComment: parseFloat(values[columnIndices["lOComment"]]) || 0,
      lOBlank: parseFloat(values[columnIndices["lOBlank"]]) || 0,
      locCodeAndComment: parseFloat(values[columnIndices["locCodeAndComment"]]) || 0,
      uniqOp: parseFloat(values[columnIndices["uniqOp"]]) || 0,
      uniqOpnd: parseFloat(values[columnIndices["uniqOpnd"]]) || 0,
      totalOp: parseFloat(values[columnIndices["totalOp"]]) || 0,
      totalOpnd: parseFloat(values[columnIndices["totalOpnd"]]) || 0,
      branchCount: parseFloat(values[columnIndices["branchCount"]]) || 0,
      defects: defectsValue,
    };

    rows.push(row);
  }

  return rows;
};




interface UploadSectionProps {
  setResults: (results: PredictionResult[]) => void;
}



const UploadSection = ({ setResults }: UploadSectionProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // setProgress(0);

    try {
      const csvText = await file.text();
      const rows = parseCSV(csvText);

      if (rows.length === 0) {
        throw new Error("No valid data found in CSV file. Please check the format.");
      }

      toast({
        title: "Processing Dataset",
      //   description: `Found ${rows.length} modules. Analyzing with AI model...`,
      // });

      // const results: PredictionResult[] = [];
      // const batchSize = 3; // Smaller batch to avoid rate limiting
      // const delayMs = 2000; // 2 second delay between batches
      
      // for (let i = 0; i < rows.length; i++) {
      //   const row = rows[i];
        
      //   try {
      //     const { data, error } = await supabase.functions.invoke("predict-defect", {
      //       body: {
      //         moduleId: row.moduleId,
      //         features: {
      //           loc: row.loc,
      //           vg: row.vg,
      //           evg: row.evg,
      //           ivg: row.ivg,
      //           n: row.n,
      //           v: row.v,
      //           l: row.l,
      //           d: row.d,
      //           i: row.i,
      //           e: row.e,
      //           b: row.b,
      //           t: row.t,
      //           lOCode: row.lOCode,
      //           lOComment: row.lOComment,
      //           lOBlank: row.lOBlank,
      //           locCodeAndComment: row.locCodeAndComment,
      //           uniqOp: row.uniqOp,
      //           uniqOpnd: row.uniqOpnd,
      //           totalOp: row.totalOp,
      //           totalOpnd: row.totalOpnd,
      //           branchCount: row.branchCount,
      //           defects: row.defects,
      //         },
      //       },
      //     });

      //     if (error) {
      //       console.error(`Error predicting module ${row.moduleId}:`, error);
      //       // Check if it's a rate limit error
      //       if (error.message?.includes("429") || error.message?.includes("Too Many Requests")) {
      //         toast({
      //           title: "Rate Limited",
      //           description: "Waiting before continuing...",
      //         });
      //         await new Promise(resolve => setTimeout(resolve, 5000));
      //         i--; // Retry this row
      //         continue;
      //       }
      //       results.push({
      //         id: row.moduleId,
      //         label: "Error",
      //         probability: 0,
      //       });
      //     } else {
      //       results.push({
      //         id: data.moduleId,
      //         label: data.label,
      //         probability: data.probability,
      //         limeFeatures: data.limeFeatures,
      //       });
      //     }
      //   } catch (err) {
      //     console.error(`Error predicting module ${row.moduleId}:`, err);
      //     results.push({
      //       id: row.moduleId,
      //       label: "Error",
      //       probability: 0,
      //     });
      //   }

      //   setProgress(Math.round(((i + 1) / rows.length) * 100));
        
      //   // Add delay every batch to avoid rate limiting
      //   if ((i + 1) % batchSize === 0 && i < rows.length - 1) {
      //     await new Promise(resolve => setTimeout(resolve, delayMs));
      //   }
      // }





        description: `Found ${rows.length} modules. Analyzing...`,
      });

      // Fast rules-based prediction - processes all rows instantly
      const results: PredictionResult[] = rows.map(row => {
        const prediction = predictDefect(row);
        return {
          id: row.moduleId,
          label: prediction.label,
          probability: prediction.probability,
          limeFeatures: prediction.limeFeatures,
        };
      });




      setResults(results);
      toast({
        title: "Processing Complete",
        description: `Analyzed ${results.length} modules from ${file.name}`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      // setProgress(0);
    }
  };

  return (
    <Card className="p-6 bg-card-peach border-card-peach/30 text-card-peach-foreground">
      <h2 className="text-2xl font-semibold mb-4 text-card-peach-foreground">Upload Dataset</h2>
      <p className="text-card-peach-foreground/70 mb-6">
        Upload NASA MDP datasets (KC1, CM1, JM1, PC1, KC2) with software metrics for defect prediction
      </p>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-card-peach-foreground/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <Upload className="w-12 h-12 mx-auto mb-4 text-card-peach-foreground/60" />
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-primary hover:underline">Choose a file</span>
            <span className="text-card-peach-foreground/70"> or drag and drop</span>
          </label>
          {file && (
            <p className="mt-2 text-sm text-card-peach-foreground">
              Selected: {file.name}
            </p>
          )}
        </div>

        

        <Button
          onClick={handleUpload}
          disabled={!file || isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {/* {isProcessing ? `Processing... ${progress}%` : "Analyze Dataset"} */}


          {isProcessing ? "Processing..." : "Analyze Dataset"}

          
        </Button>
      </div>
    </Card>
  );
};

export default UploadSection;
