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
import { useTranslation } from "react-i18next";

type FormData = {
  username: string;
  password: string;
  role?: "worker" | "employer";
  preferredLanguage?: string;
  region?: string;
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [userRole, setUserRole] = useState<"worker" | "employer">("worker");
  const { login, register, isLoginLoading, isRegisterLoading } = useUser();
  const { toast } = useToast();
  const { t } = useTranslation();

  const loginForm = useForm<FormData>();
  const registerForm = useForm<FormData>({
    defaultValues: {
      role: "worker",
      preferredLanguage: "en",
    }
  });

  const selectedLanguage = registerForm.watch("preferredLanguage");

  const onLogin = async (data: FormData) => {
    try {
      await login(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('common.loginFailed'),
        description: error instanceof Error ? error.message : t('common.tryAgain')
      });
    }
  };

  const onRegister = async (data: FormData) => {
    try {
      await register(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('common.registrationFailed'),
        description: error instanceof Error ? error.message : t('common.tryAgain')
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t('common.welcome')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('common.login')}</TabsTrigger>
              <TabsTrigger value="register">{t('common.register')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('common.iAmA')}</Label>
                  <RadioGroup
                    defaultValue="worker"
                    onValueChange={(value) => setUserRole(value as "worker" | "employer")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="worker" id="login-worker" />
                      <Label htmlFor="login-worker">{t('common.worker')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employer" id="login-employer" />
                      <Label htmlFor="login-employer">{t('common.employer')}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-username">{t('common.username')}</Label>
                  <Input
                    id="login-username"
                    {...loginForm.register("username")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('common.password')}</Label>
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
                    t('common.login')
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('common.iAmA')}</Label>
                  <RadioGroup
                    defaultValue="worker"
                    onValueChange={(value) =>
                      registerForm.setValue("role", value as "worker" | "employer")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="worker" id="register-worker" />
                      <Label htmlFor="register-worker">{t('common.worker')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="employer" id="register-employer" />
                      <Label htmlFor="register-employer">{t('common.employer')}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-username">{t('common.username')}</Label>
                  <Input
                    id="register-username"
                    {...registerForm.register("username")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">{t('common.password')}</Label>
                  <Input
                    id="register-password"
                    type="password"
                    {...registerForm.register("password")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('common.preferredLanguage')}</Label>
                  <LanguageSelector
                    value={selectedLanguage || "en"}
                    onValueChange={(value) => registerForm.setValue("preferredLanguage", value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('common.region')}</Label>
                  <RegionSelector
                    value={registerForm.watch("region") || ""}
                    onValueChange={(value) => registerForm.setValue("region", value)}
                    language={selectedLanguage || "en"}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isRegisterLoading}>
                  {isRegisterLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('common.register')
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