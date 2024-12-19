import messaging from '@react-native-firebase/messaging';

  export const getFcmToken = async (): Promise<string | null> => {
    try {
      // Request permission for notifications (iOS-specific)
      await messaging().requestPermission();
  
      // Get the FCM token for the current device
      const fcmToken = await messaging().getToken();
  
      if (fcmToken) {
        return fcmToken;
      } else {
        console.warn('Failed to get FCM token');
        return null;
      }
    } catch (error) {
      console.error('Error fetching FCM token:', error);
      return null;
    }
  };
  