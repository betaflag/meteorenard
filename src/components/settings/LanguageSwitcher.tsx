import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { ChevronDown, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/types/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { value: Language; label: string }[] = [
    {
      value: 'en',
      label: 'English',
    },
    {
      value: 'fr',
      label: 'Français',
    },
  ];

  const currentLanguage = languages.find((l) => l.value === language);

  // Wrapper function to handle type conversion from string to Language
  const handleLanguageChange = (value: string) => {
    if (value === 'en' || value === 'fr') {
      setLanguage(value);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#e5e7eb] uppercase tracking-wider mb-3">
        {t.appMenu.language}
      </h3>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger
          className="w-full h-auto rounded-md transition-all duration-200 font-raleway text-left border-[#ff6b00]/20 hover:border-[#ff6b00]/40 hover:bg-[#ff6b00]/5 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00]/50 [&>svg]:hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            padding: '14px 16px',
          }}
        >
          <div className="flex items-center gap-2 w-full">
            <Languages className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-[#ff6b00] truncate">
                {currentLanguage?.label}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#a8a8a8] opacity-60 flex-shrink-0" />
          </div>
        </SelectTrigger>
        <SelectContent
          className="rounded-xl font-raleway border-[#ff6b00]/30 min-w-[280px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(36, 36, 56, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow:
              '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 107, 0, 0.15)',
          }}
        >
          <div className="p-1">
            {languages.map((lang) => (
              <SelectItem
                key={lang.value}
                value={lang.value}
                className="rounded-lg font-raleway pl-2 pr-8 py-2.5 my-0.5 cursor-pointer focus:bg-[#ff6b00]/15 hover:bg-[#ff6b00]/10 data-[state=checked]:bg-[#ff6b00]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Languages className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
                  <span className="font-medium text-sm text-[#e5e7eb]">
                    {lang.label}
                  </span>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
