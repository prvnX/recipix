import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator, Pressable, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase-config"; 
import { doc, getDoc ,updateDoc} from "firebase/firestore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import Header from "@/components/header";

export default function Profile() {

  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; phone?: string; email: string; photoUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);

  const uploadToCloudinary = async (imageUri:string) => {
  const data = new FormData();
  data.append('file', {
    uri: imageUri,
    type: 'image/jpeg', // or get from ImagePicker result
    name: 'upload.jpg',
  } as any);
  data.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // unsigned preset
  data.append('cloud_name', 'YOUR_CLOUD_NAME');

  try {
    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dbleqzcp4/image/upload',
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data.secure_url;
  } catch (err) {
    console.log('Upload error:', err);
  }
};

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as { name: string; phone?: string; email: string; photoUrl?: string };
          setProfile(data);
          setPhoto(data.photoUrl || null);
        } else {
          setProfile({ name: "Unknown", email: auth.currentUser.email || "", phone: "" });
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged out", "You have been logged out successfully.");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      uploadToCloudinary(result.assets[0].uri).then((url) => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          Alert.alert("Error", "User not authenticated.");
          return;
        }
        const docRef = doc(db, "users", uid);
        // Update the user's photoUrl in Firestore
        // You need to use updateDoc from firebase/firestore to update the document
        updateDoc(docRef, { photoUrl: url });
      }).catch(() => {
        Alert.alert("Error", "Failed to upload image.");
      });
      // TODO: Upload to Firebase Storage and update user's photoUrl
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>

      {/* Profile Picture */}
      <View style={styles.dpContainer} >
        {photo ? (
          <Image source={{ uri: photo }} style={styles.dp} />
        ) : (
          <Ionicons name="person-circle-outline" size={120} color="#000" />
        )}
        <Pressable onPress={handlePickImage} style={styles.editIconContainer}>
          <MaterialIcons name="edit" size={20} color="#000000" />
        </Pressable>
      </View>

      {/* Profile Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile?.name}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{profile?.phone || "Not provided"}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile?.email}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.85 }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    paddingTop: 50,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  dpContainer: {
    marginBottom: 25,
    position: "relative",
  },
  dp: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f4ede5",
    padding: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000000",
  },
  infoCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 30,
  },
  field: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  separator: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  logoutButton: {
    backgroundColor: "#ff9100",
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    width: "85%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
    
  },
});