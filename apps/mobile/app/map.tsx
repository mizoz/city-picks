import { StyleSheet, Text, View } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.copy}>Phase 1 placeholder. Phase 2 will add approved city-scoped events near the user.</Text>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, backgroundColor: '#0f1115' }, title: { color: '#fff', fontSize: 28, fontWeight: '800' }, copy: { color: '#c3cad4', marginTop: 8, fontSize: 16 } });
