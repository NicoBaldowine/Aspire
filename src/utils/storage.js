import AsyncStorage from '@react-native-async-storage/async-storage';

const CHALLENGES_KEY = '@challenges';

export const addChallenge = async (challenge) => {
  try {
    const existingChallenges = await getChallenges();
    const updatedChallenges = [...existingChallenges, challenge];
    await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(updatedChallenges));
  } catch (error) {
    console.error('Error saving challenge:', error);
    throw error;
  }
};

export const getChallenges = async () => {
  try {
    const challenges = await AsyncStorage.getItem(CHALLENGES_KEY);
    return challenges ? JSON.parse(challenges) : [];
  } catch (error) {
    console.error('Error getting challenges:', error);
    return [];
  }
};

export const getActiveChallenges = async () => {
  try {
    const challenges = await getChallenges();
    return challenges.filter(challenge => !challenge.isCompleted); // Return only active challenges
  } catch (error) {
    console.error('Error getting active challenges:', error);
    return [];
  }
};

export const removeChallenge = async (challengeId) => {
  try {
    const challenges = await getChallenges();
    const updatedChallenges = challenges.filter(
      challenge => challenge.id !== challengeId
    );
    await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(updatedChallenges));
  } catch (error) {
    console.error('Error removing challenge:', error);
    throw error;
  }
};

export const updateChallenge = async (updatedChallenge) => {
  try {
    const challenges = await getChallenges();
    const updatedChallenges = challenges.map(challenge => 
      challenge.id === updatedChallenge.id ? updatedChallenge : challenge
    );
    await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(updatedChallenges));
  } catch (error) {
    console.error('Error updating challenge:', error);
    throw error;
  }
}; 