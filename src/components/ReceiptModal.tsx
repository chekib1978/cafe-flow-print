
import { useState, useRef } from "react";
import { X, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { SaleWithItems } from "@/types/database";

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
              line-height: 1.4;
              margin: 0;
              padding: 10px;
              max-width: 300px;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .receipt-line { 
              display: flex; 
              justify-content: space-between; 
              margin: 2px 0;
            }
            .separator { 
              border-top: 1px dashed #000; 
              margin: 10px 0; 
            }
            .total { 
              font-size: 14px; 
              font-weight: bold; 
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Ticket de Caisse
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div ref={receiptRef} className="bg-white p-4 font-mono text-sm border rounded-lg">
            <div className="center bold text-lg mb-4">CAFÉTÉRIA PRO</div>
            <div className="center mb-4">
              <div>123 Rue de la Paix</div>
              <div>75001 Paris</div>
              <div>Tél: 01 23 45 67 89</div>
            </div>
            
            <div className="separator"></div>
            
            <div className="receipt-line bold">
              <span>Ticket N°: {sale.ticket_number}</span>
            </div>
            <div className="receipt-line">
              <span>Date: {saleDate.toLocaleDateString('fr-FR')}</span>
              <span>Heure: {saleDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="separator"></div>
            
            {sale.sale_items.map((item, index) => (
              <div key={index}>
                <div className="receipt-line">
                  <span>{item.product_name}</span>
                </div>
                <div className="receipt-line">
                  <span>{item.quantity} × {item.unit_price.toFixed(2)}€</span>
                  <span>{item.total_price.toFixed(2)}€</span>
                </div>
              </div>
            ))}
            
            <div className="separator"></div>
            
            <div className="receipt-line total">
              <span>TOTAL:</span>
              <span>{sale.total.toFixed(2)}€</span>
            </div>
            
            <div className="separator"></div>
            
            <div className="center mt-4">
              <div>Merci de votre visite!</div>
              <div>À bientôt</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
