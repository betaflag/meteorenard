import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Settings } from 'lucide-react';
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
      description: 'API communautaire (GEM canadien)',
    },
    {
      value: 'msc-geomet',
      label: 'Environnement Canada',
      description: 'Données officielles d\'EC',
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
        className="flex items-center gap-2 px-3 py-2 h-auto rounded-full transition-all duration-300 font-raleway text-sm border-[#ff6b00]/20 hover:border-[#ff6b00]/40 hover:bg-[#ff6b00]/10 focus:ring-[#ff6b00]/40"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#e5e7eb',
        }}
      >
        <Settings className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium">{currentProvider?.label}</span>
      </SelectTrigger>
      <SelectContent
        className="rounded-2xl font-raleway border-[#ff6b00]/30"
        style={{
          background:
            'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(36, 36, 56, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow:
            '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 107, 0, 0.1)',
        }}
      >
        <div className="px-2 py-2">
          <div className="text-[#e5e7eb] text-xs font-semibold mb-2 px-2 uppercase tracking-wider opacity-60">
            Fournisseur météo
          </div>
          {providers.map((provider) => (
            <SelectItem
              key={provider.value}
              value={provider.value}
              className="rounded-xl font-raleway my-1 focus:bg-[#ff6b00]/15 focus:text-[#ff6b00] data-[state=checked]:bg-[#ff6b00]/15 data-[state=checked]:text-[#ff6b00]"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">{provider.label}</span>
                <span className="text-xs text-[#a8a8a8]">
                  {provider.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}
