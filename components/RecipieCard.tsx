import React from "react";
import { StyleSheet, View, Image, Text ,TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
const router = useRouter();
type props={
    id:string
    name: string,
    category?: string,
    Area?: string,
    image?: string,

}

const handleClick = (id:string) => {
    console.log(id);
    router.push(`/recipiedetails/${id}`);
}
    // Alert.alert('Card clicked', `ID: ${id}`);
    // console.log(id);}

export default function RecipieCard({id,name, category="", Area="", image=''}:props) {

    return (
        <View style={styles.container}>
            <TouchableOpacity  onPress={() => handleClick(id)}>
            <View >
                <Image
                    source={{uri : image}}
                    style={styles.image}
                />
                <Text style={{fontSize: 20, fontWeight: 'bold', margin : 10}}>{name}</Text>
                <View style={styles.categoryContainer}>
                <Text style={styles.category}>{category}</Text>
                <Text style={styles.category}>{Area}</Text>

                </View>
            </View>
            </TouchableOpacity>
            
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: 280,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#ccc',
        shadowOffset: { width: 2, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // for Android shadow
        margin:'auto',
        marginBottom: 20,
        borderRadius: 10
                

    }
    ,image: {
        width: '100%',
        height: 180,
        borderTopRightRadius:10,
        borderTopLeftRadius:10

    },
    category :{
        fontSize: 15,
        marginTop: 5,
        marginLeft: 10,
        color: '#000000',
        fontWeight: 'bold',
        backgroundColor: '#cccccc52',
        padding: 7,
        paddingLeft: 10,
        paddingRight:10,
        maxWidth:150,
        borderRadius: 50,
        textAlign: 'center',
    },
    categoryContainer:{
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
    }


    
});