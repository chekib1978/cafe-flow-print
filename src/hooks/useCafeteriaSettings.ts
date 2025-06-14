
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CafeteriaSettings {
  id: string;
  name: string;
  address: string;
  email?: string | null;
  phone?: string | null;
  printer_model?: string | null;
}

export function useCafeteriaSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // On suppose qu'il n'y a qu'une seule ligne, la plus récente, dans la table de settings.
  const { data: settings, isLoading } = useQuery({
    queryKey: ['cafeteria_settings'],
    queryFn: async (): Promise<CafeteriaSettings | null> => {
      const { data, error } = await supabase
        .from('cafeteria_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
  });

  const mutation = useMutation({
    mutationFn: async (update: Partial<CafeteriaSettings>) => {
      // Upsert (mettre à jour ou créer si inexistant)
      let current_id = settings?.id;
      let upsertObj = { ...update };
      if (current_id) upsertObj = { ...upsertObj, id: current_id };
      const { data, error } = await supabase
        .from('cafeteria_settings')
        .upsert(upsertObj, { onConflict: 'id' })
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafeteria_settings'] });
      toast({
        title: "Paramètres enregistrés",
        description: "Les informations du Cafétéria sont à jour.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "La mise à jour a échoué.",
        variant: "destructive",
      });
    },
  });

  const saveSettings = (values: Partial<CafeteriaSettings>) => {
    mutation.mutate(values);
  };

  return {
    settings,
    isLoading,
    saveSettings,
    isSaving: mutation.isPending,
  };
}
