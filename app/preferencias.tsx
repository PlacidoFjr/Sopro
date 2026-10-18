import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDevotionalStore } from '../src/context/devotional-store';
import { cancelDailyReminder, scheduleDailyReminder } from '../src/notifications';
import { colors, darkColors, type Palette } from '../src/theme';

export default function PreferencesScreen() {
  const router = useRouter();
  const { preferences, updatePreferences } = useDevotionalStore();
  const palette = preferences.appearance === 'dark' ? darkColors : colors;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [busy, setBusy] = useState(false);
  const timeOperation = useRef(false);
  const hourText = String(preferences.reminderHour).padStart(2, '0');
  const minuteText = String(preferences.reminderMinute).padStart(2, '0');

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const toggleReminder = async () => {
    if (Platform.OS === 'web' || busy) return;
    setBusy(true);
    try {
      if (preferences.reminderEnabled) {
        await cancelDailyReminder();
        updatePreferences({ reminderEnabled: false });
        return;
      }

      const current = await (await import('expo-notifications')).getPermissionsAsync();
      const permission = current.granted
        ? current
        : await (await import('expo-notifications')).requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Notificações desativadas',
          'Permita notificações para receber seu lembrete diário nas configurações do aparelho.',
        );
        return;
      }

      await scheduleDailyReminder(preferences.reminderHour, preferences.reminderMinute);
      updatePreferences({ reminderEnabled: true });
    } catch {
      Alert.alert('Não foi possível atualizar o lembrete', 'Tente novamente em alguns instantes.');
    } finally {
      setBusy(false);
    }
  };

  const adjustTime = async (part: 'hour' | 'minute', amount: number) => {
    if (timeOperation.current) return;
    const nextHour = part === 'hour'
      ? (preferences.reminderHour + amount + 24) % 24
      : preferences.reminderHour;
    const nextMinute = part === 'minute'
      ? (preferences.reminderMinute + amount + 60) % 60
      : preferences.reminderMinute;

    if (preferences.reminderEnabled && Platform.OS !== 'web') {
      timeOperation.current = true;
      setBusy(true);
      try {
        await scheduleDailyReminder(nextHour, nextMinute);
      } catch {
        Alert.alert('Não foi possível alterar o horário', 'O horário anterior continua ativo.');
        setBusy(false);
        timeOperation.current = false;
        return;
      }
      setBusy(false);
      timeOperation.current = false;
    }
    updatePreferences({ reminderHour: nextHour, reminderMinute: nextMinute });
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.backButton}
          >
            <Text style={styles.backArrow} accessible={false}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.brand}>sopro</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text accessibilityRole="header" style={styles.title}>Preferências</Text>
        <Text style={styles.intro}>Deixe este momento confortável para a sua rotina.</Text>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>Lembrete diário</Text>
          <Text style={styles.description}>Um convite discreto para separar alguns minutos para a leitura.</Text>

          <View style={styles.reminderRow}>
            <View style={styles.reminderCopy}>
              <Text style={styles.reminderTitle}>Lembrar todos os dias</Text>
              <Text style={styles.reminderStatus}>
                {Platform.OS === 'web'
                  ? 'Disponível no app instalado no iPhone.'
                  : preferences.reminderEnabled
                    ? `Seu momento está marcado para ${hourText}:${minuteText}.`
                    : 'Desativado. Você escolhe se quer receber.'}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="switch"
              accessibilityLabel="Lembrete diário"
              accessibilityValue={{ text: preferences.reminderEnabled ? 'Ativado' : 'Desativado' }}
              accessibilityState={{ checked: preferences.reminderEnabled, disabled: Platform.OS === 'web' || busy }}
              disabled={Platform.OS === 'web' || busy}
              onPress={toggleReminder}
              hitSlop={7}
              style={[
                styles.switchTouchArea,
                (Platform.OS === 'web' || busy) && styles.controlDisabled,
              ]}
            >
              <View style={[styles.switchTrack, preferences.reminderEnabled && styles.switchTrackOn]}>
                <View style={[styles.switchKnob, preferences.reminderEnabled && styles.switchKnobOn]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.timePicker, !preferences.reminderEnabled && styles.timePickerQuiet]}>
            <Text style={styles.timeLabel}>Horário</Text>
            <View style={styles.timeControls}>
              <TimePart
                label="Hora"
                value={hourText}
                styles={styles}
                disabled={busy || Platform.OS === 'web'}
                onEarlier={() => void adjustTime('hour', -1)}
                onLater={() => void adjustTime('hour', 1)}
              />
              <Text style={styles.timeColon}>:</Text>
              <TimePart
                label="Minutos"
                value={minuteText}
                styles={styles}
                disabled={busy || Platform.OS === 'web'}
                onEarlier={() => void adjustTime('minute', -5)}
                onLater={() => void adjustTime('minute', 5)}
              />
            </View>
          </View>
          <Text style={styles.smallNote}>Os minutos avançam de cinco em cinco.</Text>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>Tamanho da leitura</Text>
          <Text style={styles.description}>Ajuste o texto dos devocionais para ler sem esforço.</Text>
          <View style={styles.sizeOptions}>
            <SizeOption
              title="Padrão"
              sample="Aa"
              selected={preferences.readingSize === 'normal'}
              onPress={() => updatePreferences({ readingSize: 'normal' })}
              styles={styles}
            />
            <SizeOption
              title="Maior"
              sample="Aa"
              selected={preferences.readingSize === 'large'}
              onPress={() => updatePreferences({ readingSize: 'large' })}
              styles={styles}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>Aparência</Text>
          <Text style={styles.description}>Escolha a luz que combina com este momento.</Text>
          <View style={styles.appearanceOptions}>
            <AppearanceOption
              title="Clara"
              symbol="☼"
              selected={preferences.appearance === 'light'}
              onPress={() => updatePreferences({ appearance: 'light' })}
              styles={styles}
            />
            <AppearanceOption
              title="Noturna"
              symbol="☾"
              selected={preferences.appearance === 'dark'}
              onPress={() => updatePreferences({ appearance: 'dark' })}
              styles={styles}
            />
          </View>
        </View>

        <Text style={styles.privacyNote}>Suas preferências ficam guardadas neste aparelho.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function TimePart({
  label,
  value,
  disabled,
  onEarlier,
  onLater,
  styles,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onEarlier: () => void;
  onLater: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.timePart}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Diminuir ${label.toLowerCase()}`}
        accessibilityState={{ disabled }}
        hitSlop={3}
        disabled={disabled}
        onPress={onEarlier}
        style={styles.timeStep}
      >
        <Text style={styles.timeStepText} accessible={false}>−</Text>
      </TouchableOpacity>
      <Text accessibilityLabel={value} style={styles.timeValue}>{value}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Aumentar ${label.toLowerCase()}`}
        accessibilityState={{ disabled }}
        hitSlop={3}
        disabled={disabled}
        onPress={onLater}
        style={styles.timeStep}
      >
        <Text style={styles.timeStepText} accessible={false}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function SizeOption({
  title,
  sample,
  selected,
  onPress,
  styles,
}: {
  title: string;
  sample: string;
  selected: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityLabel={`${title}, tamanho da leitura`}
      accessibilityState={{ checked: selected, selected }}
      aria-checked={selected}
      onPress={onPress}
      style={[styles.sizeOption, selected && styles.sizeOptionSelected]}
      activeOpacity={0.8}
    >
      <Text accessible={false} style={[styles.sizeSample, title === 'Maior' && styles.sizeSampleLarge]}>{sample}</Text>
      <Text style={[styles.sizeTitle, selected && styles.sizeTitleSelected]}>{title}</Text>
      {selected ? <Text accessible={false} style={styles.selectedMark}>Selecionado</Text> : null}
    </TouchableOpacity>
  );
}

