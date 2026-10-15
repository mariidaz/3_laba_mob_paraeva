import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';
import { COLORS, FONTS } from '../theme';

const PRINCIPLES = [
  ['01', 'Почуй уважніше', 'Відкривай альбоми й виконавців через каталог Apple Music.'],
  ['02', 'Збережи відчуття', 'Записуй настрій, оцінку й думки після прослуховування.'],
  ['03', 'Повернись пізніше', 'Твоя бібліотека й нотатки залишаються на цьому пристрої.'],
];

export default function AboutScreen() {
  const navigation = useNavigation();
  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Ionicons name="musical-notes" size={16} color={COLORS.accent} />
        </View>
        <Text style={styles.brand}>SIDE A <Text style={styles.slash}>/</Text> ПРО ПРОЄКТ</Text>
        <Text style={styles.edition}>№ 01</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>НЕ ПЛЕЙЛИСТ. ПАМ’ЯТЬ.</Text>
          <Text style={styles.heroTitle}>Музика{ '\n' }має <Text style={styles.heroItalic}>залишатись.</Text></Text>
          <Text style={styles.heroText}>SIDE A — місце для альбомів, що стали частиною твоєї історії.</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>МАНІФЕСТ · ТРИ КРОКИ</Text>
      {PRINCIPLES.map(([number, title, copy]) => (
        <View key={number} style={styles.principle}>
          <Text style={styles.principleNumber}>{number}</Text>
          <View style={styles.principleCopy}>
            <Text style={styles.principleTitle}>{title}</Text>
            <Text style={styles.principleText}>{copy}</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={COLORS.accent} />
        </View>
      ))}

      <View style={styles.quote}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.quoteText}>Найкращий альбом — той, який знаходить тебе в потрібний момент.</Text>
        <Text style={styles.quoteBy}>ЗАПИСКА НА ОБКЛАДИНЦІ</Text>
      </View>

      <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'DiscoverTab' })} style={styles.discoverLink}>
        <View>
          <Text style={styles.linkEyebrow}>ДАЛІ ДОСЛІДЖУЙ</Text>
          <Text style={styles.linkTitle}>Каталог альбомів</Text>
        </View>
        <View style={styles.linkArrow}>
          <Ionicons name="arrow-forward" size={18} color={COLORS.ink} />
        </View>
      </Pressable>

      <View style={styles.credits}>
        <Text style={styles.creditsText}>НАВЧАЛЬНИЙ ПРОЄКТ · REACT NATIVE + REDUX</Text>
        <Text style={styles.creditsText}>ЗРОБЛЕНО З УВАГОЮ ДО МУЗИКИ</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 35 },
  logo: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.paperDark, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  brand: { color: COLORS.ink, fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 1.1, flex: 1 },
  slash: { color: COLORS.accent, fontFamily: FONTS.serif },
  edition: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 9 },
  hero: { minHeight: 220, borderRadius: 8, backgroundColor: COLORS.ink, marginTop: 22, marginBottom: 28, padding: 24, justifyContent: 'center' },
  heroCopy: { width: '100%' },
  kicker: { color: COLORS.accent, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.2 },
  heroTitle: { color: COLORS.paper, fontFamily: FONTS.serif, fontSize: 34, lineHeight: 42, marginTop: 12 },
  heroItalic: { color: COLORS.accent, fontFamily: FONTS.serifItalic },
  heroText: { color: '#B3B3B3', fontFamily: FONTS.body, fontSize: 13, lineHeight: 20, marginTop: 12 },
  sectionLabel: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.2, marginBottom: 8 },
  principle: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.line },
  principleNumber: { color: COLORS.accent, fontFamily: FONTS.mono, fontSize: 10, paddingTop: 2 },
  principleCopy: { flex: 1, gap: 4 },
  principleTitle: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 18 },
  principleText: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 12, lineHeight: 18 },
  quote: { backgroundColor: COLORS.paperDark, borderRadius: 8, padding: 20, marginTop: 26, marginBottom: 22, borderLeftWidth: 3, borderLeftColor: COLORS.accent },
  quoteMark: { color: COLORS.accent, fontFamily: FONTS.serif, fontSize: 32, height: 26 },
  quoteText: { color: COLORS.ink, fontFamily: FONTS.serifItalic, fontSize: 18, lineHeight: 26 },
  quoteBy: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.8, marginTop: 14 },
  discoverLink: { minHeight: 74, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.line, paddingBottom: 15 },
  linkEyebrow: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 1 },
  linkTitle: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 20, marginTop: 3 },
  linkArrow: { width: 38, height: 38, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.paperDark, alignItems: 'center', justifyContent: 'center' },
  credits: { gap: 5, alignItems: 'center', paddingVertical: 24 },
  creditsText: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 7, letterSpacing: 0.6 },
});
