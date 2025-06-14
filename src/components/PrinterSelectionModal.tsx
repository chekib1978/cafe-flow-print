
import { useState } from "react";
import { Printer, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWindowsPrinters } from "@/hooks/useWindowsPrinters";

interface PrinterSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrinter: (printerName: string) => void;
}

export function PrinterSelectionModal({ isOpen, onClose, onSelectPrinter }: PrinterSelectionModalProps) {
  const { printers, isLoading, error, refreshPrinters } = useWindowsPrinters();
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');

  const handleSelect = () => {
    if (selectedPrinter) {
      onSelectPrinter(selectedPrinter);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-600" />
              Sélectionner une Imprimante
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Imprimantes disponibles sur Windows :</p>
            <Button variant="outline" size="sm" onClick={refreshPrinters} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">
                Recherche des imprimantes...
              </div>
            ) : printers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Aucune imprimante trouvée
              </div>
            ) : (
              printers.map((printer) => (
                <div
                  key={printer.name}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPrinter === printer.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPrinter(printer.name)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{printer.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          printer.status === 'Ready' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {printer.status}
                        </span>
                        {printer.isDefault && (
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                            Par défaut
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedPrinter === printer.name && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSelect} 
              disabled={!selectedPrinter}
              className="flex-1"
            >
              Sélectionner
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
