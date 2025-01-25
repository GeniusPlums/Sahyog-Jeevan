import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INDIAN_REGIONS } from "@/lib/constants";

type RegionSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
  language: string;
};

export default function RegionSelector({ value, onValueChange, language }: RegionSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={language === "en" ? "Select your region" : "अपना क्षेत्र चुनें"} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(INDIAN_REGIONS).map(([key, translations]) => (
          <SelectItem key={key} value={key}>
            {translations[language] || translations["en"]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
