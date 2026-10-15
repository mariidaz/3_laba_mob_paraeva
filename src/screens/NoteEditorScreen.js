import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Screen from '../components/Screen';
import PageHeader from '../components/PageHeader';
import AlbumArtwork from '../components/AlbumArtwork';
import { removeNote, saveNote } from '../store/librarySlice';
import { COLORS, FONTS } from '../theme';
import { readAlbumParam } from '../navigation/albums';

const MOODS = ['Тепло', 'Ностальгія', 'Спокій', 'Енергія'];

export default function NoteEditorScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};
  const album = readAlbumParam(params.album);
  const dispatch = useDispatch();
  const existing = useSelector((state) => album ? state.library.notes[album.id] : null);
  const [text, setText] = useState(() => existing?.text || '');
  const [rating, setRating] = useState(() => existing?.rating || 0);
  const [mood, setMood] = useState(() => existing?.mood || '');

  const save = () => {
    if (!album) return;
    if (!text.trim()) {
      Alert.alert('Нотатка порожня', 'Додай кілька слів або видали попередній запис.', [
        { text: 'Повернутись', style: 'cancel' },
        ...(existing ? [{ text: 'Видалити', style: 'destructive', onPress: () => { dispatch(removeNote(album.id)); navigation.goBack(); } }] : []),
      ]);
      return;
    }
    dispatch(saveNote({ album, text, rating, mood }));
    navigation.goBack();
  };

  if (!album) {
    return <Screen edges={['top', 'bottom']} contentStyle={styles.safeContent}><PageHeader title="ТВОЯ НОТАТКА" /><Text style={styles.invalid}>Не вдалося завантажити альбом для нотатки.</Text><Pressable onPress={() => navigation.goBack()}><Text style={styles.clearText}>ПОВЕРНУТИСЬ</Text></Pressable></Screen>;
  }

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.safeContent}>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScroll}>
          <PageHeader title="ТВОЯ НОТАТКА" action={
            <Pressable onPress={save} accessibilityRole="button" accessibilityLabel="Зберегти нотатку" style={styles.saveAction}><Ionicons name="checkmark" size={19} color={COLORS.paper} /></Pressable>
          } />

        <View style={styles.albumLine}>
          <AlbumArtwork album={album} size={58} />
          <View style={styles.albumCopy}><Text style={styles.albumTitle} numberOfLines={2}>{album.title}</Text><Text style={styles.albumArtist} numberOfLines={1}>{album.artist}</Text></View>
        </View>

        <Text style={styles.label}>ЯК ТОБІ ЦЕЙ АЛЬБОМ?</Text>
        <View style={styles.rating}>
          {[1, 2, 3, 4, 5].map((value) => <Pressable key={value} onPress={() => setRating(value)} accessibilityRole="button" accessibilityLabel={`Оцінка ${value} з 5`} hitSlop={6}><Ionicons name={value <= rating ? 'star' : 'star-outline'} size={28} color={value <= rating ? COLORS.rust : COLORS.line} /></Pressable>)}
          {!!rating && <Pressable onPress={() => setRating(0)} style={styles.clearRating}><Text style={styles.clearText}>СКИНУТИ</Text></Pressable>}
        </View>

        <Text style={[styles.label, { marginTop: 26 }]}>НАСТРІЙ ПЛАТІВКИ</Text>
        <View style={styles.moods}>
          {MOODS.map((item) => <Pressable key={item} onPress={() => setMood(mood === item ? '' : item)} style={[styles.mood, mood === item && styles.moodActive]}><Text style={[styles.moodText, mood === item && styles.moodTextActive]}>{item}</Text></Pressable>)}
        </View>

        <Text style={[styles.label, { marginTop: 28 }]}>ЗАЛИШ СОБІ КІЛЬКА СЛІВ</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          maxLength={800}
          textAlignVertical="top"
          placeholder="Де ти був / була? Який трек не виходить з голови? Що хочеться запам’ятати?"
          placeholderTextColor={COLORS.muted}
          style={styles.input}
          accessibilityLabel="Текст нотатки про альбом"
        />
        <Text style={styles.counter}>{text.length} / 800</Text>

        <View style={styles.bottom}>
          <Text style={styles.privacy}><Ionicons name="lock-closed-outline" size={12} color={COLORS.muted} />  Зберігається лише на цьому пристрої</Text>
          <Pressable onPress={save} style={styles.saveButton}><Text style={styles.saveText}>ЗБЕРЕГТИ ВРАЖЕННЯ</Text><Ionicons name="arrow-forward" size={16} color={COLORS.paper} /></Pressable>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safeContent: { paddingTop: 10, paddingBottom: 0, flex: 1 },
  keyboard: { flex: 1 },
  formScroll: { flexGrow: 1, paddingBottom: 8 },
  saveAction: { width: 38, height: 38, borderRadius: 22, backgroundColor: COLORS.ink, alignItems: 'center', justifyContent: 'center' },
  albumLine: { flexDirection: 'row', gap: 13, alignItems: 'center', paddingVertical: 13, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.line },
  albumCopy: { flex: 1, gap: 5 },
  albumTitle: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 19, lineHeight: 23 },
  albumArtist: { color: COLORS.muted, fontFamily: FONTS.medium, fontSize: 11 },
  label: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 1.1, marginTop: 23 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  clearRating: { marginLeft: 5 },
  clearText: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.5 },
  moods: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  mood: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.paper },
  moodActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  moodText: { color: COLORS.ink, fontFamily: FONTS.medium, fontSize: 11 },
  moodTextActive: { color: COLORS.paper, fontFamily: FONTS.semibold },
  input: { minHeight: 120, maxHeight: 205, backgroundColor: COLORS.paperDark, borderRadius: 8, borderWidth: 1, borderColor: COLORS.line, padding: 14, color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 16, lineHeight: 23, marginTop: 11 },
  counter: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, textAlign: 'right', marginTop: 6 },
  bottom: { marginTop: 24 },
  privacy: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 9, textAlign: 'center', marginBottom: 14 },
  saveButton: { minHeight: 52, borderRadius: 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.ink },
  saveText: { color: COLORS.paper, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1 },
  invalid: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 13, lineHeight: 20, marginTop: 20, marginBottom: 14 },
});
