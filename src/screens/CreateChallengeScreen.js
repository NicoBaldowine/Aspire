import { StyleSheet, View, Text, FlatList, TextInput, Alert, StatusBar } from 'react-native';
import { useState, useCallback } from 'react';
import { challengeSuggestions } from '../data/challengeSuggestions';
import CreateChallengeListItem from '../components/CreateChallengeListItem';
import { addChallenge, getChallenges } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CreateChallengeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChallenges, setActiveChallenges] = useState([]);

  // Load active challenges whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadActiveChallenges = async () => {
        const challenges = await getChallenges();
        setActiveChallenges(challenges);
      };
      loadActiveChallenges();
    }, [])
  );

  // Only show challenges that are NOT currently active
  const availableChallenges = challengeSuggestions.filter(suggestion => {
    const isAlreadyActive = activeChallenges.some(
      active => active.title === suggestion.title
    );
    const matchesSearch = suggestion.title.toLowerCase().includes(searchQuery.toLowerCase());
    return !isAlreadyActive && matchesSearch;
  });

  const handleChallengeSelect = (challenge) => {
    Alert.alert(
      "Start Challenge",
      `Would you like to start the "${challenge.title}" challenge?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          onPress: async () => {
            const newChallenge = {
              ...challenge,
              categoryColor: challenge.color,
              categoryIcon: challenge.icon,
              startDate: new Date().toISOString(),
              id: Date.now().toString(),
              isActive: true,
              completedDays: []
            };
            
            await addChallenge(newChallenge);
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Select Challenge</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search challenges..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.subtitle}>AVAILABLE CHALLENGES</Text>

      <FlatList
        data={availableChallenges}
        renderItem={({ item }) => (
          <CreateChallengeListItem 
            challenge={item} 
            onPress={() => handleChallengeSelect(item)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  searchInput: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    fontSize: 16,
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 24,
    letterSpacing: 0.5,
  },
}); 