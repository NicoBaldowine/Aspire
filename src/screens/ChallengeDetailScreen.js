import { StyleSheet, View, Text, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { updateChallenge } from '../utils/storage';

export default function ChallengeDetailScreen({ navigation, route }) {
  const challenge = route?.params?.challenge;
  const [timeLeft, setTimeLeft] = useState('');
  const [canMarkComplete, setCanMarkComplete] = useState(false);
  const [completedDays, setCompletedDays] = useState(challenge?.completedDays || []);
  const currentDay = (completedDays.length + 1);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!challenge?.startDate) return;

      const start = new Date(challenge.startDate);
      const now = new Date();
      const lastCompletedDate = completedDays.length > 0 
        ? new Date(completedDays[completedDays.length - 1]) 
        : start;

      // Calculate when the next day can be marked
      const nextAvailableDate = new Date(lastCompletedDate);
      nextAvailableDate.setHours(nextAvailableDate.getHours() + 24);

      const timeDiff = nextAvailableDate - now;

      if (timeDiff <= 0) {
        setCanMarkComplete(true);
        setTimeLeft('');
      } else {
        setCanMarkComplete(false);
        // Convert milliseconds to hours and minutes
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}hr ${minutes}min to mark as completed`);
      }
    }, 60000); // Update every minute

    // Initial check
    const start = new Date(challenge?.startDate);
    const now = new Date();
    const lastCompletedDate = completedDays.length > 0 
      ? new Date(completedDays[completedDays.length - 1]) 
      : start;
    const nextAvailableDate = new Date(lastCompletedDate);
    nextAvailableDate.setHours(nextAvailableDate.getHours() + 24);
    const timeDiff = nextAvailableDate - now;

    if (timeDiff <= 0) {
      setCanMarkComplete(true);
      setTimeLeft('');
    } else {
      setCanMarkComplete(false);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}hr ${minutes}min to mark as completed`);
    }

    return () => clearInterval(timer);
  }, [challenge?.startDate, completedDays]);

  const handleMarkDay = async () => {
    if (!canMarkComplete) return;

    const newCompletedDays = [...completedDays, new Date().toISOString()];
    setCompletedDays(newCompletedDays);

    // Update challenge in storage
    const updatedChallenge = {
      ...challenge,
      completedDays: newCompletedDays,
    };
    await updateChallenge(updatedChallenge);
  };

  if (!challenge) return null;

  const firstRow = Array.from({ length: 7 }, (_, i) => i + 1);
  const secondRow = Array.from({ length: 7 }, (_, i) => i + 8);
  const thirdRow = Array.from({ length: 7 }, (_, i) => i + 15);

  return (
    <View style={[styles.container, { backgroundColor: challenge.categoryColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable 
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </Pressable>

        <View style={styles.content}>
          <Ionicons 
            name={challenge.categoryIcon} 
            size={32}
            color="rgba(255,255,255,0.9)"
            style={styles.icon}
          />

          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.description}>{challenge.description}</Text>

          <View style={styles.daysGrid}>
            <View style={styles.row}>
              {firstRow.map(day => (
                <View
                  key={day}
                  style={[
                    styles.dayCircle,
                    completedDays.includes(day) && styles.completedDay,
                    currentDay === day && styles.currentDay,
                  ]}
                >
                  <Text style={[styles.dayText, completedDays.includes(day) && styles.activeText]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.row}>
              {secondRow.map(day => (
                <View
                  key={day}
                  style={[
                    styles.dayCircle,
                    completedDays.includes(day) && styles.completedDay,
                    currentDay === day && styles.currentDay,
                  ]}
                >
                  <Text style={[styles.dayText, completedDays.includes(day) && styles.activeText]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.row}>
              {thirdRow.map(day => (
                <View
                  key={day}
                  style={[
                    styles.dayCircle,
                    completedDays.includes(day) && styles.completedDay,
                    currentDay === day && styles.currentDay,
                  ]}
                >
                  <Text style={[styles.dayText, completedDays.includes(day) && styles.activeText]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Pressable
          style={[
            styles.markButton,
            !canMarkComplete && styles.markButtonDisabled
          ]}
          onPress={handleMarkDay}
          disabled={!canMarkComplete}
        >
          <Text style={styles.markButtonText}>
            {canMarkComplete 
              ? `Mark day ${currentDay} as completed`
              : timeLeft
            }
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 24,
    alignSelf: 'flex-start', // Ensures left alignment
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'left',
  },
  description: {
    fontSize: 17,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 40,
  },
  daysGrid: {
    gap: 16, // Exactly 16px between rows
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedDay: {
    backgroundColor: '#fff',
  },
  currentDay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  dayText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activeText: {
    color: '#fff',
  },
  markButton: {
    backgroundColor: '#191900',
    marginHorizontal: 24,
    marginBottom: 44,
    padding: 20,
    borderRadius: 16,
  },
  markButtonDisabled: {
    backgroundColor: 'rgba(25, 25, 0, 0.5)', // More transparent when disabled
  },
  markButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
