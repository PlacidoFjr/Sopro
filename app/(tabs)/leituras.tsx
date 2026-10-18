import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevotionalStore } from '../../src/context/devotional-store';
import { dailyDevotionals, getTodayDevotional } from '../../src/data/devotionals';
import { colors, darkColors, type Palette } from '../../src/theme';

export default function ReadingsScreen() {
  const router = useRouter();
  const { completedIds, preferences } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const today = getTodayDevotional();
  const orderedReadings = useMemo(() => [...dailyDevotionals].sort((first, second) => {
    if (first.id === today.id) return -1;
    if (second.id === today.id) return 1;
    return 0;
  }), [today.id]);
  const renderReading = useCallback(({ item }: { item: (typeof orderedReadings)[number] }) => {
    const completed = completedIds.includes(item.id);
    const isToday = item.id === today.id;

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${item.title}, ${item.reference}${completed ? ', leitura concluída' : ''}${isToday ? ', leitura de hoje' : ''}`}
        style={styles.readingRow}
        onPress={() => router.push(`/devocional?id=${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.readingCopy}>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, isToday && styles.todayMeta]}>{isToday ? 'Hoje' : item.reference}</Text>
            {completed ? <Text style={styles.completed}>Concluída</Text> : null}
          </View>
          <Text style={styles.readingTitle}>{item.title}</Text>
          {isToday ? <Text style={styles.todayReference}>{item.reference}</Text> : null}
        </View>
        <Text style={styles.chevron} accessible={false}>›</Text>
      </TouchableOpacity>
    );
  }, [completedIds, router, styles, today.id]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        data={orderedReadings}
        keyExtractor={(item) => item.id}
        renderItem={renderReading}
        extraData={completedIds}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brand}>sopro</Text>
              <Text style={styles.collectionCount}>{dailyDevotionals.length} leituras</Text>
            </View>
            <Text accessibilityRole="header" style={styles.heading}>Leituras</Text>
            <Text style={styles.intro}>Uma leitura para cada dia do ano, para seguir no seu tempo.</Text>
            <View style={styles.listStart} />
          </View>
        )}
        ListFooterComponent={<Text style={styles.footerNote}>Você pode voltar a qualquer leitura quando quiser.</Text>}
      />
    </SafeAreaView>
  );
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 27, paddingTop: 15, paddingBottom: 36 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 42 },
  brand: { color: palette.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.7 },
  collectionCount: { color: palette.muted, fontSize: 12 },
  heading: { color: palette.ink, fontFamily: 'Georgia', fontSize: 36, lineHeight: 42 },
  intro: { color: palette.inkSoft, fontSize: 15, lineHeight: 23, marginTop: 9, marginBottom: 26 },
  listStart: { borderTopWidth: 1, borderTopColor: palette.line },
  readingRow: {
    minHeight: 83,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingCopy: { flex: 1, paddingRight: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  meta: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  todayMeta: { color: palette.plum },
  completed: { color: palette.moss, fontSize: 11, fontWeight: '600' },
  readingTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 18, lineHeight: 24 },
  todayReference: { color: palette.muted, fontSize: 12, marginTop: 4 },
  chevron: { color: palette.moss, fontSize: 25, lineHeight: 28, paddingLeft: 8 },
  footerNote: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 20 },
  });
}
