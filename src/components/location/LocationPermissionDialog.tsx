import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { GeolocationService } from '@/services/geolocation/GeolocationService';
import type { Location } from '@/types/location';

interface LocationPermissionDialogProps {
  open: boolean;
  onLocationSelected: (location: Location) => void;
  onManualSelection: () => void;
}

export function LocationPermissionDialog({
  open,
  onLocationSelected,
  onManualSelection,
}: LocationPermissionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestLocation = async () => {
    setIsLoading(true);
    setError(null);

    const result = await GeolocationService.getCurrentPosition();

    if (result.location) {
      onLocationSelected(result.location);
    } else if (result.error) {
      setError(result.error.message);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#ff6b00]" />
            Votre position
          </DialogTitle>
          <DialogDescription>
            Météo Renard utilise votre position pour afficher la météo locale. Vous pouvez aussi choisir une ville manuellement.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
          <Button
            onClick={handleRequestLocation}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Localisation en cours...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                Utiliser ma position
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onManualSelection}
            disabled={isLoading}
            className="w-full"
          >
            Choisir une ville
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
