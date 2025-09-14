import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity ,Image,Pressable,KeyboardAvoidingView,Platform} from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth ,db } from '../firebase-config'; // project root
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignupScreen({ }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          phone: phone,
          email: email,
          createdAt: new Date(),
        });
              await sendEmailVerification(user);




      Alert.alert('Account created!', ' Check the email we have sent you to verify the email address.');
      router.replace('/login');
    } catch (error: any) {
      console.error("Error signing up:", error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#fff",padding:20,justifyContent:'center',alignItems:'center' }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >

            <Image
        source={require('@/assets/images/Recipix.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.richPhrase}>
        <Text style={{ fontWeight: '500', color: '#616161',fontSize:14,marginTop:-40 }}>Let’s create your account and start cooking magic!</Text>
      </Text>
      <View style={styles.inputWrapper}>
        <Feather name="user" size={22} color="#ff9100" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#aaa"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Feather name="phone" size={22} color="#ff9100" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone (optional)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#aaa"
        />
      </View>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={22} color="#ff9100" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Feather name="lock" size={22} color="#ff9100" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Feather name="lock" size={22} color="#ff9100" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
        />
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.signupButton,
          pressed && { opacity: 0.85 },
        ]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.signupButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
      </Pressable>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => router.push('/login')}
          >
            Login
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 200,
    alignSelf: 'center',
    marginBottom: -20,
  },
  richPhrase: {
    fontSize: 17,
    color: '#3a2c17',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
    lineHeight: 26,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 13,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3e6d1',
    width: '100%',
    maxWidth: 380,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2e2e2e',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  signupButton: {
    marginTop: 12,
    backgroundColor: '#ff9100',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.21,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    maxWidth: 380,
  },
  signupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  footer: {
    marginTop: 25,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#444',
  },
  loginLink: {
    color: '#ff9100',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});