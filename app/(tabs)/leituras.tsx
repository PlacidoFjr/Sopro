import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevotionalStore } from '../../src/context/devotional-store';
import { dailyDevotionals, formatToday, getTodayDevotional } from '../../src/data/devotionals';
import { colors, darkColors, type Palette } from '../../src/theme';

export default function ReadingsScreen() {
  const router = useRouter();
  const { completedIds, preferences } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const today = getTodayDevotional();
  const completedCount = dailyDevotionals.filter((item) => completedIds.includes(item.id)).length;
  const todayIsCompleted = completedIds.includes(today.id);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <Text style={styles.brand}>sopro</Text>
          <Text style={styles.date}>{formatToday()}</Text>
        </View>

        <Text accessibilityRole="header" style={styles.heading}>Leituras</Text>
        <Text style={styles.intro}>Um encontro com a Palavra, um dia de cada vez.</Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Abrir leitura de hoje: ${today.title}, ${today.reference}${todayIsCompleted ? ', concluída' : ''}`}
          style={styles.todayCard}
          onPress={() => router.push(`/devocional?id=${today.id}`)}
          activeOpacity={0.82}
        >
          <View style={styles.todayTopline}>
            <View style={styles.todayMarker} />
            <Text style={styles.todayLabel}>LEITURA DE HOJE</Text>
            {todayIsCompleted ? <Text style={styles.todayDone}>Concluída</Text> : null}
          </View>
          <Text style={styles.todayTitle}>{today.title}</Text>
          <Text style={styles.todayReference}>{today.reference}</Text>
          <View style={styles.cardDivider} />
          <View style={styles.cardActionRow}>
            <Text style={styles.cardAction}>{todayIsCompleted ? 'Ler novamente' : 'Começar leitura'}</Text>
            <Text style={styles.cardChevron} accessible={false}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.note}>
          <Text style={styles.noteMark} accessible={false}>✦</Text>
          <View style={styles.noteCopy}>
            <Text style={styles.noteTitle}>Sem pressa</Text>
            <Text style={styles.noteText}>
              A leitura de cada dia espera por você quando for o momento. Siga no seu ritmo.
            </Text>
          </View>
        </View>

        <View style={styles.progressSummary}>
          <View style={styles.progressRule} />
          <Text style={styles.progressText}>
            {completedCount === 0
              ? 'Sua caminhada começa com a leitura de hoje.'
              : `${completedCount} ${completedCount === 1 ? 'leitura concluída' : 'leituras concluídas'} no seu ritmo.`}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: palette.paper },
    content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 27, paddingTop: 15, paddingBottom: 36 },
    brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 },
    brand: { color: palette.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.7 },
    date: { color: palette.muted, fontSize: 12 },
    heading: { color: palette.ink, fontFamily: 'Georgia', fontSize: 36, lineHeight: 42 },
    intro: { color: palette.inkSoft, fontSize: 15, lineHeight: 23, marginTop: 8, marginBottom: 25 },
    todayCard: { backgroundColor: palette.ink, borderRadius: 8, paddingHorizontal: 21, paddingTop: 19, paddingBottom: 14 },
    todayTopline: { minHeight: 17, flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    todayMarker: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.yellow, marginRight: 9 },
    todayLabel: { color: palette.mossLight, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    todayDone: { color: palette.yellow, fontSize: 11, fontWeight: '600', marginLeft: 'auto' },
    todayTitle: { color: palette.white, fontFamily: 'Georgia', fontSize: 26, lineHeight: 33, maxWidth: 590 },
    todayReference: { color: palette.mossLight, fontSize: 13, marginTop: 8 },
    cardDivider: { height: 1, backgroundColor: palette.moss, opacity: 0.75, marginTop: 20 },
    cardActionRow: { minHeight: 41, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardAction: { color: palette.white, fontSize: 14, fontWeight: '600' },
    cardChevron: { color: palette.yellow, fontSize: 24, lineHeight: 28 },
    note: { flexDirection: 'row', alignItems: 'flex-start', borderLeftWidth: 2, borderLeftColor: palette.yellow, paddingLeft: 16, marginTop: 31, maxWidth: 580 },
    noteMark: { color: palette.moss, fontSize: 14, marginRight: 11, marginTop: 1 },
    noteCopy: { flex: 1 },
    noteTitle: { color: palette.ink, fontFamily: 'Georgia', fontSize: 18, lineHeight: 24 },
    noteText: { color: palette.inkSoft, fontSize: 14, lineHeight: 22, marginTop: 5 },
    progressSummary: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
    progressRule: { width: 28, height: 1, backgroundColor: palette.line, marginRight: 11 },
    progressText: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  });
}
