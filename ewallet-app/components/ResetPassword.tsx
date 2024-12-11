import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const route = useRoute();

  useEffect(() => {
    const params = route.params as { token?: string };
    if (params?.token) {
      setToken(params.token);
    }
  }, [route]);

  const handleResetPassword = (): void => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!token) {
      alert('Invalid or missing token.');
      return;
    }
    // Use the token to reset the password with your backend (e.g., Supabase)
    alert('Password successfully reset!');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/favicon.png')} // Replace with your actual logo path
        style={styles.logo}
      />
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
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

export default ResetPassword;
