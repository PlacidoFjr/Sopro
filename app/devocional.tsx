import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevotionalStore, type JournalNote } from '../src/context/devotional-store';
import { devotionals, getTodayDevotional } from '../src/data/devotionals';
import { colors, darkColors, type Palette } from '../src/theme';

export default function DevotionalScreen() {
  const router = useRouter();
  const { id, write } = useLocalSearchParams<{ id?: string; write?: string }>();
  const today = getTodayDevotional();
  const devotional = devotionals.find((item) => item.id === id) ?? today;
  const isToday = devotional.id === today.id;
  const { savedIds, completedIds, notes, hydrated, preferences, toggleSaved, toggleCompleted, saveNote, removeNote } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const textScale = preferences.readingSize === 'large' ? 1.18 : 1;
  const saved = savedIds.includes(devotional.id);
  const completed = completedIds.includes(devotional.id);
  const note = notes[devotional.id];
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} accessibilityRole="button" accessibilityLabel="Voltar" style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerBrand}>sopro</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remover dos salvos' : 'Salvar devocional'}
            accessibilityState={{ selected: saved }}
            onPress={() => toggleSaved(devotional.id)}
            style={styles.saveButton}
          >
            <Text style={[styles.saveIcon, saved && styles.saveIconActive]}>{saved ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.labelRow}>
          <Text style={styles.label}>{isToday ? 'Leitura de hoje' : 'Leitura guardada'}</Text>
          <Text style={styles.duration}>5 min</Text>
        </View>
        <Text accessibilityRole="header" style={[styles.title, { fontSize: 35 * textScale, lineHeight: 42 * textScale }]}>{devotional.title}</Text>
        <Text style={styles.reference}>{devotional.reference}</Text>

        <View style={styles.readingBlock}>
          <Text style={styles.sectionLabel}>Sobre o texto</Text>
          <Text style={[styles.readingText, { fontSize: 18 * textScale, lineHeight: 29 * textScale }]}>{devotional.reading}</Text>
          <Text style={styles.readingFootText}>Leia também {devotional.reference} na sua Bíblia.</Text>
        </View>

        {devotional.questions ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Para refletir</Text>
            <ReflectionPrompt label="O que isso muda na sua oração?" text={devotional.questions.ramifications} styles={styles} textScale={textScale} />
            <ReflectionPrompt label="Há algo a rever?" text={devotional.questions.repentance} styles={styles} textScale={textScale} />
            <ReflectionPrompt label="Pelo que agradecer?" text={devotional.questions.rejoice} styles={styles} textScale={textScale} />
            <ReflectionPrompt label="O que pedir a Deus?" text={devotional.questions.request} styles={styles} textScale={textScale} />
          </View>
        ) : devotional.reflection ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Para refletir</Text>
            <Text style={[styles.bodyText, { fontSize: 17 * textScale, lineHeight: 27 * textScale }]}>{devotional.reflection}</Text>
          </View>
        ) : null}

        {write === '1' && hydrated ? (
          <JournalEditor
            key={devotional.id}
            devotionalId={devotional.id}
            note={note}
            textScale={textScale}
            palette={palette}
            styles={styles}
            onSave={saveNote}
            onRemove={removeNote}
          />
        ) : null}

        {devotional.practice ? (
          <View style={styles.practiceBlock}>
            <Text style={styles.practiceLabel}>Um passo possível</Text>
            <Text style={[styles.practiceText, { fontSize: 15 * textScale, lineHeight: 24 * textScale }]}>{devotional.practice}</Text>
          </View>
        ) : null}

        {devotional.prayer ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Uma oração</Text>
            <Text style={[styles.prayerText, { fontSize: 17 * textScale, lineHeight: 27 * textScale }]}>{devotional.prayer}</Text>
          </View>
        ) : null}

        {devotional.supportingReferences?.length ? (
          <View style={styles.relatedReadings}>
            <Text style={styles.sectionLabel}>Leituras relacionadas</Text>
            <Text style={styles.relatedText}>{devotional.supportingReferences.join(' · ')}</Text>
            <Text style={styles.readingFootText}>As referências apontam para a sua Bíblia; o texto bíblico não é reproduzido aqui.</Text>
          </View>
        ) : null}

        {devotional.source === 'christ-himself' ? (
          <Link href="https://christhimself.com/terms/" style={styles.sourceCredit}>
            Traduzido e adaptado da edição matinal de Christ Himself. Fonte e licença CC BY-NC-SA 4.0.
          </Link>
        ) : null}

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={completed ? 'Desmarcar leitura concluída' : isToday ? 'Concluir leitura de hoje' : 'Marcar leitura como concluída'}
          accessibilityState={{ selected: completed }}
          style={[styles.completeButton, completed && styles.completeButtonDone]}
          onPress={() => toggleCompleted(devotional.id)}
          activeOpacity={0.86}
        >
          <Text style={[styles.completeButtonText, completed && styles.completeButtonTextDone]}>
            {completed ? 'Desmarcar conclusão' : isToday ? 'Concluir leitura de hoje' : 'Marcar como concluída'}
          </Text>
          <Text style={[styles.completeCheck, completed && styles.completeCheckDone]} accessible={false}>{completed ? '✓' : '○'}</Text>
        </TouchableOpacity>
        <Text style={styles.closingNote}>
          {isToday ? 'Siga no seu ritmo. Amanhã haverá um novo momento.' : 'Você pode voltar a esta leitura sempre que quiser.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReflectionPrompt({
  label,
  text,
  styles,
  textScale,
}: {
  label: string;
  text: string;
  styles: ReturnType<typeof createStyles>;
  textScale: number;
}) {
  return (
    <View style={styles.prompt}>
      <Text style={styles.promptLabel}>{label}</Text>
      <Text style={[styles.bodyText, { fontSize: 16 * textScale, lineHeight: 25 * textScale }]}>{text}</Text>
    </View>
  );
}

