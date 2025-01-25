import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import LanguageSelector from "@/components/language-selector";
import RegionSelector from "@/components/region-selector";

type FormData = {
  username: string;
  password: string;
  role?: "worker" | "employer";
  preferredLanguage: string;
  whatsappNumber?: string;
  region?: string;
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { login, register, isLoginLoading, isRegisterLoading } = useUser();
  const { toast } = useToast();

  const loginForm = useForm<FormData>({
    defaultValues: { username: "", password: "" }
  });

  const registerForm = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      role: "worker",
      preferredLanguage: "en",
      region: ""
    }
  });

  const selectedLanguage = registerForm.watch("preferredLanguage");

  const onLogin = async (data: FormData) => {
    try {
      await login(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again"
      });
    }
  };

  const onRegister = async (data: FormData) => {
    try {
      await register(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to SahyogJeevan</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    {...loginForm.register("username")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    {...loginForm.register("password")}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoginLoading}>
                  {isLoginLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    {...registerForm.register("username")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    {...registerForm.register("password")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <LanguageSelector
                    value={selectedLanguage}
                    onValueChange={(value) => registerForm.setValue("preferredLanguage", value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                  <Input
                    id="whatsapp"
                    {...registerForm.register("whatsappNumber")}
                    placeholder="+91 "
                  />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <RegionSelector
                    value={registerForm.watch("region")}
                    onValueChange={(value) => registerForm.setValue("region", value)}
                    language={selectedLanguage}
                  />
                </div>
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <RadioGroup
                    defaultValue="worker"
                    onValueChange={(value) => 
                      registerForm.setValue("role", value as "worker" | "employer")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="worker" id="worker" />
                      <Label htmlFor="worker">Worker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employer" id="employer" />
                      <Label htmlFor="employer">Employer</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full" disabled={isRegisterLoading}>
                  {isRegisterLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Register"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}