function AppearanceOption({
  title,
  symbol,
  selected,
  onPress,
  styles,
}: {
  title: string;
  symbol: string;
  selected: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="radio"
      accessibilityLabel={`${title}, aparência`}
      accessibilityState={{ checked: selected, selected }}
      aria-checked={selected}
      onPress={onPress}
      style={[styles.appearanceOption, selected && styles.appearanceOptionSelected]}
      activeOpacity={0.8}
    >
      <Text accessible={false} style={styles.appearanceSymbol}>{symbol}</Text>
      <Text style={[styles.sizeTitle, selected && styles.sizeTitleSelected]}>{title}</Text>
      {selected ? <Text accessible={false} style={styles.selectedMark}>Selecionada</Text> : null}
    </TouchableOpacity>
  );
}

function createStyles(palette: Palette) {
 return StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.paper },
  content: { paddingHorizontal: 27, paddingTop: 13, paddingBottom: 38 },
  header: { flexDirection: 'row', alignItems: 'center', height: 48, marginBottom: 29 },
  backButton: { width: 44, height: 44, borderRadius: 4, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: palette.ink, fontSize: 31, lineHeight: 35, marginTop: -3 },
  brand: { flex: 1, textAlign: 'center', color: palette.ink, fontSize: 19, fontWeight: '700', letterSpacing: -0.5 },
  headerSpacer: { width: 44 },
  title: { color: palette.ink, fontFamily: 'Georgia', fontSize: 35, lineHeight: 42 },
  intro: { color: palette.inkSoft, fontSize: 15, lineHeight: 23, marginTop: 8, marginBottom: 30 },
  section: { borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 22, paddingBottom: 25 },
  sectionTitle: { color: palette.plum, fontSize: 15, fontWeight: '700', marginBottom: 7 },
  description: { color: palette.inkSoft, fontSize: 14, lineHeight: 21, marginBottom: 18, maxWidth: 330 },
  reminderRow: { flexDirection: 'row', alignItems: 'center', minHeight: 62, borderBottomWidth: 1, borderBottomColor: palette.line, paddingBottom: 12 },
  reminderCopy: { flex: 1, paddingRight: 16 },
  reminderTitle: { color: palette.ink, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  reminderStatus: { color: palette.muted, fontSize: 12, lineHeight: 17 },
  switchTouchArea: { width: 64, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  switchTrack: { width: 50, height: 30, borderRadius: 15, padding: 3, backgroundColor: palette.line, justifyContent: 'center' },
  switchTrackOn: { backgroundColor: palette.moss },
  switchKnob: { width: 24, height: 24, borderRadius: 12, backgroundColor: palette.white, alignSelf: 'flex-start' },
  switchKnobOn: { alignSelf: 'flex-end' },
  controlDisabled: { opacity: 0.65 },
  timePicker: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 17 },
  timePickerQuiet: { opacity: 0.78 },
  timeLabel: { color: palette.ink, fontSize: 14, fontWeight: '600' },
  timeControls: { flexDirection: 'row', alignItems: 'center' },
  timePart: { flexDirection: 'row', alignItems: 'center' },
  timeStep: { width: 38, height: 40, alignItems: 'center', justifyContent: 'center' },
  timeStepText: { color: palette.moss, fontSize: 23, lineHeight: 26 },
  timeValue: { color: palette.ink, fontFamily: 'Georgia', fontSize: 21, minWidth: 27, textAlign: 'center', fontVariant: ['tabular-nums'] },
  timeColon: { color: palette.ink, fontSize: 19, marginHorizontal: 2 },
  smallNote: { color: palette.muted, fontSize: 11, textAlign: 'right', marginTop: 2 },
  sizeOptions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: palette.line },
  sizeOption: { flex: 1, minHeight: 105, borderBottomWidth: 1, borderBottomColor: palette.line, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  sizeOptionSelected: { backgroundColor: palette.mossLight },
  sizeSample: { color: palette.ink, fontFamily: 'Georgia', fontSize: 22, lineHeight: 27, marginBottom: 6 },
  sizeSampleLarge: { fontSize: 29, lineHeight: 32 },
  sizeTitle: { color: palette.inkSoft, fontSize: 13, fontWeight: '600' },
  sizeTitleSelected: { color: palette.ink },
  selectedMark: { color: palette.moss, fontSize: 10, marginTop: 4 },
  appearanceOptions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: palette.line },
  appearanceOption: { flex: 1, minHeight: 92, borderBottomWidth: 1, borderBottomColor: palette.line, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  appearanceOptionSelected: { backgroundColor: palette.mossLight },
  appearanceSymbol: { color: palette.moss, fontFamily: 'Georgia', fontSize: 26, lineHeight: 30, marginBottom: 7 },
  privacyNote: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 11 },
 });
}
