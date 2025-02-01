import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिंदी (Hindi)", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা (Bengali)", flag: "🇧🇩" },
  { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം (Malayalam)", flag: "🇮🇳" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", flag: "🇮🇳" },
];

type LanguageSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function LanguageSelector({ value, onValueChange }: LanguageSelectorProps) {
  const selectedLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative"
    >
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[240px] h-10 px-3 gap-2 bg-background/60 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 focus:ring-primary/20">
          <Globe className="h-4 w-4 text-primary/80" />
          <SelectValue 
            placeholder="Select language" 
            className="text-sm font-medium"
          />
        </SelectTrigger>
        <SelectContent className="max-h-[280px] bg-background/95 backdrop-blur-md border-primary/20 shadow-xl shadow-primary/10">
          <AnimatePresence>
            {SUPPORTED_LANGUAGES.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ x: 4 }}
              >
                <SelectItem 
                  value={lang.code}
                  className="hover:bg-primary/10 focus:bg-primary/10 transition-colors duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </div>
                </SelectItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </SelectContent>
      </Select>
      
      {/* Language indicator blob */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse" />
    </motion.div>
  );
}
