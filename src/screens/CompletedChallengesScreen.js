import { StyleSheet, View, Text } from 'react-native';

export default function CompletedChallengesScreen() {
  const hasCompletedChallenges = false; // This will be dynamic later

  return (
    <View style={styles.container}>
      {!hasCompletedChallenges ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No completed challenges yet. Keep going with your current challenges!
          </Text>
        </View>
      ) : (
        <Text>Completed Challenges will appear here</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
}); 