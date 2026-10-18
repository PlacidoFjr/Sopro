import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevotionalStore } from '../../src/context/devotional-store';
import { formatToday, getTodayDevotional } from '../../src/data/devotionals';
import { colors, darkColors, type Palette } from '../../src/theme';

export default function TodayScreen() {
  const router = useRouter();
  const today = getTodayDevotional();
  const { completedIds, preferences } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const completed = completedIds.includes(today.id);
  const textScale = preferences.readingSize === 'large' ? 1.18 : 1;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      >
        <View style={styles.topRow}>
          <View style={styles.brand}>
            <BranchMark palette={palette} styles={styles} />
            <Text style={styles.brandName}>sopro</Text>
          </View>
          <View style={styles.topActions}>
            <Text style={styles.date}>{formatToday()}</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Abrir preferências"
              onPress={() => router.push('/preferencias')}
              style={styles.preferencesButton}
            >
              <Text style={styles.preferencesIcon} accessible={false}>Aa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.readingHeading}>
          <Text style={styles.eyebrow}>Leitura do dia</Text>
          <Text accessibilityRole="header" style={[styles.title, { fontSize: 37 * textScale, lineHeight: 43 * textScale }]}>{today.title}</Text>
          <Text style={styles.reference}>{today.reference}</Text>
        </View>

        <View style={styles.motifRow} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={styles.rule} />
          <BranchMark large palette={palette} styles={styles} />
          <View style={styles.rule} />
        </View>

        <View style={styles.passage}>
          <Text style={styles.sectionLabel}>Sobre o texto</Text>
          <Text style={[styles.passageText, { fontSize: 18 * textScale, lineHeight: 29 * textScale }]}>{today.reading}</Text>
          <Text style={styles.passageNote}>Leia também {today.reference} na sua Bíblia.</Text>
        </View>

        <View style={styles.reflection}>
          <Text style={styles.sectionLabel}>Para levar com você</Text>
          <Text style={[styles.reflectionText, { fontSize: 15 * textScale, lineHeight: 24 * textScale }]}>
            {today.reflection ?? today.questions?.rejoice ?? today.reading}
          </Text>
        </View>

        <View style={styles.actionArea}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={completed ? 'Ler novamente o devocional de hoje' : 'Abrir devocional de hoje'}
            style={styles.openButton}
            onPress={() => router.push('/devocional')}
            activeOpacity={0.8}
          >
            <Text style={styles.openButtonText}>{completed ? 'Voltar à leitura' : 'Continuar leitura'}</Text>
            <Text style={styles.openButtonArrow} accessible={false}>↗</Text>
          </TouchableOpacity>
          <Text style={styles.closingNote}>
            {completed ? 'A leitura continua aqui quando você quiser.' : 'Um momento seu, sem pressa.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BranchMark({ large = false, palette, styles }: { large?: boolean; palette: Palette; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={[styles.branch, large && styles.branchLarge]}>
      <View style={[styles.stem, large && styles.stemLarge, { backgroundColor: palette.moss }]} />
      <View style={[styles.leaf, styles.leafLeft, large && styles.leafLarge]} />
      <View style={[styles.leaf, styles.leafRight, large && styles.leafLarge]} />
      <View style={[styles.leaf, styles.leafUpper, large && styles.leafUpperLarge]} />
    </View>
  );
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 27, paddingTop: 13, paddingBottom: 36 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 47 },
  brand: { flexDirection: 'row', alignItems: 'center' },
  brandName: { marginLeft: 9, color: palette.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.7 },
  date: { color: palette.muted, fontSize: 12, fontWeight: '500' },
  topActions: { flexDirection: 'row', alignItems: 'center' },
  preferencesButton: { width: 42, height: 42, borderRadius: 4, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  preferencesIcon: { color: palette.ink, fontFamily: 'Georgia', fontSize: 18, fontWeight: '600' },
  readingHeading: { alignItems: 'flex-start' },
  eyebrow: { color: palette.plum, fontSize: 13, fontWeight: '600', marginBottom: 13 },
  title: {
    maxWidth: 340,
    color: palette.ink,
    fontFamily: 'Georgia',
    fontSize: 37,
    lineHeight: 43,
    letterSpacing: -0.8,
  },
  reference: { color: palette.moss, fontSize: 14, fontWeight: '600', marginTop: 12 },
  motifRow: { flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 28 },
  rule: { flex: 1, height: 1, backgroundColor: palette.line },
  branch: { width: 26, height: 26, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  branchLarge: { width: 32, height: 32, marginHorizontal: 15 },
  stem: { position: 'absolute', width: 1.5, height: 18, backgroundColor: palette.moss, transform: [{ rotate: '25deg' }] },
  stemLarge: { height: 22, width: 2 },
  leaf: { position: 'absolute', width: 7, height: 4, borderRadius: 7, backgroundColor: palette.moss },
  leafLarge: { width: 9, height: 5 },
  leafLeft: { left: 5, top: 11, transform: [{ rotate: '35deg' }] },
  leafRight: { right: 5, top: 15, transform: [{ rotate: '-35deg' }] },
  leafUpper: { right: 6, top: 5, transform: [{ rotate: '-35deg' }] },
  leafUpperLarge: { right: 7, top: 5 },
  passage: { marginBottom: 29 },
  sectionLabel: { color: palette.plum, fontSize: 13, fontWeight: '700', marginBottom: 11 },
  passageText: { color: palette.inkSoft, fontFamily: 'Georgia', fontSize: 18, lineHeight: 29 },
  passageNote: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 13 },
  reflection: { borderLeftWidth: 2, borderLeftColor: palette.yellow, paddingLeft: 16, marginBottom: 29 },
  reflectionText: { color: palette.ink, fontSize: 15, lineHeight: 24 },
  actionArea: { alignItems: 'flex-start' },
  openButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 5,
    backgroundColor: palette.ink,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  openButtonText: { color: palette.paper, fontSize: 15, fontWeight: '600' },
  openButtonArrow: { color: palette.yellow, fontSize: 20, lineHeight: 24 },
  closingNote: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 12 },
  });
}
