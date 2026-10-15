import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Screen from '../components/Screen';
import AlbumRow from '../components/AlbumRow';
import AlbumArtwork from '../components/AlbumArtwork';
import SectionHeading from '../components/SectionHeading';
import { COLORS, FONTS } from '../theme';

export default function JournalScreen() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState('saved');
  const { savedAlbums, notes } = useSelector((state) => state.library);
  const noteList = useMemo(() => Object.values(notes).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [notes]);
  const items = filter === 'saved' ? savedAlbums : noteList.map((note) => note.album);

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.topline}>
        <Text style={styles.wordmark}>SIDE A <Text style={styles.slash}>/</Text> ЩОДЕННИК</Text>
        <Ionicons name="library-outline" size={19} color={COLORS.ink} />
      </View>
      <Text style={styles.kicker}>ТВОЯ КОЛЕКЦІЯ · {String(savedAlbums.length).padStart(2, '0')} ПЛАТІВОК</Text>
      <Text style={styles.headline}>Залиш собі{ '\n' }<Text style={styles.italic}>те, що звучить.</Text></Text>

      <View style={styles.switcher}>
        <Pressable onPress={() => setFilter('saved')} style={[styles.switchOption, filter === 'saved' && styles.switchActive]}>
          <Text style={[styles.switchText, filter === 'saved' && styles.switchTextActive]}>ЗБЕРЕЖЕНІ · {savedAlbums.length}</Text>
        </Pressable>
        <Pressable onPress={() => setFilter('notes')} style={[styles.switchOption, filter === 'notes' && styles.switchActive]}>
          <Text style={[styles.switchText, filter === 'notes' && styles.switchTextActive]}>НОТАТКИ · {noteList.length}</Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyDisc}>
            <Ionicons name={filter === 'saved' ? 'library-outline' : 'create-outline'} size={24} color={COLORS.accent} />
          </View>
          <Text style={styles.emptyTitle}>{filter === 'saved' ? 'Тут ще є місце.' : 'Поки без записів.'}</Text>
          <Text style={styles.emptyCopy}>{filter === 'saved' ? 'Зберігай альбоми, до яких захочеться повернутись.' : 'Додай перші враження з екрана альбому.'}</Text>
          <Pressable onPress={() => navigation.navigate('MainTabs', { screen: 'DiscoverTab' })} style={styles.emptyLink}>
            <Text style={styles.emptyLinkText}>ЗНАЙТИ МУЗИКУ</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.ink} />
          </Pressable>
        </View>
      ) : (
        <>
          <SectionHeading eyebrow={filter === 'saved' ? 'ПОВЕРНУТИСЬ ДО НИХ' : 'ТВОЇ ВРАЖЕННЯ'} title={filter === 'saved' ? 'У бібліотеці' : 'Слухав / слухала'} />
          {filter === 'saved' ? items.map((album) => (
            <AlbumRow key={album.id} album={album} onPress={() => navigation.navigate('AlbumDetail', { album })} />
          )) : noteList.map((note) => (
            <Pressable key={note.album.id} onPress={() => navigation.navigate('AlbumDetail', { album: note.album })} style={styles.noteCard}>
              <View style={styles.noteCover}><AlbumArtwork album={note.album} size={54} /></View>
              <View style={styles.noteBody}>
                <View style={styles.noteHead}>
                  <Text numberOfLines={1} style={styles.noteAlbum}>{note.album.title}</Text>
                  <Text style={styles.stars}>{'★'.repeat(note.rating || 0)}</Text>
                </View>
                <Text numberOfLines={2} style={styles.noteText}>{note.text}</Text>
                <Text style={styles.noteDate}>{note.mood ? `${note.mood.toUpperCase()}  ·  ` : ''}{new Date(note.updatedAt).toLocaleDateString('uk-UA')}</Text>
              </View>
            </Pressable>
          ))}
        </>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerCopy}>ТВОЯ МУЗИКА. ТВОЯ ПАМ’ЯТЬ.</Text>
        <View style={styles.footerRule} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 10, paddingBottom: 24 },
  topline: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { color: COLORS.ink, fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 1.2 },
  slash: { color: COLORS.accent, fontFamily: FONTS.serif },
  kicker: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.1, marginTop: 28 },
  headline: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 36, lineHeight: 43, marginTop: 8, marginBottom: 24 },
  italic: { color: COLORS.accent, fontFamily: FONTS.serifItalic },
  switcher: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.line, marginBottom: 20 },
  switchOption: { paddingBottom: 11, marginRight: 22, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  switchActive: { borderBottomColor: COLORS.accent },
  switchText: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 0.5 },
  switchTextActive: { color: COLORS.ink, fontFamily: FONTS.semibold },
  empty: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 30, paddingBottom: 35, borderRadius: 8, backgroundColor: COLORS.paperDark },
  emptyDisc: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.accentMuted, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyTitle: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 22 },
  emptyCopy: { color: COLORS.muted, fontFamily: FONTS.body, fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 8, maxWidth: 240 },
  emptyLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18, backgroundColor: COLORS.paper, borderWidth: 1, borderColor: COLORS.line },
  emptyLinkText: { color: COLORS.ink, fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1 },
  noteCard: { flexDirection: 'row', gap: 13, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.line },
  noteCover: { paddingTop: 2 },
  noteBody: { flex: 1 },
  noteHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noteAlbum: { flex: 1, color: COLORS.ink, fontFamily: FONTS.semibold, fontSize: 12 },
  stars: { color: COLORS.accent, fontSize: 11, letterSpacing: 1 },
  noteText: { color: COLORS.ink, fontFamily: FONTS.serif, fontSize: 14, lineHeight: 20, marginTop: 7 },
  noteDate: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.5, marginTop: 7 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 40, marginBottom: 10 },
  footerCopy: { color: COLORS.muted, fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.7 },
  footerRule: { flex: 1, height: 1, backgroundColor: COLORS.line },
});
