
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/types/database";

interface ProductCreateModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (values: { name: string; price: number; category_id: string | null }) => void;
}

export function ProductCreateModal({ open, onClose, categories, onSave }: ProductCreateModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<string>("none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price < 0) return;
    
    onSave({
      name: name.trim(),
      price,
      category_id: categoryId === "none" ? null : categoryId,
    });

    // Reset form
    setName("");
    setPrice(0);
    setCategoryId("none");
  };

  const handleClose = () => {
    // Reset form when closing
    setName("");
    setPrice(0);
    setCategoryId("none");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel article</DialogTitle>
          <DialogDescription>
            Créez un nouveau produit en remplissant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Nom du produit *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Café au lait"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price" className="text-sm font-medium">
                Prix (TND) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0.000"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Catégorie
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sans catégorie</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="mt-6 flex flex-row justify-between gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
            >
              Créer l'article
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
