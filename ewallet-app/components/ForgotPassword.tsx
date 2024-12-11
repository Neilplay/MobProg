import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
      <Image
        source={require('../assets/favicon.png')} // Replace with your actual logo path
        style={styles.logo}
      />
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
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
  logo: {
    width: 159, // Adjust the width of your logo
    height: 150, // Adjust the height of your logo
    alignSelf: 'center',
    marginBottom: 20,
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
  button: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
