// ForgotPassword.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ForgotPassword = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
      <Button title="Reset Password" onPress={() => alert('Reset logic here')} />
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