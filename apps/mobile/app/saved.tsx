import { StyleSheet, Text, View } from 'react-native';

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved plans</Text>
      <Text style={styles.copy}>Saved events and plans will appear here once Supabase/auth is connected.</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, backgroundColor: '#0f1115' }, title: { color: '#fff', fontSize: 28, fontWeight: '800' }, copy: { color: '#c3cad4', marginTop: 8, fontSize: 16 } });
