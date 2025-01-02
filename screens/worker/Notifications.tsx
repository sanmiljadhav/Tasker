import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from storage
  useEffect(() => {
    const fetchNotifications = async () => {
      const userProfile = await AsyncStorage.getItem('user_profile');
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications && userProfile) {
        const parsedUserProfile = JSON.parse(userProfile);

        const parsedNotifications: Notification[] =
          JSON.parse(storedNotifications);
        // Filter notifications for the logged-in user
        const userNotifications = parsedNotifications.filter(
          notification =>
            notification?.workerEmail === parsedUserProfile?.email,
        );

        setNotifications(userNotifications);
      }
    };
    fetchNotifications();
  }, []);

  const renderNotification = ({item}: {item: Notification}) => (
    <TouchableOpacity style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Notifications</Text>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noNotifications}>No notifications yet!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B9CD3',
    marginVertical: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B9CD3',
  },
  notificationMessage: {
    fontSize: 16,
    color: 'black',
    marginVertical: 5,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#A9A9A9',
    textAlign: 'right',
  },
  noNotifications: {
    fontSize: 16,
    color: '#A9A9A9',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Notifications;
