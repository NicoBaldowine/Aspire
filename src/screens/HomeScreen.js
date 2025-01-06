import { StyleSheet, View, Text, FlatList, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { getActiveChallenges, removeChallenge } from '../utils/storage';
import ChallengeListItem from '../components/ChallengeListItem';

export default function HomeScreen({ navigation }) {
  const [activeChallenges, setActiveChallenges] = useState([]);

  useEffect(() => {
    loadChallenges();
    const unsubscribe = navigation.addListener('focus', loadChallenges);
    return unsubscribe;
  }, [navigation]);

  const loadChallenges = async () => {
    try {
      const challenges = await getActiveChallenges();
      setActiveChallenges(challenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const handleDelete = async (challengeId) => {
    try {
      await removeChallenge(challengeId);
      loadChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const handleChallengePress = (challenge) => {
    console.log('Challenge being passed:', challenge);
    navigation.navigate('ChallengeDetail', { challenge });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenges</Text>
      
      {activeChallenges.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active challenges</Text>
          <Text style={styles.emptySubtext}>Start a new challenge from the Create tab</Text>
        </View>
      ) : (
        <FlatList
          data={activeChallenges}
          renderItem={({ item }) => (
            <ChallengeListItem 
              challenge={item}
              onPress={() => handleChallengePress(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60, // Add padding for status bar
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
  },
}); 