// src/app/(app)/etiquetas/[id].tsx
import { useLocalSearchParams } from 'expo-router';

import { TagFormScreen } from '@/features/tags/tag-form-screen';

export default function EditarEtiquetaPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TagFormScreen tagId={id} />;
}
