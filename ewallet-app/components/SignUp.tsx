import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const SignUp: React.FC = () => {
    return (
        <View>
            <Text>Sign Up</Text>
            <TextInput placeholder="Email" />
            <TextInput placeholder="Password" secureTextEntry />
            <Button title="Create Account" onPress={() => { /* Handle sign up logic */ }} />
        </View>
    );
};

export default SignUp;
