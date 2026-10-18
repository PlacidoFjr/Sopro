import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevotionalStore } from '../../src/context/devotional-store';
import { devotionals } from '../../src/data/devotionals';
import { colors, darkColors, type Palette } from '../../src/theme';

export default function SavedScreen() {
  const router = useRouter();
  const { savedIds, preferences } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const saved = devotionals.filter((item) => savedIds.includes(item.id));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>sopro</Text>
          <Text style={styles.count}>{saved.length} {saved.length === 1 ? 'leitura' : 'leituras'}</Text>
        </View>

        <Text accessibilityRole="header" style={styles.heading}>Salvos</Text>
        <Text style={styles.intro}>Leituras que você quer ter por perto.</Text>

        {saved.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyRule} />
            <Text style={styles.emptyTitle}>Um espaço para voltar</Text>
            <Text style={styles.emptyText}>
              Toque no coração de uma leitura para guardá-la aqui.
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.emptyButton}
              onPress={() => router.push('/devocional')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Abrir leitura de hoje</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {saved.map((item) => (
              <TouchableOpacity
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${item.title}, ${item.reference}`}
                style={styles.savedRow}
                onPress={() => router.push(`/devocional?id=${item.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.savedCopy}>
                  <Text style={styles.reference}>{item.reference}</Text>
                  <Text style={styles.savedTitle}>{item.title}</Text>
                </View>
                <Text style={styles.chevron} accessible={false}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 27, paddingTop: 15, paddingBottom: 36 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 42 },
  brand: { color: palette.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.7 },
  count: { color: palette.muted, fontSize: 12 },
  heading: { color: palette.ink, fontFamily: 'Georgia', fontSize: 36, lineHeight: 42 },
  intro: { color: palette.inkSoft, fontSize: 15, lineHeight: 23, marginTop: 9, marginBottom: 26 },
  list: { borderTopWidth: 1, borderTopColor: palette.line },
  savedRow: {
    minHeight: 78,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedCopy: { flex: 1, paddingRight: 14 },
  reference: { color: palette.moss, fontSize: 12, fontWeight: '600', marginBottom: 5 },
  savedTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 18, lineHeight: 24 },
  chevron: { color: palette.moss, fontSize: 25, lineHeight: 28, paddingLeft: 8 },
  emptyState: { alignItems: 'flex-start', marginTop: 35 },
  emptyRule: { width: 38, height: 2, backgroundColor: palette.yellow, marginBottom: 21 },
  emptyTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 24, lineHeight: 30 },
  emptyText: { maxWidth: 300, color: palette.inkSoft, fontSize: 15, lineHeight: 23, marginTop: 9 },
  emptyButton: { minHeight: 48, justifyContent: 'center', marginTop: 17, paddingRight: 12 },
  emptyButtonText: { color: palette.plum, fontSize: 14, fontWeight: '700' },
  });
}
