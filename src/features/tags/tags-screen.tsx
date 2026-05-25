// src/features/tags/tags-screen.tsx
import type { Tag } from '@/lib/database/repositories/_shared/types';

import { Stack, useFocusEffect, useRouter } from 'expo-router';
import * as React from 'react';
import { useCallback, useState } from 'react';

import { Pressable, ScrollView, Text, View } from '@/components/ui';
import { useDatabase } from '@/lib/database/provider';

export function TagsScreen() {
  const { tags } = useDatabase();
  const router = useRouter();
  const [tagList, setTagList] = useState<Tag[]>([]);

  useFocusEffect(
    useCallback(() => {
      setTagList(tags.findAll());
    }, [tags]),
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Etiquetas',
          headerRight: () => (
            <Pressable onPress={() => router.push('/etiquetas/nueva')}>
              <Text className="px-3 text-lg text-primary-300">+</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView className="flex-1">
        {tagList.length === 0
          ? (
              <View className="flex-1 items-center justify-center py-16">
                <Text className="text-neutral-400">Sin etiquetas</Text>
              </View>
            )
          : tagList.map(tag => (
              <Pressable
                key={tag.id}
                onPress={() => router.push(`/etiquetas/${tag.id}`)}
                className="flex-row items-center justify-between border-b border-neutral-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <Text className="font-medium">{tag.name}</Text>
                <Text className="text-neutral-400">›</Text>
              </Pressable>
            ))}
      </ScrollView>
    </>
  );
}
