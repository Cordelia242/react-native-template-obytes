// src/app/(app)/etiquetas/_layout.tsx
import { Stack } from 'expo-router';

export default function EtiquetasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Etiquetas' }} />
      <Stack.Screen name="nueva" options={{ title: 'Nueva etiqueta' }} />
      <Stack.Screen name="[id]" options={{ title: 'Etiqueta' }} />
    </Stack>
  );
}
