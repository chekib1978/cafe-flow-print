
import { BarChart3, Printer } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DailySalesTab } from "@/components/DailySalesTab";
import { AllSalesTab } from "@/components/AllSalesTab";
import { PrinterSelectionModal } from "@/components/PrinterSelectionModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Stats = () => {
  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);
  const { toast } = useToast();

  const handlePrinterSelect = (printerName: string) => {
    toast({
      title: "Imprimante sélectionnée",
      description: `${printerName} est maintenant configurée pour l'impression des tickets.`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col p-6">
          <div className="bg-white/80 border rounded-2xl p-8 shadow-lg flex flex-col items-center w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between w-full mb-6">
              <div className="flex flex-col items-center flex-1">
                <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Statistiques & Rapports
                </h1>
                <p className="text-gray-600 text-center max-w-md">
                  Analysez vos ventes et performances en temps réel
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPrinterModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Configurer Imprimante
              </Button>
            </div>
          </div>
          
          <div className="w-full max-w-6xl mx-auto bg-white/70 rounded-xl shadow mt-6">
            <Tabs defaultValue="daily" className="w-full">
              <div className="border-b px-6 pt-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="daily" className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Recette Journalière
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Historique Complet
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="daily" className="p-6">
                <DailySalesTab />
              </TabsContent>
              
              <TabsContent value="all" className="p-6">
                <AllSalesTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <PrinterSelectionModal
        isOpen={isPrinterModalOpen}
        onClose={() => setIsPrinterModalOpen(false)}
        onSelectPrinter={handlePrinterSelect}
      />
    </SidebarProvider>
  );
};

export default Stats;
