import { CORE_TAGS } from '@city-picks/shared';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const demoCards = [
  { title: 'Indie night at a neighbourhood venue', meta: 'Tonight · Inglewood · Under $25', tags: ['Tonight', 'Live Music'] },
  { title: 'Cozy dinner-and-walk plan', meta: 'Today · Kensington · Date Night', tags: ['Food', 'Date Night'] },
  { title: 'Free riverside outdoor idea', meta: 'This afternoon · Beltline nearby', tags: ['Free', 'Outdoors'] }
];

export default function TodayScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.kicker}>Calgary beta · more cities later</Text>
      <Text style={styles.title}>What's the move today?</Text>
      <Text style={styles.subtitle}>A short list of good plans, not a giant calendar.</Text>
      <View style={styles.filterWrap}>
        {CORE_TAGS.slice(0, 8).map((tag) => <Text key={tag} style={styles.filter}>{tag}</Text>)}
      </View>
      {demoCards.map((card) => (
        <View key={card.title} style={styles.card}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.cardMeta}>{card.meta}</Text>
          <View style={styles.tagRow}>{card.tags.map((tag) => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14, backgroundColor: '#0f1115', minHeight: '100%' },
  kicker: { color: '#9ea7b3', fontSize: 13 },
  title: { color: '#ffffff', fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#c3cad4', fontSize: 16, lineHeight: 22 },
  filterWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filter: { color: '#f4f6f8', borderColor: '#303744', borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, overflow: 'hidden' },
  card: { backgroundColor: '#171b22', borderColor: '#262d38', borderWidth: 1, borderRadius: 18, padding: 16, gap: 8 },
  cardTitle: { color: '#ffffff', fontSize: 19, fontWeight: '700' },
  cardMeta: { color: '#aab3bf', fontSize: 14 },
  tagRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: { color: '#0f1115', backgroundColor: '#d8ff7a', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, overflow: 'hidden', fontSize: 12 }
});
