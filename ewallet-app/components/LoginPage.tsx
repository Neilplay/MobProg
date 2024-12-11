import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../components/backend/supabase'; // Import your Supabase client
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison

type AuthStackParamList = {
  ForgotPassword: undefined;
  SignUp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLoginPress = async (): Promise<void> => {
    try {
      // Query the users table to get the user data based on the email
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single(); // Only expecting one user

      if (error || !data) {
        console.error('Login Error:', error || 'User not found');
        alert('User not found');
        return;
      }

      // Compare the provided password with the stored hashed password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, data.password);

      if (isPasswordValid) {
        console.log('Login Success:', data);
        onLogin();
      } else {
        console.error('Invalid password');
        alert('Invalid password');
      }
    } catch (err) {
      console.error('Login failed with exception:', err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/favicon.png')} // Replace with your actual logo path
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={!showPassword} // Toggle password visibility
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Text style={styles.eyeIconText}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.link}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.link}>
        <Text style={styles.linkText}>Sign Up</Text>
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
    alignSelf: 'center', // Center the logo horizontally
    marginBottom: 20, // Add spacing below the logo
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
  passwordContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  eyeIconText: {
    color: '#007BFF',
    fontSize: 16,
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
  link: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#666', // Updated text color for links
    fontSize: 16,
  },
});

export default LoginPage;
