import React from 'react';
import { View, Text, StyleSheet,Pressable} from 'react-native';
import { useAuth } from '../../context/authContext';
const Profile: React.FC = () => {
  const { signOut } = useAuth(); // Destructure signOut from useAuth

  

  const handleLogout = async () => {
    try {
      await signOut(); // Call signOut from context
      // Optionally navigate to the login screen (if using React Navigation)
      // navigation.navigate('Login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Assigner! This is your Profile Screen.</Text>
      <Pressable onPress={handleLogout}>
              <Text>Logout</Text>
      </Pressable>
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

export default Profile;