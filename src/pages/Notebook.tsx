import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Brain, User, Calendar, TrendingUp, LogOut, BookOpen, Info, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";

interface LoginHistory {
  id: string;
  email: string;
  login_time: string;
}

interface Prediction {
  id: string;
  module_id: string;
  prediction_label: string;
  probability: number;
  input_features: any;
  lime_features: any;
  created_at: string;
}

const Notebook = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch login history
      const { data: logins, error: loginError } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('login_time', { ascending: false })
        .limit(10);

      if (loginError) throw loginError;
      setLoginHistory(logins || []);

      // Fetch predictions
      const { data: predictionData, error: predError } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (predError) throw predError;
      setPredictions(predictionData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const defectiveCount = predictions.filter(p => p.prediction_label === "Defective").length;
  const nonDefectiveCount = predictions.filter(p => p.prediction_label === "Non-Defective").length;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Notebook - Activity Log</h1>
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
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Predictions</p>
                <p className="text-2xl font-bold">{predictions.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <Brain className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Defective Modules</p>
                <p className="text-2xl font-bold">{defectiveCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Login Sessions</p>
                <p className="text-2xl font-bold">{loginHistory.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="predictions" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary">
            <TabsTrigger value="predictions">Prediction History</TabsTrigger>
            <TabsTrigger value="logins">Login History</TabsTrigger>
          </TabsList>

          {/* Predictions Tab */}
          <TabsContent value="predictions">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
              
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : predictions.length === 0 ? (
                <p className="text-muted-foreground">No predictions yet. Start analyzing software modules!</p>
              ) : (
                <div className="space-y-4">
                  {predictions.map((pred) => (
                    <Card key={pred.id} className="p-4 border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Module: {pred.module_id}</h3>
                            <Badge
                              variant={pred.prediction_label === "Defective" ? "destructive" : "default"}
                            >
                              {pred.prediction_label === "Defective" ? "❌ Defective" : "✅ Non-Defective"}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Probability: {(pred.probability * 100).toFixed(2)}%
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(pred.created_at)}
                            </p>
                          </div>

                          {pred.input_features && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium mb-2">Input Features:</p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {Object.entries(pred.input_features).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="text-muted-foreground">{key}:</span>{" "}
                                    <span className="font-medium">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Login History Tab */}
          <TabsContent value="logins">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Login History</h2>
              
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : loginHistory.length === 0 ? (
                <p className="text-muted-foreground">No login history available.</p>
              ) : (
                <div className="space-y-3">
                  {loginHistory.map((login) => (
                    <Card key={login.id} className="p-4 border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">{login.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(login.login_time)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Session</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Notebook;
