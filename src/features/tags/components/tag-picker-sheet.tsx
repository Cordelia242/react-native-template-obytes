import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as React from 'react';

import { Checkbox, Pressable, Text, View } from '@/components/ui';
import { Modal } from '@/components/ui/modal';
import { useDatabase } from '@/lib/database/provider';

type Props = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  sheetRef: React.RefObject<BottomSheetModal>;
};

export function TagPickerSheet({ selectedIds, onChange, sheetRef }: Props) {
  const { tags } = useDatabase();
  const allTags = tags.findAll();

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(sid => sid !== id));
    }
    else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <Modal ref={sheetRef} snapPoints={['50%']} title="Etiquetas">
      <BottomSheetScrollView>
        {allTags.length === 0
          ? (
              <View className="items-center py-8">
                <Text className="text-neutral-400">Sin etiquetas</Text>
              </View>
            )
          : allTags.map(tag => (
              <Pressable
                key={tag.id}
                onPress={() => toggle(tag.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selectedIds.includes(tag.id) }}
                accessibilityLabel={tag.name}
                className="flex-row items-center gap-3 border-b border-neutral-100 px-4 py-3 dark:border-neutral-800"
              >
                <Checkbox.Icon checked={selectedIds.includes(tag.id)} />
                <Text className="font-medium">{tag.name}</Text>
              </Pressable>
            ))}
      </BottomSheetScrollView>
    </Modal>
  );
}
