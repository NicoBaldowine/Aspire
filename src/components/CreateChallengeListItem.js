import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CreateChallengeListItem({ challenge, onPress }) {
  if (!challenge) return null;

  // Function to get a darker shade of the background color
  const getDarkerShade = (hexColor) => {
    if (!hexColor) return '#000000';
    
    try {
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      const darkerR = Math.floor(r * 0.7);
      const darkerG = Math.floor(g * 0.7);
      const darkerB = Math.floor(b * 0.7);
      
      return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
    } catch (error) {
      return '#000000';
    }
  };

  const darkerColor = getDarkerShade(challenge.color);

  return (
    <Pressable 
      style={styles.container}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: challenge.color }]}>
        <Ionicons 
          name={challenge.icon || 'help-circle'} 
          size={20} 
          color={darkerColor}
        />
      </View>
      <Text style={styles.title}>{challenge.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 24,
    marginRight: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
}); 