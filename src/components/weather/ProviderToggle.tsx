import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { ChevronDown, Cloud } from 'lucide-react';
import type { WeatherProvider } from '@/config/weather.config';

interface ProviderToggleProps {
  activeProvider: WeatherProvider;
  onProviderChange: (provider: WeatherProvider) => void;
}

export function ProviderToggle({
  activeProvider,
  onProviderChange,
}: ProviderToggleProps) {
  const providers: {
    value: WeatherProvider;
    label: string;
    description: string;
  }[] = [
    {
      value: 'open-meteo',
      label: 'Open-Meteo',
      description: 'Community API (Canadian GEM)',
    },
    {
      value: 'msc-geomet',
      label: 'Environment Canada (preview)',
      description: 'Official EC data',
    },
  ];

  const currentProvider = providers.find((p) => p.value === activeProvider);

  // Hide toggle if only one provider is available
  if (providers.length <= 1) {
    return null;
  }

  return (
    <Select value={activeProvider} onValueChange={onProviderChange}>
      <SelectTrigger
        className="w-full h-auto rounded-md transition-all duration-200 font-raleway text-left border-[#ff6b00]/20 hover:border-[#ff6b00]/40 hover:bg-[#ff6b00]/5 focus:ring-[#ff6b00]/30 focus:border-[#ff6b00]/50 [&>svg]:hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          padding: '14px 16px',
        }}
      >
        <div className="flex items-center gap-2 w-full">
          <Cloud className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
          <div className="flex-1 flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium text-[#ff6b00] truncate">
              {currentProvider?.label}
            </span>
            <span className="text-xs text-[#a8a8a8] truncate">
              {currentProvider?.description}
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
          {providers.map((provider) => (
            <SelectItem
              key={provider.value}
              value={provider.value}
              className="rounded-lg font-raleway pl-2 pr-8 py-2.5 my-0.5 cursor-pointer focus:bg-[#ff6b00]/15 hover:bg-[#ff6b00]/10 data-[state=checked]:bg-[#ff6b00]/20 transition-colors"
            >
              <div className="flex items-start gap-2">
                <Cloud className="w-4 h-4 text-[#ff6b00] flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="font-medium text-sm text-[#e5e7eb]">
                    {provider.label}
                  </span>
                  <span className="text-xs text-[#a8a8a8]">
                    {provider.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}
