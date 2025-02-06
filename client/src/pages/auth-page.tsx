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
import { Loader2, Briefcase, User2, Lock, Globe2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSelector from "@/components/language-selector";
import RegionSelector from "@/components/region-selector";

type FormData = {
  username: string;
  password: string;
  role?: "worker" | "employer";
  preferredLanguage?: string;
  region?: string;
};

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [userRole, setUserRole] = useState<"worker" | "employer">("worker");
  const { login, register, isLoginLoading, isRegisterLoading } = useUser();
  const { toast } = useToast();

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
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Try again'
      });
    }
  };

  const onRegister = async (data: FormData) => {
    try {
      await register(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Try again'
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-background/95 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="backdrop-blur-sm border-primary/10 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Briefcase className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to Sahyog Jeevan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="relative"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-300"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="login" asChild>
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label>I am a</Label>
                        <RadioGroup
                          defaultValue="worker"
                          onValueChange={(value) => setUserRole(value as "worker" | "employer")}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <RadioGroupItem value="worker" id="login-worker" />
                            <Label 
                              htmlFor="login-worker"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <User2 className="h-4 w-4" />
                              Worker
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 flex-1">
                            <RadioGroupItem value="employer" id="login-employer" />
                            <Label 
                              htmlFor="login-employer"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Briefcase className="h-4 w-4" />
                              Employer
                            </Label>
                          </div>
                        </RadioGroup>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="login-username" className="flex items-center gap-2">
                          <User2 className="h-4 w-4" />
                          Username
                        </Label>
                        <Input
                          id="login-username"
                          {...loginForm.register("username")}
                          className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                          required
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="login-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </Label>
                        <Input
                          id="login-password"
                          type="password"
                          {...loginForm.register("password")}
                          className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-primary/90 hover:bg-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                          disabled={isLoginLoading}
                        >
                          {isLoginLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Login"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                </TabsContent>

                <TabsContent value="register" asChild>
                  <motion.div
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label>I am a</Label>
                        <RadioGroup
                          defaultValue="worker"
                          onValueChange={(value) =>
                            registerForm.setValue("role", value as "worker" | "employer")
                          }
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <RadioGroupItem value="worker" id="register-worker" />
                            <Label 
                              htmlFor="register-worker"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <User2 className="h-4 w-4" />
                              Worker
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 flex-1">
                            <RadioGroupItem value="employer" id="register-employer" />
                            <Label 
                              htmlFor="register-employer"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Briefcase className="h-4 w-4" />
                              Employer
                            </Label>
                          </div>
                        </RadioGroup>
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Label htmlFor="register-username" className="flex items-center gap-2">
                          <User2 className="h-4 w-4" />
                          Username
                        </Label>
                        <Input
                          id="register-username"
                          {...registerForm.register("username")}
                          className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                          required
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Label htmlFor="register-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          {...registerForm.register("password")}
                          className="bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                          required
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4" />
                          Preferred Language
                        </Label>
                        <LanguageSelector
                          value={selectedLanguage || "en"}
                          onValueChange={(value) => registerForm.setValue("preferredLanguage", value)}
                        />
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Region
                        </Label>
                        <RegionSelector
                          value={registerForm.watch("region") || ""}
                          onValueChange={(value) => registerForm.setValue("region", value)}
                          language={selectedLanguage || "en"}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-primary/90 hover:bg-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                          disabled={isRegisterLoading}
                        >
                          {isRegisterLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}