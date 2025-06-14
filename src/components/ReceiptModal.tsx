
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

    // Format optimisé pour imprimantes Epson TM (80mm)
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${sale?.ticket_number}</title>
          <style>
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
            }
            
            body { 
              font-family: 'Courier New', 'Lucida Console', monospace; 
              font-size: 11px; 
              line-height: 1.3;
              margin: 0;
              padding: 2mm;
              width: 76mm;
              background: white;
              color: black;
            }
            
            .center { 
              text-align: center; 
              margin: 2px 0;
            }
            
            .left { 
              text-align: left; 
            }
            
            .right { 
              text-align: right; 
            }
            
            .bold { 
              font-weight: bold; 
            }
            
            .large { 
              font-size: 14px; 
              font-weight: bold;
            }
            
            .receipt-line { 
              display: flex; 
              justify-content: space-between; 
              margin: 1px 0;
              font-size: 11px;
            }
            
            .item-line {
              margin: 1px 0;
              font-size: 10px;
            }
            
            .separator { 
              border-top: 1px dashed #000; 
              margin: 3mm 0; 
              height: 0;
            }
            
            .double-separator {
              border-top: 2px solid #000;
              margin: 3mm 0;
              height: 0;
            }
            
            .total-section { 
              font-size: 12px; 
              font-weight: bold; 
              margin: 2mm 0;
            }
            
            .store-info {
              font-size: 10px;
              margin: 1px 0;
            }
            
            .thank-you {
              font-size: 10px;
              margin: 2mm 0 1mm 0;
            }
            
            /* Suppression des marges pour l'impression */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
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
    
    // Délai pour laisser le CSS se charger
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
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
          <div ref={receiptRef} className="bg-white p-4 font-mono text-sm border rounded-xl shadow-lg">
            {/* En-tête du magasin */}
            <div className="center large">CAFETERIA PRO</div>
            <div className="center store-info">123 Avenue Habib Bourguiba</div>
            <div className="center store-info">1000 Tunis, Tunisie</div>
            <div className="center store-info">Tel: +216 71 123 456</div>
            <div className="center store-info">Email: contact@cafeteria-pro.tn</div>
            
            <div className="separator"></div>
            
            {/* Informations du ticket */}
            <div className="receipt-line">
              <span>Ticket:</span>
              <span className="bold">{sale.ticket_number}</span>
            </div>
            <div className="receipt-line">
              <span>Date:</span>
              <span>{saleDate.toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="receipt-line">
              <span>Heure:</span>
              <span>{saleDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="separator"></div>
            
            {/* Articles */}
            {sale.sale_items.map((item, index) => (
              <div key={index}>
                <div className="item-line bold">{item.product_name}</div>
                <div className="receipt-line">
                  <span>{item.quantity} x {formatPrice(item.unit_price)}</span>
                  <span className="bold">{formatPrice(item.total_price)}</span>
                </div>
              </div>
            ))}
            
            <div className="separator"></div>
            
            {/* Résumé */}
            <div className="receipt-line">
              <span>Nb articles:</span>
              <span>{sale.items_count}</span>
            </div>
            
            <div className="double-separator"></div>
            
            {/* Total */}
            <div className="receipt-line total-section">
              <span>TOTAL:</span>
              <span>{formatPrice(sale.total)}</span>
            </div>
            
            <div className="double-separator"></div>
            
            {/* Pied de page */}
            <div className="center thank-you bold">MERCI DE VOTRE VISITE</div>
            <div className="center thank-you">A bientot chez Cafeteria Pro</div>
            
            <div className="separator"></div>
            
            <div className="center store-info">
              Imprime le {new Date().toLocaleString('fr-FR')}
            </div>
            
            {/* Espace pour la coupe du papier */}
            <div style={{ height: '10mm' }}></div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handlePrint} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimer Ticket
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
