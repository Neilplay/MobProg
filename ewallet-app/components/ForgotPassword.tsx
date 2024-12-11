import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../components/backend/supabase';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // Explicitly specify the type

  const handleResetPassword = async (): Promise<void> => {
    try {
      // Supabase's resetPasswordForEmail expects a string as an argument
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) {
        alert(error.message);
      } else {
        alert('Password reset email sent.');
      }
    } catch (err) {
      console.error('Error sending reset email:', err);
      alert('Failed to send reset email. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default ForgotPassword;
