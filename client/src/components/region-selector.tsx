import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDIAN_REGIONS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

type RegionSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
  language: string;
};

export default function RegionSelector({ value, onValueChange, language }: RegionSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative"
    >
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[240px] h-10 px-3 gap-2 bg-background/60 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 focus:ring-primary/20">
          <MapPin className="h-4 w-4 text-primary/80" />
          <SelectValue 
            placeholder={language === "en" ? "Select your region" : "अपना क्षेत्र चुनें"}
            className="text-sm font-medium"
          />
        </SelectTrigger>
        <SelectContent className="max-h-[280px] bg-background/95 backdrop-blur-md border-primary/20 shadow-xl shadow-primary/10">
          <AnimatePresence>
            {Object.entries(INDIAN_REGIONS).map(([key, translations], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ x: 4 }}
              >
                <SelectItem 
                  value={key}
                  className="hover:bg-primary/10 focus:bg-primary/10 transition-colors duration-300"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                    <span className="text-sm font-medium">
                      {translations[language] || translations["en"]}
                    </span>
                  </div>
                </SelectItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </SelectContent>
      </Select>

      {/* Region indicator blob */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse" />
    </motion.div>
  );
}
