import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../components/backend/supabase'; // Assuming you have Supabase set up correctly
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const handleSignUp = async (): Promise<void> => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      // Hash the password before sending it to Supabase
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase.auth.signUp({
        email,
        password: hashedPassword, // Use the hashed password
      });

      if (error) {
        alert(error.message);
      } else {
        const user = data?.user; // Access the user object from the data field

        // Insert the user data into the 'users' table along with the hashed password
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: user?.id,
              email,
              first_name: firstName,
              last_name: lastName,
              password: hashedPassword, // Store the hashed password
              metadata: {},
            },
          ]);

        if (insertError) {
          alert(insertError.message);
        } else {
          alert('Sign up successful! Please check your email to confirm.');
        }
      }
    } catch (err) {
      alert('Sign up failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/favicon.png')} // Replace with your actual logo path
        style={styles.logo}
      />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
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
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry={!showConfirmPassword} // Toggle confirm password visibility
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <Text style={styles.eyeIconText}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
    width: 159,
    height: 150,
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
});

export default SignUp;
