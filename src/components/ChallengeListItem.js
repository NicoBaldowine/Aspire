import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChallengeListItem({ challenge, onPress, onDelete }) {
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

  const calculateProgress = () => {
    const completedCount = challenge?.completedDays?.length || 0;
    const progress = completedCount / 21;
    const daysLeft = 21 - completedCount;

    return { 
      progress: Math.min(progress, 1),
      daysLeft: Math.max(daysLeft, 0)
    };
  };

  const { progress, daysLeft } = calculateProgress();
  const darkerColor = getDarkerShade(challenge?.categoryColor);

  const canMarkComplete = () => {
    if (!challenge?.startDate || !challenge?.completedDays) return false;
    
    const lastCompletedDate = challenge.completedDays.length > 0 
      ? new Date(challenge.completedDays[challenge.completedDays.length - 1]) 
      : new Date(challenge.startDate);
    
    const nextAvailableDate = new Date(lastCompletedDate);
    nextAvailableDate.setMinutes(nextAvailableDate.getMinutes() + 5); // Using 5 minutes for testing
    
    return new Date() >= nextAvailableDate;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      {canMarkComplete() && <View style={styles.notificationDot} />}
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={[styles.iconContainer, { backgroundColor: challenge?.categoryColor || '#666' }]}>
            <Ionicons 
              name={challenge?.categoryIcon || 'help-circle'} 
              size={20} 
              color={darkerColor}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{challenge?.title || 'Untitled Challenge'}</Text>
            <Text style={styles.subtitle}>{daysLeft} days left</Text>
          </View>
        </View>

        <Pressable
          onPress={onDelete}
          hitSlop={8}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deletePressed
          ]}
        >
          <Ionicons name="trash-outline" size={20} color="#666" />
        </Pressable>
      </View>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: challenge?.categoryColor || '#666',
              width: `${progress * 100}%`
            }
          ]} 
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  deletePressed: {
    opacity: 0.6,
  },
  progressBarContainer: {
    height: 3,
    width: '100%',
    backgroundColor: '#2C2C2E',
  },
  progressBar: {
    height: '100%',
    opacity: 0.8,
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    zIndex: 1,
  },
}); 