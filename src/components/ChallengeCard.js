import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChallengeCard({ challenge, onPress, onDelete }) {
  return (
    <Pressable 
      style={[styles.card, { backgroundColor: challenge.categoryColor }]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={challenge.categoryIcon} 
            size={24} 
            color="rgba(255,255,255,0.9)" 
          />
        </View>
        <Text style={styles.title}>{challenge.title}</Text>
      </View>
      
      <Pressable 
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={8}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  deleteButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
}); 