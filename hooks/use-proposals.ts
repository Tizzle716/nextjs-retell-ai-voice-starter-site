import { useState, useEffect } from 'react';
import { Proposal } from '@/app/types/sales';

// Cette fonction simule un appel API
const fetchProposals = async (): Promise<Proposal[]> => {
  // Simulons un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Retournons des données factices avec les nouveaux statuts
  return [
    { id: '1', title: 'Proposal A', client: 'Client X', date: '2023-05-01', status: 'sent', score: 75, createdAt: '2023-04-30T10:00:00Z', updatedAt: '2023-05-01T09:00:00Z' },
    { id: '2', title: 'Proposal B', client: 'Client Y', date: '2023-05-15', status: 'accepted', score: 90, createdAt: '2023-05-10T14:00:00Z', updatedAt: '2023-05-15T11:30:00Z' },
    { id: '3', title: 'Proposal C', client: 'Client Z', date: '2023-05-30', status: 'rejected', score: 60, createdAt: '2023-05-28T16:00:00Z', updatedAt: '2023-05-30T10:15:00Z' },
    // Ajoutez plus de propositions factices si nécessaire
  ];
};

export function useProposals() {
  const [data, setData] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProposals = async () => {
      try {
        const proposals = await fetchProposals();
        setData(proposals);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    };

    loadProposals();
  }, []);

  return { data, isLoading, error };
}
