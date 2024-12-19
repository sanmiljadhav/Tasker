// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';

import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import AdminRoutes from './routes/adminRoutes';
import AssigneeRoutes from './routes/assignerRoutes';
import WorkerRoutes from './routes/workerRoutes';

import StorageUtils from './utils/storage_utils';
import { useEffect, useState } from 'react';
import { AuthProvider } from './context/authContext';

const Stack = createStackNavigator();

export default function App() {
  const queryClient = new QueryClient();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const userProfile = await StorageUtils.getUserProfile();
      if (userProfile && userProfile.roles && userProfile.roles.length > 0) {
        setUserRole(userProfile.roles[0]);
      }
    };

    checkUserRole();
  }, []);

  const renderUserStack = () => {
    return (
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Sign In' }} />
        <Stack.Screen name="AdminRoutes" component={AdminRoutes} options={{ headerShown: false }} />
        <Stack.Screen name="AssigneeRoutes" component={AssigneeRoutes} options={{ headerShown: false }} />
        <Stack.Screen name="WorkerRoutes" component={WorkerRoutes} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      
      <NavigationContainer>
      <AuthProvider> 
        {renderUserStack()}
        <StatusBar barStyle={'dark-content'} />
        <Toast />
        </AuthProvider>
      </NavigationContainer>
      
    </QueryClientProvider>
  );
}