function JournalEditor({
  devotionalId,
  note,
  textScale,
  palette,
  styles,
  onSave,
  onRemove,
}: {
  devotionalId: string;
  note?: JournalNote;
  textScale: number;
  palette: Palette;
  styles: ReturnType<typeof createStyles>;
  onSave: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}) {
  const [draft, setDraft] = useState(note?.text ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <View style={styles.journalSection}>
      <Text accessibilityRole="header" style={styles.sectionLabel}>O que ficou com você?</Text>
      <Text style={styles.journalHint}>Escreva uma ideia, uma pergunta ou uma oração.</Text>
      <TextInput
        accessibilityLabel="Sua anotação sobre esta leitura"
        accessibilityHint="A anotação fica guardada neste aparelho."
        multiline
        maxLength={5000}
        value={draft}
        onChangeText={(value) => {
          setDraft(value);
          setConfirmDelete(Boolean(note && !value.trim()));
          if (value.trim()) onSave(devotionalId, value);
        }}
        placeholder="Escreva com liberdade…"
        placeholderTextColor={palette.muted}
        style={[styles.journalInput, { fontSize: 16 * textScale, lineHeight: 24 * textScale }]}
        textAlignVertical="top"
        returnKeyType="default"
      />
      <Text style={styles.localNote}>
        {note && !draft.trim()
          ? 'A anotação original continua guardada. Confirme abaixo para apagá-la.'
          : note
            ? 'Alterações salvas automaticamente neste aparelho.'
            : 'Sua primeira frase é salva automaticamente neste aparelho.'}
      </Text>

      {note ? (
        <>
          {!confirmDelete ? (
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.deleteNoteButton}
              onPress={() => setConfirmDelete(true)}
              activeOpacity={0.75}
            >
              <Text style={styles.deleteNoteText}>Apagar anotação</Text>
            </TouchableOpacity>
          ) : null}
          {confirmDelete ? (
            <View style={styles.confirmDelete}>
              <Text style={styles.confirmDeleteText}>Apagar esta anotação? Essa ação não pode ser desfeita.</Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => {
                    setDraft(note.text);
                    setConfirmDelete(false);
                  }}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmKeep}>Manter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => {
                    onRemove(devotionalId);
                    setDraft('');
                    setConfirmDelete(false);
                  }}
                  style={styles.confirmButton}
                >
                  <Text style={styles.confirmRemove}>Apagar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function createStyles(palette: Palette) {
  return StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.paper },
  content: { width: '100%', maxWidth: 850, alignSelf: 'center', paddingHorizontal: 27, paddingTop: 13, paddingBottom: 44 },
  header: { flexDirection: 'row', alignItems: 'center', height: 48, marginBottom: 30 },
  backButton: { width: 44, height: 44, borderRadius: 4, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: palette.ink, fontSize: 31, lineHeight: 35, marginTop: -3 },
  headerBrand: { flex: 1, textAlign: 'center', color: palette.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.5 },
  saveButton: { width: 44, height: 44, borderRadius: 4, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' },
  saveIcon: { color: palette.ink, fontSize: 24, lineHeight: 28 },
  saveIconActive: { color: palette.danger },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 13 },
  label: { color: palette.plum, fontSize: 13, fontWeight: '600' },
  duration: { color: palette.muted, fontSize: 12, marginLeft: 'auto' },
  title: { color: palette.ink, fontFamily: 'Georgia', fontSize: 35, lineHeight: 42, letterSpacing: -0.7, maxWidth: 660 },
  reference: { color: palette.moss, fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 31 },
  readingBlock: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.line, paddingVertical: 19, marginBottom: 28 },
  sectionLabel: { color: palette.plum, fontSize: 13, fontWeight: '700', marginBottom: 11 },
  readingText: { color: palette.inkSoft, fontFamily: 'Georgia', fontSize: 18, lineHeight: 29 },
  readingFootText: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 13 },
  section: { marginBottom: 28 },
  bodyText: { color: palette.inkSoft, fontSize: 17, lineHeight: 27 },
  prompt: { marginBottom: 18 },
  promptLabel: { color: palette.moss, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  relatedReadings: { borderTopWidth: 1, borderColor: palette.line, paddingTop: 18, marginBottom: 24 },
  relatedText: { color: palette.inkSoft, fontSize: 14, lineHeight: 22 },
  sourceCredit: { color: palette.muted, fontSize: 11, lineHeight: 17, marginBottom: 24 },
  practiceBlock: { borderLeftWidth: 2, borderLeftColor: palette.yellow, paddingLeft: 16, marginBottom: 28 },
  practiceLabel: { color: palette.plum, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  practiceText: { color: palette.inkSoft, fontSize: 15, lineHeight: 24 },
  prayerText: { color: palette.inkSoft, fontFamily: 'Georgia', fontSize: 17, lineHeight: 27, fontStyle: 'italic' },
  journalSection: { marginBottom: 29 },
  journalHint: { color: palette.inkSoft, fontSize: 14, lineHeight: 21, marginTop: -2, marginBottom: 11 },
  journalInput: {
    minHeight: 144,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
    color: palette.ink,
    fontSize: 16,
    lineHeight: 24,
    padding: 14,
  },
  localNote: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 8 },
  deleteNoteButton: { minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  deleteNoteText: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  confirmDelete: { backgroundColor: palette.mossLight, padding: 14, marginTop: 7 },
  confirmDeleteText: { color: palette.ink, fontSize: 13, lineHeight: 19 },
  confirmActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  confirmButton: { minHeight: 42, justifyContent: 'center', paddingHorizontal: 12 },
  confirmKeep: { color: palette.plum, fontSize: 13, fontWeight: '600' },
  confirmRemove: { color: palette.danger, fontSize: 13, fontWeight: '700' },
  completeButton: { minHeight: 54, borderRadius: 4, backgroundColor: palette.ink, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  completeButtonDone: { backgroundColor: palette.mossLight },
  completeButtonText: { color: palette.paper, fontSize: 15, fontWeight: '700' },
  completeButtonTextDone: { color: palette.ink },
  completeCheck: { color: palette.yellow, fontSize: 22 },
  completeCheckDone: { color: palette.moss, fontWeight: '700' },
  closingNote: { textAlign: 'center', color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 14 },
  });
}
