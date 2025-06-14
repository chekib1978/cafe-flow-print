
import { useState, useRef } from "react";
import { X, Printer, Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SaleWithItems } from "@/types/database";
import { formatPrice } from "@/types/database";

interface ReceiptModalProps {
  sale: SaleWithItems | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ sale, isOpen, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket de Caisse - ${sale?.ticket_number}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              line-height: 1.6;
              margin: 0;
              padding: 15px;
              max-width: 300px;
              background: white;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .receipt-line { 
              display: flex; 
              justify-content: space-between; 
              margin: 3px 0;
              align-items: center;
            }
            .separator { 
              border-top: 1px dashed #333; 
              margin: 12px 0; 
            }
            .total { 
              font-size: 16px; 
              font-weight: bold; 
              background: #f0f0f0;
              padding: 8px;
              border-radius: 4px;
            }
            .header {
              background: linear-gradient(135deg, #059669, #2563eb);
              color: white;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!sale) return null;

  const saleDate = new Date(sale.created_at);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-white to-blue-50">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl font-bold text-gray-800">
            <div className="flex items-center gap-2">
              <Receipt className="w-6 h-6 text-blue-600" />
              Ticket de Caisse
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-500">
              <X className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div ref={receiptRef} className="bg-white p-6 font-mono text-sm border rounded-xl shadow-lg">
            <div className="header center">
              <div className="bold text-xl mb-2">🏪 CAFÉTÉRIA PRO</div>
              <div className="text-sm opacity-90">Système de Point de Vente</div>
            </div>
            
            <div className="center mb-4 text-gray-600">
              <div>123 Avenue Habib Bourguiba</div>
              <div>1000 Tunis, Tunisie</div>
              <div>Tél: +216 71 123 456</div>
              <div>Email: contact@cafeteria-pro.tn</div>
            </div>
            
            <div className="separator"></div>
            
            <div className="space-y-2 mb-4">
              <div className="receipt-line bold">
                <span>Ticket N°:</span>
                <span>{sale.ticket_number}</span>
              </div>
              <div className="receipt-line">
                <span>Date:</span>
                <span>{saleDate.toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="receipt-line">
                <span>Heure:</span>
                <span>{saleDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="receipt-line">
                <span>Articles:</span>
                <span>{sale.items_count}</span>
              </div>
            </div>
            
            <div className="separator"></div>
            
            <div className="space-y-3 mb-4">
              {sale.sale_items.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="receipt-line bold">
                    <span>{item.product_name}</span>
                  </div>
                  <div className="receipt-line text-gray-600">
                    <span>{item.quantity} × {formatPrice(item.unit_price)}</span>
                    <span className="bold">{formatPrice(item.total_price)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="separator"></div>
            
            <div className="total center">
              <div className="receipt-line text-lg">
                <span>TOTAL À PAYER:</span>
                <span>{formatPrice(sale.total)}</span>
              </div>
            </div>
            
            <div className="separator"></div>
            
            <div className="center mt-4 text-gray-600">
              <div className="bold">✨ Merci de votre visite! ✨</div>
              <div>À très bientôt chez Cafétéria Pro</div>
              <div className="mt-2 text-xs">
                Ticket généré le {new Date().toLocaleString('fr-FR')}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handlePrint} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
