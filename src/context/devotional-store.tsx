import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'sopro:leitura:v1';

export type JournalNote = {
  devotionalId: string;
  text: string;
  updatedAt: number;
};

export type AppPreferences = {
  readingSize: 'normal' | 'large';
  appearance: 'light' | 'dark';
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
};

const defaultPreferences: AppPreferences = {
  readingSize: 'normal',
  appearance: 'light',
  reminderEnabled: false,
  reminderHour: 8,
  reminderMinute: 0,
};

type StoreValue = {
  savedIds: string[];
  completedIds: string[];
  notes: Record<string, JournalNote>;
  preferences: AppPreferences;
  hydrated: boolean;
  toggleSaved: (id: string) => void;
  toggleCompleted: (id: string) => void;
  saveNote: (id: string, text: string) => void;
  removeNote: (id: string) => void;
  updatePreferences: (patch: Partial<AppPreferences>) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function DevotionalStoreProvider({ children }: React.PropsWithChildren) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, JournalNote>>({});
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        const stored = JSON.parse(raw) as {
          savedIds?: string[];
          completedIds?: string[];
          notes?: Record<string, JournalNote>;
          preferences?: Partial<AppPreferences>;
        };
        setSavedIds(Array.isArray(stored.savedIds) ? stored.savedIds : []);
        setCompletedIds(Array.isArray(stored.completedIds) ? stored.completedIds : []);
        const validNotes = Object.fromEntries(
          Object.entries(stored.notes ?? {}).filter(
            ([id, note]) =>
              typeof id === 'string' &&
              typeof note?.devotionalId === 'string' &&
              typeof note.text === 'string' &&
              typeof note.updatedAt === 'number',
          ),
        );
        setNotes(validNotes);
        setPreferences({
          ...defaultPreferences,
          ...stored.preferences,
          readingSize: stored.preferences?.readingSize === 'large' ? 'large' : 'normal',
          appearance: stored.preferences?.appearance === 'dark' ? 'dark' : 'light',
          reminderEnabled: stored.preferences?.reminderEnabled === true,
          reminderHour: Number.isInteger(stored.preferences?.reminderHour)
            ? Math.min(23, Math.max(0, stored.preferences!.reminderHour!))
            : defaultPreferences.reminderHour,
          reminderMinute: Number.isInteger(stored.preferences?.reminderMinute)
            ? Math.min(59, Math.max(0, stored.preferences!.reminderMinute!))
            : defaultPreferences.reminderMinute,
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ savedIds, completedIds, notes, preferences })).catch(() => undefined);
  }, [completedIds, hydrated, notes, preferences, savedIds]);

  const value = useMemo<StoreValue>(
    () => ({
      savedIds,
      completedIds,
      notes,
      preferences,
      hydrated,
      toggleSaved: (id) =>
        setSavedIds((current) =>
          current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
        ),
      toggleCompleted: (id) =>
        setCompletedIds((current) =>
          current.includes(id) ? current.filter((completedId) => completedId !== id) : [...current, id],
        ),
      saveNote: (id, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setNotes((current) => ({
          ...current,
          [id]: { devotionalId: id, text: trimmed, updatedAt: Date.now() },
        }));
      },
      removeNote: (id) =>
        setNotes((current) => {
          const next = { ...current };
          delete next[id];
          return next;
        }),
      updatePreferences: (patch) => setPreferences((current) => ({ ...current, ...patch })),
    }),
    [completedIds, hydrated, notes, preferences, savedIds],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDevotionalStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useDevotionalStore precisa estar dentro de DevotionalStoreProvider.');
  return value;
}
