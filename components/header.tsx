import { Ionicons } from "@expo/vector-icons";
import React from "react"; 
import { StyleSheet, View, Image, Text ,TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { doc, getDoc} from "firebase/firestore";
import { db , auth} from "../firebase-config";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const router = useRouter();
     const {user}=useAuth();
        const [userImg,setUserImg]=React.useState("")
        React.useEffect(() => {
            getImg();
            console.log(userImg)
        },[user]);
    
        const getImg= async()=>{
            
             const docRef = doc(db, "users", user?.uid as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserImg(docSnap.data().photoUrl);
    
            }
    
        }
    return (
        <View style={styles.header}>
            <View >
                
            <Image
                source={require('@/assets/images/Recipix.png')}
                resizeMode="contain"
                style={styles.logo}
            />
            </View>
            <View >
                <TouchableOpacity style={styles.icon} onPress={() => router.push('/profile')}>
                    {
                        userImg!="" ? <Image source={{ uri: userImg }} style={{ width: 45, height: 45, borderRadius: 22.5 }} /> 
                        : 
                    <Ionicons name="person-circle" size={45} color="#ccc" />
                    }
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height:100,
        width: '100%',
        backgroundColor: 'white',
        padding: 10,
        borderWidth: 0.2,
        borderColor: '#ccc',
        shadowOffset: { width: 2, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // for Android shadow
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        
        
    },
    title: {    
        fontSize: 40,
        fontWeight: '900',
        color: '#FE5D26',
        fontFamily: 'dancingScript',
    },
    logo: {
        width: 130,
        height: 110,
        borderRadius: 10,
        
    },
    icon:{
        paddingTop: 20
    }
});