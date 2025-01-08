import { StyleSheet, View, Text, Pressable, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useChallengeTimer } from '../utils/challengeTimeManager';
import { updateChallenge } from '../utils/storage';
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function ChallengeDetailScreen({ navigation, route }) {
  const challenge = route.params?.challenge;
  const [completedDays, setCompletedDays] = useState(challenge?.completedDays || []);
  const { timeLeft, canMarkComplete } = useChallengeTimer(challenge, completedDays);
  const currentDay = (completedDays.length + 1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  const handleDisabledButtonPress = async () => {
    Alert.alert(
      "Set Reminder",
      "Would you like to be notified when you can mark this day as completed?",
      [
        {
          text: "No Thanks",
          style: "cancel"
        },
        {
          text: "Set Reminder",
          onPress: async () => {
            try {
              // Request permissions
              const { status } = await Notifications.requestPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please enable notifications to set reminders');
                return;
              }

              // Calculate next available time
              const lastCompletedDate = completedDays.length > 0 
                ? new Date(completedDays[completedDays.length - 1]) 
                : new Date(challenge.startDate);
              
              const nextAvailableDate = new Date(lastCompletedDate);
              nextAvailableDate.setHours(nextAvailableDate.getHours() + 24);

              // Schedule notification
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "Ready to Mark Complete! 🎯",
                  body: `You can now mark day ${currentDay} as completed for your ${challenge.title} challenge!`,
                },
                trigger: {
                  date: nextAvailableDate,
                },
              });

              Alert.alert(
                "Reminder Set!",
                "We'll notify you when you can mark this day as completed"
              );
            } catch (error) {
              console.error('Error setting notification:', error);
              Alert.alert('Error', 'Could not set reminder');
            }
          }
        }
      ]
    );
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Challenge Options',
      '',
      [
        {
          text: 'Delete Challenge',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Challenge',
              'Are you sure you want to delete this challenge?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete', 
                  style: 'destructive',
                  onPress: () => {
                    // Add delete logic here
                    navigation.goBack();
                  }
                },
              ]
            );
          }
        },
        {
          text: notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications',
          onPress: () => {
            setNotificationsEnabled(!notificationsEnabled);
          }
        },
        {
          text: 'Share',
          onPress: () => {
            // Add share logic here
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  if (!challenge) return null;

  const firstRow = Array.from({ length: 7 }, (_, i) => i + 1);
  const secondRow = Array.from({ length: 7 }, (_, i) => i + 8);
  const thirdRow = Array.from({ length: 7 }, (_, i) => i + 15);

  return (
    <View style={[styles.container, { backgroundColor: challenge.categoryColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>

          <Pressable 
            style={styles.menuButton}
            onPress={handleMenuPress}
          >
            <Ionicons name="ellipsis-vertical-circle" size={28} color="#fff" />
          </Pressable>
        </View>

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
                    completedDays.length >= day && styles.completedDay,
                    currentDay === day && styles.currentDay,
                  ]}
                >
                  <Text 
                    style={[
                      styles.dayText, 
                      completedDays.length >= day && { color: challenge.categoryColor }
                    ]}
                  >
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
                    completedDays.length >= day && styles.completedDay,
                    currentDay === day && styles.currentDay,
                  ]}
                >
                  <Text 
                    style={[
                      styles.dayText, 
                      completedDays.length >= day && { color: challenge.categoryColor }
                    ]}
                  >
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
                    completedDays.length >= day && styles.completedDay,
                    currentDay === day && styles.currentDay,
                  ]}
                >
                  <Text 
                    style={[
                      styles.dayText, 
                      completedDays.length >= day && { color: challenge.categoryColor }
                    ]}
                  >
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
          onPress={canMarkComplete ? handleMarkDay : handleDisabledButtonPress}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  closeButton: {
    padding: 16,
  },
  menuButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  icon: {
    marginTop: 20,
    marginBottom: 8,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedDay: {
    backgroundColor: '#FFFFFF',
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
  completedDayText: {
    color: '#000',
  },
  markButton: {
    backgroundColor: '#191900',
    marginHorizontal: 24,
    marginBottom: 8,
    padding: 20,
    borderRadius: 16,
    marginTop: 10,
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
