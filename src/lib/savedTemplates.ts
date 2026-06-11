import type { NewTemplate } from '@/types/types';

const STORAGE_KEY = 'email-signature-saved-templates';

export interface SavedTemplate extends NewTemplate {
  createdAt: number;
}

function parseStored(raw: string | null): SavedTemplate[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (item): item is SavedTemplate =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as SavedTemplate).id === 'string' &&
        typeof (item as SavedTemplate).name === 'string' &&
        Array.isArray((item as SavedTemplate).rows) &&
        typeof (item as SavedTemplate).createdAt === 'number'
    );
  } catch {
    return [];
  }
}

export function loadSavedTemplates(): SavedTemplate[] {
  if (typeof window === 'undefined') return [];
  return parseStored(localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export function persistSavedTemplates(list: SavedTemplate[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function randomId(): string {
  return `template-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function upsertSavedTemplate(entry: NewTemplate): SavedTemplate {
  const list = loadSavedTemplates();
  const idx = list.findIndex((t) => t.id === entry.id);
  if (idx >= 0) {
    const updated: SavedTemplate = {
      ...list[idx],
      ...entry,
    };
    list[idx] = updated;
    persistSavedTemplates(list);
    return updated;
  }

  const created: SavedTemplate = {
    ...entry,
    id: entry.id || randomId(),
    createdAt: Date.now(),
  };
  list.unshift(created);
  persistSavedTemplates(list);
  return created;
}

export function deleteSavedTemplate(id: string): void {
  const list = loadSavedTemplates().filter((t) => t.id !== id);
  persistSavedTemplates(list);
}
