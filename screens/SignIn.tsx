import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { signInApi, SignInPayload } from '../api/api';
import Toast from 'react-native-toast-message';

import StorageUtils from '../utils/storage_utils';

// import AssigneeRoutes from '../routes/assignerRoutes';
// import WorkerRoutes from '../routes/workerRoutes';
// import AdminRoutes from '../routes/adminRoutes';


interface SignInProps {
    navigation: any;
} 


const SignIn: React.FC<SignInProps> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>(''); 
    useEffect(()=>{
        const checkTokenAndNavigate = async () => {
            try {
                const token = await StorageUtils.getAPIToken();
                const userProfile = await StorageUtils.getUserProfile();
    
                if (token && userProfile?.roles && Array.isArray(userProfile.roles)) {
                    const role = userProfile.roles[0];
    
                    // Navigate to the appropriate screen based on role
                    switch (role) {
                        case 'Admin':
                            navigation.navigate('AdminRoutes');
                            break;
                        case 'Assigner':
                            navigation.navigate('AssigneeRoutes');
                            break;
                        case 'Worker':
                            navigation.navigate('WorkerRoutes');
                            break;
                        default:
                            console.warn('Unknown role:', role);
                            Toast.show({
                                type: 'error',
                                text1: 'Role Error',
                                text2: 'Unable to determine user role.',
                            });
                            break;
                    }
                }
            } catch (error) {
                console.error('Error checking token and role:', error);
            }
        };
    
        checkTokenAndNavigate();
    },[navigation])



    const mutation = useMutation({
        mutationFn: (payload: SignInPayload) => {
            return signInApi(payload);
        },
        onSuccess: async (data) => {

            const { userToken, role, user } = data;
            try {
                // Storing token and user profile in local storage
                await StorageUtils.setAPIToken(userToken);
                await StorageUtils.setUserProfile(user);
            } catch (error) {
                console.error('Error storing data in AsyncStorage:', error);
            }

            Toast.show({
                type: 'success',
                text1: 'Sign In Successful!',
                text2: 'Welcome back!',
            });
            // Dynamically navigate to the route associated with the role 


            

            if (Array.isArray(role) && role.length > 0) {
                switch (role[0]) {
                    case 'Admin':
                        navigation.navigate('AdminRoutes');  // Navigate to AdminRoutes
                        break;
                    case 'Assigner':
                        navigation.navigate('AssigneeRoutes');  // Navigate to AssigneeRoutes
                        break;
                    case 'Worker':
                        navigation.navigate('WorkerRoutes');  // Navigate to WorkerRoutes
                        break;
                    default:
                        console.warn('Unknown role:', role);
                        Toast.show({
                            type: 'error',
                            text1: 'Navigation Error',
                            text2: 'Unable to determine user role.',
                        });
                        break;
                }
            } else {
                console.warn('Unknown or missing role:', role);
                Toast.show({
                    type: 'error',
                    text1: 'Role Error',
                    text2: 'Unable to determine user role.',
                });
            }
        },
        onError: (error: any) => {
            console.error('Sign in error:', error); // Log the error details
            Toast.show({
                type: 'error',
                text1: 'Sign In Failed',
                text2: error.message || 'Invalid credentials.',
            });
        }
    });


    const handleSubmit = () => {
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in both email and password.',
            });
            return;
        }
        mutation.mutate({ email, password }); // Trigger the mutation
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={'black'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={'black'}
                value={password}
                onChangeText={setPassword}
                // secureTextEntry
            />
            <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSubmit}
            >
                <Text style={styles.signInButtonText}>
                    Sign In
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    signInButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    signUpText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default SignIn;
