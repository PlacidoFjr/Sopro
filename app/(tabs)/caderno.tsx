import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevotionalStore } from '../../src/context/devotional-store';
import { devotionals, getTodayDevotional } from '../../src/data/devotionals';
import { colors, darkColors, type Palette } from '../../src/theme';

export default function JournalScreen() {
  const router = useRouter();
  const { notes, preferences } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const today = getTodayDevotional();
  const todayHasNote = Boolean(notes[today.id]);
  const entries = Object.values(notes).sort((first, second) => second.updatedAt - first.updatedAt);

  const openNote = (id: string) => router.push(`/devocional?id=${id}&write=1`);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>sopro</Text>
          <Text style={styles.count}>{entries.length} {entries.length === 1 ? 'anotação' : 'anotações'}</Text>
        </View>

        <Text accessibilityRole="header" style={styles.heading}>Caderno</Text>
        <Text style={styles.intro}>Suas palavras, guardadas neste aparelho.</Text>

        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyRule} />
            <Text style={styles.emptyTitle}>O que ficou com você?</Text>
            <Text style={styles.emptyText}>
              Anote uma ideia, uma pergunta ou uma oração. Você pode voltar e mudar suas palavras depois.
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.primaryButton}
              onPress={() => openNote(today.id)}
              activeOpacity={0.82}
            >
              <Text style={styles.primaryButtonText}>Escrever sobre a leitura de hoje</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {!todayHasNote ? (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Escrever uma anotação sobre ${today.title}`}
                style={styles.todayAction}
                onPress={() => openNote(today.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.todayActionLabel}>Nova anotação</Text>
                <Text style={styles.todayActionTitle}>{today.title}</Text>
              </TouchableOpacity>
            ) : null}

            <View style={styles.list}>
              {entries.map((entry) => {
                const devotional = devotionals.find((item) => item.id === entry.devotionalId);
                if (!devotional) return null;

                return (
                  <TouchableOpacity
                    key={entry.devotionalId}
                    accessibilityRole="button"
                    accessibilityLabel={`Editar anotação sobre ${devotional.title}, atualizada ${formatNoteDate(entry.updatedAt)}`}
                    style={styles.entry}
                    onPress={() => openNote(entry.devotionalId)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.entryMeta}>
                      <Text style={styles.entryReference}>{devotional.reference}</Text>
                      <Text style={styles.entryDate}>{formatNoteDate(entry.updatedAt)}</Text>
                    </View>
                    <Text style={styles.entryTitle}>{devotional.title}</Text>
                    <Text style={styles.entryText} numberOfLines={3}>{entry.text}</Text>
                    <Text style={styles.editLabel}>Editar anotação</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatNoteDate(timestamp: number) {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(timestamp);
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.paper },
  content: { width: '100%', maxWidth: 850, alignSelf: 'center', paddingHorizontal: 27, paddingTop: 15, paddingBottom: 36 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 42 },
  brand: { color: palette.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.7 },
  count: { color: palette.muted, fontSize: 12 },
  heading: { color: palette.ink, fontFamily: 'Georgia', fontSize: 36, lineHeight: 42 },
  intro: { color: palette.inkSoft, fontSize: 15, lineHeight: 23, marginTop: 9, marginBottom: 26 },
  emptyState: { alignItems: 'flex-start', marginTop: 35 },
  emptyRule: { width: 38, height: 2, backgroundColor: palette.yellow, marginBottom: 21 },
  emptyTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 24, lineHeight: 30 },
  emptyText: { maxWidth: 305, color: palette.inkSoft, fontSize: 15, lineHeight: 23, marginTop: 9 },
  primaryButton: { minHeight: 52, borderRadius: 4, backgroundColor: palette.ink, paddingHorizontal: 17, justifyContent: 'center', marginTop: 21 },
  primaryButtonText: { color: palette.white, fontSize: 14, fontWeight: '600' },
  todayAction: { paddingVertical: 15, paddingHorizontal: 16, backgroundColor: palette.mossLight, marginTop: 2, marginBottom: 25 },
  todayActionLabel: { color: palette.plum, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  todayActionTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 17, lineHeight: 23 },
  list: { borderTopWidth: 1, borderTopColor: palette.line },
  entry: { borderBottomWidth: 1, borderBottomColor: palette.line, paddingVertical: 18 },
  entryMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  entryReference: { color: palette.moss, fontSize: 12, fontWeight: '600' },
  entryDate: { color: palette.muted, fontSize: 12 },
  entryTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 18, lineHeight: 24, marginBottom: 7 },
  entryText: { color: palette.inkSoft, fontSize: 14, lineHeight: 21 },
  editLabel: { color: palette.plum, fontSize: 12, fontWeight: '600', marginTop: 10 },
  });
}
