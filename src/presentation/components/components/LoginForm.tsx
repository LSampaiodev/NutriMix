import React, { useState } from "react";
import { Button } from "@/presentation/components/components/ui/button";
import { Input } from "@/presentation/components/components/ui/input";
import { Label } from "@/presentation/components/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/presentation/components/components/ui/card";
import { Alert, AlertDescription } from "@/presentation/components/components/ui/alert";
import { Shield, User, Lock } from "lucide-react";
import { login, logAuditEvent } from "@/infrastructure/api/auth";
import { loginSchema, validateData } from "@/core/services/validation";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});
    
    // Validate inputs
    const validation = validateData(loginSchema, { username, password });
    
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        logAuditEvent("login", { username });
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid username or password");
        logAuditEvent("login_failed", { username, reason: "Invalid credentials" });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
      logAuditEvent("login_error", { username, error: String(err) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary mx-auto mb-4">
          <Shield className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Ration Guardian System
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>Demo Credentials:</p>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Operator:</strong> operator / operator123</p>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Protected by Ration Guardian System • {new Date().getFullYear()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
