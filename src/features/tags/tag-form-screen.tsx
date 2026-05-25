// src/features/tags/tag-form-screen.tsx
import { useForm } from '@tanstack/react-form';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { Alert } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as z from 'zod';

import { Button, Input, showErrorMessage, View } from '@/components/ui';
import { getFieldError } from '@/components/ui/form-utils';
import { useDatabase } from '@/lib/database/provider';

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
});

type Props = { tagId?: string };

export function TagFormScreen({ tagId }: Props) {
  const { tags } = useDatabase();
  const router = useRouter();
  const isEdit = !!tagId;
  const existing = tagId ? tags.findById(tagId) : undefined;

  const form = useForm({
    defaultValues: { name: existing?.name ?? '' },
    validators: { onChange: schema as any },
    onSubmit: ({ value }) => {
      try {
        if (isEdit) {
          tags.update(tagId!, value);
          showMessage({ message: 'Etiqueta actualizada', type: 'success' });
        }
        else {
          tags.create(value);
          showMessage({ message: 'Etiqueta creada', type: 'success' });
        }
        router.back();
      }
      catch {
        showErrorMessage('Error al guardar la etiqueta');
      }
    },
  });

  const handleDelete = () => {
    if (!tagId)
      return;
    const count = tags.countTransactions(tagId);
    const message = count > 0
      ? `Esta etiqueta está en uso en ${count} transacción(es). ¿Eliminar de todas formas?`
      : '¿Eliminar esta etiqueta?';

    Alert.alert('Eliminar etiqueta', message, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          try {
            tags.delete(tagId);
            showMessage({ message: 'Etiqueta eliminada', type: 'success' });
            router.back();
          }
          catch {
            showErrorMessage('Error al eliminar la etiqueta');
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{ title: isEdit ? 'Editar etiqueta' : 'Nueva etiqueta' }}
      />
      <View className="flex-1 p-4">
        <form.Field
          name="name"
          children={field => (
            <Input
              label="Nombre"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
              error={getFieldError(field)}
            />
          )}
        />
        <form.Subscribe
          selector={state => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <Button
              label={isEdit ? 'Actualizar etiqueta' : 'Guardar etiqueta'}
              loading={isSubmitting}
              onPress={form.handleSubmit}
            />
          )}
        />
        {isEdit && (
          <View className="mt-4">
            <Button
              label="Eliminar etiqueta"
              variant="destructive"
              onPress={handleDelete}
            />
          </View>
        )}
      </View>
    </>
  );
}
