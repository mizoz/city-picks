import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferences</Text>
      <Text style={styles.copy}>Home city, neighborhoods, budget, interests, and family-friendly preferences go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, backgroundColor: '#0f1115' }, title: { color: '#fff', fontSize: 28, fontWeight: '800' }, copy: { color: '#c3cad4', marginTop: 8, fontSize: 16 } });
