import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 2,
        borderBottomWidth : 1,
        borderBottomColor : "#e1e1e1",
        backgroundColor: "#f1f1f1",
        elevation: 2,
    },
    title: {
        fontSize: 14,
        color: '#3f3f3f',
        fontWeight : 'bold'
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    description: {
        fontSize: 11,
        color: '#3f3f3f',
        marginTop : 20,
        marginBottom : 20,
    },
    photo: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent : 'center'
    },
    displayname: {
        fontSize: 11,
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        color : 'blue'
    },
});

export default function CategoryScreeRow({ navigation, title }) {
    return(
        <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen')}>
            <View style={styles.container}>
                <View style={styles.photo}>
                    <SimpleLineIcons name="doc" size={30} color="black" />
                </View>
                <View style={styles.container_text}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.title}>
                            {title} 
                        </Text>
                        <Text style={styles.title}>
                            <Text>수정일: </Text> {title} 
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}