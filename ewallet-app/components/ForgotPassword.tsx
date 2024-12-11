import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const ForgotPassword: React.FC = () => {
    return (
        <View>
            <Text>Forgot Password</Text>
            <TextInput placeholder="Email" />
            <Button title="Reset Password" onPress={() => { /* Handle reset password logic */ }} />
        </View>
    );
};

export default ForgotPassword;
