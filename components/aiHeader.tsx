import { Ionicons } from "@expo/vector-icons";
import React from "react"; 
import { StyleSheet, View, Image, Text ,TouchableOpacity, Alert } from "react-native";

export default function AIHeader() {
    return (
        <View style={styles.header}>
            <View >
            <Image
                source={require('@/assets/images/ai.png')}
                resizeMode="contain"
                style={styles.logo}
            />
            </View>
            <View >
                <TouchableOpacity style={styles.icon} onPress={() => Alert.alert('Logo clicked')}>
                    <Ionicons name="person-circle" size={45} color="#ccc" />
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
        width: 180,
        height: 110,
        borderRadius: 10,
        
    },
    icon:{
        paddingTop: 20
    }
});