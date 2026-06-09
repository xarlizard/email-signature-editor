import type { SignatureValues } from '@/types/types';

const STORAGE_KEY = 'email-signature-saved-sigs';

export interface SavedSignature {
  id: string;
  createdAt: number;
  templateId: string;
  values: SignatureValues;
}

function parseStored(raw: string | null): SavedSignature[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (item): item is SavedSignature =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as SavedSignature).id === 'string' &&
        typeof (item as SavedSignature).templateId === 'string' &&
        typeof (item as SavedSignature).values === 'object' &&
        typeof (item as SavedSignature).createdAt === 'number'
    );
  } catch {
    return [];
  }
}

export function loadSavedSignatures(): SavedSignature[] {
  if (typeof window === 'undefined') return [];
  return parseStored(localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export function persistSavedSignatures(list: SavedSignature[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function upsertSavedSignature(
  entry: {
    id?: string;
    templateId: string;
    values: SignatureValues;
  }
): SavedSignature {
  const list = loadSavedSignatures();
  if (entry.id) {
    const idx = list.findIndex((s) => s.id === entry.id);
    if (idx >= 0) {
      const updated: SavedSignature = {
        ...list[idx],
        templateId: entry.templateId,
        values: { ...entry.values },
      };
      list[idx] = updated;
      persistSavedSignatures(list);
      return updated;
    }
  }
  const created: SavedSignature = {
    id: randomId(),
    createdAt: Date.now(),
    templateId: entry.templateId,
    values: { ...entry.values },
  };
  list.unshift(created);
  persistSavedSignatures(list);
  return created;
}

export function deleteSavedSignature(id: string): void {
  const list = loadSavedSignatures().filter((s) => s.id !== id);
  persistSavedSignatures(list);
}
