
import { Settings as SettingsIcon } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCafeteriaSettings } from "@/hooks/useCafeteriaSettings";
import React, { useState, useEffect } from "react";

// Liste d'imprimantes fictives pour la sélection
const PRINTER_OPTIONS = [
  { value: "", label: "Aucune" },
  { value: "epson-tm-t20iii", label: "Epson TM-T20III" },
  { value: "star-tsp143iii", label: "Star TSP143III" },
  { value: "bixolon-srp-e300", label: "Bixolon SRP-E300" },
  { value: "gp-1324d", label: "GP-1324D" },
];

const SettingsPage = () => {
  const { settings, isLoading, saveSettings, isSaving } = useCafeteriaSettings();

  // Etats locaux tampon
  const [values, setValues] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    printer_model: "",
  });

  useEffect(() => {
    if (settings) {
      setValues({
        name: settings.name ?? "",
        address: settings.address ?? "",
        email: settings.email ?? "",
        phone: settings.phone ?? "",
        printer_model: settings.printer_model ?? "",
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(values);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white/80 border rounded-2xl p-8 shadow-lg flex flex-col items-center min-w-[325px] max-w-2xl w-full">
            <SettingsIcon className="w-12 h-12 text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Paramètres Cafétéria Pro
            </h1>
            <form className="mt-3 w-full max-w-xl space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium">Nom du Cafétéria</label>
                <Input name="name" value={values.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium">Adresse</label>
                <Input name="address" value={values.address} onChange={handleChange} required />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium">Email</label>
                  <Input name="email" value={values.email} onChange={handleChange} type="email" placeholder="exemple@email.com"/>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium">Téléphone</label>
                  <Input name="phone" value={values.phone} onChange={handleChange} type="tel" placeholder="ex: 555123456" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Imprimante à tickets</label>
                <select
                  name="printer_model"
                  value={values.printer_model}
                  onChange={handleChange}
                  className="w-full border rounded-md py-2 px-3 mt-1 bg-background"
                >
                  {PRINTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-3 flex justify-end">
                <Button type="submit" disabled={isSaving || isLoading}>
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;
