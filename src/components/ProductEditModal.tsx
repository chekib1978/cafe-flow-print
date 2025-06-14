
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductWithCategory } from "@/types/database";

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductWithCategory | null;
  onSave: (values: { name: string; price: number }) => void;
}

export function ProductEditModal({ open, onClose, product, onSave }: ProductEditModalProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);

  // Initialize fields when product changes
  useEffect(() => {
    setName(product?.name || "");
    setPrice(product?.price || 0);
  }, [product]);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'article</DialogTitle>
          <DialogDescription>
            Modifiez la désignation et le prix de l'article.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!name.trim() || price < 0) return;
            onSave({ name: name.trim(), price });
          }}
        >
          <div className="space-y-3">
            <label className="block text-sm font-medium">Désignation</label>
            <Input value={name} onChange={v => setName(v.target.value)} />
            <label className="block text-sm font-medium">Prix (TND)</label>
            <Input type="number" step="0.001" value={price} onChange={v => setPrice(Number(v.target.value))} />
          </div>
          <DialogFooter className="mt-6 flex flex-row justify-between gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-emerald-600 text-white">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
