# Tags — Diseño

**Fecha:** 2026-05-25
**Branch:** feat/accounts
**Alcance:** CRUD de tags desde Settings + relación many-to-many con transacciones + picker reutilizable

---

## 1. Base de datos

### Schema

**`src/lib/database/schema/tag.ts`**

```ts
export const tags = sqliteTable('tag', {
  id:        text('id').primaryKey(),
  name:      text('name').notNull().unique(),
  createdAt: text('created_at').notNull(),
});
```

**`src/lib/database/schema/transaction-tag.ts`** (junction table)

```ts
export const transactionTags = sqliteTable(
  'transaction_tag',
  {
    tagId:         text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
    transactionId: text('transaction_id').notNull().references(() => transactions.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.tagId, t.transactionId] }) }),
);
```

Ambas FK usan `onDelete: 'cascade'`: borrar una tag o una transacción limpia automáticamente las filas de la junction table.

### Migración

Archivo `src/lib/database/migrations/0003_tags.sql`, generado con `drizzle-kit generate` y registrado en `migrations/index.ts`.

---

## 2. Repositorio

**Estructura:** `src/lib/database/repositories/tag/`

| Archivo | Responsabilidad |
|---|---|
| `tag.commands.ts` | `createTag`, `updateTag`, `deleteTag` |
| `tag.queries.ts` | `findAllTags`, `findTagById` |
| `tag.relations.ts` | `addTagToTransaction`, `removeTagFromTransaction`, `findTransactionCountByTag` — todos operan sobre `transaction_tags`, no sobre `tags` |
| `index.ts` | Clase `TagRepository` que expone todos los métodos |

`findTransactionCountByTag(id): number` — usado por la UI antes de confirmar el borrado para mostrar cuántas transacciones usan la tag.

**Actualizaciones:**
- `_shared/types.ts` — agregar `Tag`, `NewTag`, `TransactionTag`, `NewTransactionTag`
- `schema/index.ts` — re-exportar los nuevos schemas
- `provider.tsx` — instanciar `TagRepository` y exponerlo como `tags` en el contexto

---

## 3. Navegación y pantallas

### Rutas

```
src/app/(app)/etiquetas/
  _layout.tsx    Stack navigator
  index.tsx      lista de tags
  nueva.tsx      formulario crear
  [id].tsx       formulario editar/eliminar
```

En `(app)/_layout.tsx` se agrega:

```tsx
<Tabs.Screen name="etiquetas" options={{ href: null, headerShown: false }} />
```

### Feature screens

**`src/features/tags/`**

- **`tags-screen.tsx`** (`TagsScreen`) — lista todas las tags. Botón `+` en header navega a `/etiquetas/nueva`. Cada fila navega a `/etiquetas/[id]`. Usa `useFocusEffect` para recargar al volver.
- **`tag-form-screen.tsx`** (`TagFormScreen`) — un campo `name` validado con Zod (`min(1)`). En modo edición incluye botón "Eliminar" que:
  1. Llama `findTransactionCountByTag(id)`.
  2. Si count > 0, muestra `Alert` con mensaje "Esta etiqueta está en uso en X transacción(es). ¿Eliminar de todas formas?".
  3. Si count === 0, muestra confirmación simple.
  4. Tras confirmar, llama `tags.delete(id)` y navega atrás.

### Settings

En `SettingsScreen`, dentro de `SettingsContainer title="settings.finances"`, se agrega:

```tsx
<SettingsItem
  text="settings.tags"
  onPress={() => router.push('/etiquetas')}
/>
```

### Traducciones (solo es.json)

```json
"tags": {
  "title": "Etiquetas",
  "new": "Nueva etiqueta",
  "edit": "Editar etiqueta",
  "name_label": "Nombre",
  "name_required": "Nombre requerido",
  "save": "Guardar etiqueta",
  "update": "Actualizar etiqueta",
  "delete": "Eliminar etiqueta",
  "delete_confirm_title": "Eliminar etiqueta",
  "delete_confirm_message": "Esta etiqueta está en uso en {{count}} transacción(es). ¿Eliminar de todas formas?",
  "delete_confirm_simple": "¿Eliminar esta etiqueta?",
  "created": "Etiqueta creada",
  "updated": "Etiqueta actualizada",
  "deleted": "Etiqueta eliminada",
  "empty": "Sin etiquetas"
}
```

Y en `settings`:
```json
"tags": "Etiquetas"
```

---

## 4. TagPickerSheet (componente reutilizable)

**`src/features/tags/components/tag-picker-sheet.tsx`**

```tsx
type Props = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  visible: boolean;
  onClose: () => void;
};
```

- Usa el `Modal` existente en `@/components/ui`.
- Carga todas las tags con `useDatabase().tags.findAll()` al montar.
- Lista tags con `Checkbox` (existente en `ui/`) — selección múltiple.
- Emite el array de IDs seleccionados vía `onChange` en cada cambio. No persiste nada.
- Diseñado para insertarse en el futuro formulario de transacciones.

---

## Archivos nuevos

```
src/lib/database/schema/tag.ts
src/lib/database/schema/transaction-tag.ts
src/lib/database/migrations/0003_tags.sql         (generado)
src/lib/database/repositories/tag/tag.commands.ts
src/lib/database/repositories/tag/tag.queries.ts
src/lib/database/repositories/tag/tag.relations.ts
src/lib/database/repositories/tag/index.ts
src/features/tags/tags-screen.tsx
src/features/tags/tag-form-screen.tsx
src/features/tags/components/tag-picker-sheet.tsx
src/app/(app)/etiquetas/_layout.tsx
src/app/(app)/etiquetas/index.tsx
src/app/(app)/etiquetas/nueva.tsx
src/app/(app)/etiquetas/[id].tsx
```

## Archivos modificados

```
src/lib/database/schema/index.ts
src/lib/database/migrations/index.ts             (registrar migración)
src/lib/database/repositories/_shared/types.ts
src/lib/database/provider.tsx
src/app/(app)/_layout.tsx
src/features/settings/settings-screen.tsx
src/translations/es.json
```
