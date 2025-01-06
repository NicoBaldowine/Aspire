import { StyleSheet, View, Text } from 'react-native';

export default function CompletedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Completed Challenges</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
}); 