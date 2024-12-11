import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../components/backend/supabase';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation
import { StackNavigationProp } from '@react-navigation/stack'; // Import the navigation prop type
import { CommonActions } from '@react-navigation/native';

interface UserData {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  metadata: { avatar_url?: string };
}

type AuthStackParamList = {
  Profile: undefined;
  Login: undefined; // Ensure Login is included
};

type ProfilePageNavigationProp = StackNavigationProp<AuthStackParamList, 'Profile'>;

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const navigation = useNavigation<ProfilePageNavigationProp>(); // Use the typed navigation prop

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser?.user) {
          alert('No authenticated user.');
          return;
        }

        const userId = authUser.user.id;
        const { data, error } = await supabase
          .from('users')
          .select('email, first_name, last_name, metadata')
          .eq('id', userId)
          .single();

        if (error) {
          alert(error.message);
        } else {
          setUserData(data);
          setImage(data?.metadata?.avatar_url || null);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('Unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImageLoading(true);
        const selectedImageUri = result.assets[0].uri;

        const response = await fetch(selectedImageUri);
        const blob = await response.blob();

        const fileName = `avatars/${Date.now()}.jpg`;
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, blob, { contentType: 'image/jpeg' });

        if (uploadError) {
          alert('Image upload failed: ' + uploadError.message);
          setImageLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        const imageUrl = publicUrlData?.publicUrl;

        const { error } = await supabase
          .from('users')
          .update({ metadata: { avatar_url: imageUrl } })
          .eq('id', userData?.email);

        if (error) {
          alert('Image update failed: ' + error.message);
        } else {
          setImage(imageUrl);
          alert('Image uploaded successfully!');
        }
        setImageLoading(false);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image');
      setImageLoading(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ metadata: { avatar_url: null } })
        .eq('id', userData?.email);

      if (error) {
        alert('Image deletion failed: ' + error.message);
      } else {
        setImage(null);
        alert('Image deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Error deleting image');
    }
  };

  // Add a logout function to sign out the user
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Log the user out
  
      // Ensure the 'Login' screen is navigated to properly
      // Set the isLoggedIn state to false in App component
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{ uri: image || 'https://via.placeholder.com/150' }}
      />
      <Text style={styles.name}>
        {userData.first_name || 'First Name'} {userData.last_name || 'Last Name'}
      </Text>
      <Text style={styles.email}>{userData.email || 'Email not available'}</Text>

      {!image ? (
        <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
            <Text style={styles.buttonText}>Edit Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleImageDelete}>
            <Text style={styles.buttonText}>Delete Image</Text>
          </TouchableOpacity>
        </View>
      )}

      {image && (
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
  },
  deleteButton: {
    backgroundColor: '#FF6600',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfilePage;
