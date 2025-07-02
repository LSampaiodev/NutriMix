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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/components/ui/select";

interface LoginFormProps {
  onSuccess?: () => void;
}

const UNITS = [
  { code: "89", name: "Rio Claro - Unidade 1" },
  { code: "90", name: "Rio Claro - Unidade 2" },
  { code: "87", name: "Toledo" },
  { code: "83", name: "Itaberai" },
  { code: "88", name: "Apucarana" },
  { code: "85", name: "Guararapes" },
];

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [unit, setUnit] = useState<string>("");
  const [unitsAllowed, setUnitsAllowed] = useState<string[]>([]);
  const [showUnitSelect, setShowUnitSelect] = useState(false);
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
        // Mock: buscar unidades permitidas do usuário
        // No real, viria do backend
        let allowed: string[] = [];
        if (username === "admin") {
          allowed = ["all", ...UNITS.map(u => u.code)];
        } else if (username === "operator") {
          allowed = ["89"];
        } else {
          allowed = ["89"];
        }
        setUnitsAllowed(allowed);
        setShowUnitSelect(true);
        // Se só tem uma unidade, já seleciona
        if (allowed.length === 1) {
          setUnit(allowed[0]);
          localStorage.setItem("active_unit", allowed[0]);
          logAuditEvent("login", { username, unit: allowed[0] });
          if (onSuccess) {
            onSuccess();
          } else {
            navigate("/dashboard");
          }
        }
        // Se tem permissão global, pode escolher 'todas'
        if (allowed.includes("all")) {
          setUnit("all");
        }
        // Não navega ainda, espera seleção
        return;
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
          Sistema de TaG
        </CardTitle>
        <CardDescription className="text-center">
          Digite suas credenciais para acessar o sistema
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
            <Label htmlFor="username">Nome de Usuário</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Digite seu nome de usuário"
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
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
          
          {/* Seleção de unidade após login */}
          {showUnitSelect && (
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Select
                value={unit}
                onValueChange={(value) => setUnit(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unitsAllowed.includes("all") && (
                    <SelectItem value="all">Todas as Unidades</SelectItem>
                  )}
                  {UNITS.filter(u => unitsAllowed.includes(u.code)).map(u => (
                    <SelectItem key={u.code} value={u.code}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                className="w-full mt-2"
                onClick={() => {
                  if (!unit) return setError("Selecione uma unidade");
                  localStorage.setItem("active_unit", unit);
                  logAuditEvent("login", { username, unit });
                  if (onSuccess) {
                    onSuccess();
                  } else {
                    navigate("/dashboard");
                  }
                }}
                disabled={!unit}
              >
                Entrar na Unidade
              </Button>
            </div>
          )}
          {!showUnitSelect && (
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>Credenciais de Demonstração:</p>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Operador:</strong> operator / operator123</p>
        </div>
        <p className="text-center text-xs text-muted-foreground">
        Protegido pelo Sistema de Guardian de Ração • {new Date().getFullYear()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
