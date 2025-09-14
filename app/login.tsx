import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity,KeyboardAvoidingView,Image,ScrollView,Pressable,Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config'; // project root
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert('Email not verified', 'Please verify your email before logging in.');
        return;
      }
      router.replace('/');
    } catch (error: any) {
      console.error("Error logging in:", error);
      if(error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email'|| error.code === 'auth/invalid-credential'){
        Alert.alert('Error', 'Invalid email or password');
        return;
      }
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={require("@/assets/images/Recipix.png")}
            style={styles.logo}
            
          />

 
          <Text style={styles.subHeading}>
Hungry for inspiration? Log in to Recipix!          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#ff9100"
              style={styles.icon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#ff9100"
              style={styles.icon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          {/* Footer */}
            <TouchableOpacity onPress={() => router.push('/signup')} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }} >
               <Text style={styles.footerText}>
            Don’t have an account? </Text>
            <Text style={{ color: "#ff9100", fontWeight: "700",fontSize:15 , textDecorationLine: 'underline' }}>
              Sign up
            </Text>
            
            </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#fff",
  },
  logo: {
    width: 230,
    height: 200,
    alignSelf: "center",
    marginBottom: 0,
    resizeMode: "contain",
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ff9100",
    textAlign: "center",
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 30,
    marginTop: -20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#ff9100",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },
});