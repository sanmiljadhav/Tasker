import React, {useEffect} from 'react';
import { View, Text, StyleSheet} from 'react-native';

const Notifications: React.FC = () => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Worker! This is your Notification Screenks.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Notifications;