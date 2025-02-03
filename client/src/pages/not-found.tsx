import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const [_, navigate] = useLocation();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background via-background to-background/95">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-destructive/5 blur-3xl animate-pulse" />
        <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-destructive/5 blur-3xl animate-pulse" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-4"
      >
        <Card className="backdrop-blur-sm border-destructive/10 shadow-2xl shadow-destructive/5">
          <CardContent className="pt-6">
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <AlertCircle className="h-16 w-16 text-destructive mb-4" />
              </motion.div>
              
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                404
              </motion.h1>
              
              <motion.h2 
                className="text-xl font-semibold text-foreground mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t('common.pageNotFound')}
              </motion.h2>

              <motion.p 
                className="text-sm text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t('common.pageNotFoundMessage')}
              </motion.p>

              <div className="flex gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 hover:bg-destructive/10"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('common.goBack')}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 bg-destructive/90 hover:bg-destructive"
                  >
                    <Home className="h-4 w-4" />
                    {t('common.goHome')}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
