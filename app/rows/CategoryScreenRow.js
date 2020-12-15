import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity, Button } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { Checkbox, TouchableRipple } from 'react-native-paper';
import { CATEGORY_SELECTED } from '../Common';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 2,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e1e1",
        backgroundColor: "#f1f1f1",
        elevation: 2,
    },
    title: {
        fontSize: 14,
        color: '#3f3f3f',
        fontWeight: 'bold'
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
        marginTop: 20,
        marginBottom: 20,
    },
    photo: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    displayname: {
        fontSize: 11,
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        color: 'blue'
    },
});

export default function CategoryScreeRow({ navigation, title }) {
    const [isSelected, setIsSelected] = React.useState(false); // 서버로 부터 받은 데이터를 저장하는 변수

    return (
        <TouchableOpacity
            onPress={() => {
                setIsSelected(!isSelected);
                if (isSelected == true) {
                    const idx = CATEGORY_SELECTED.indexOf(title)
                    if (idx > -1) CATEGORY_SELECTED.splice(idx, 1)
                } else {
                    CATEGORY_SELECTED.push(title);
                }
                console.log(CATEGORY_SELECTED);
            }}>
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
                <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                    <Checkbox
                        style={{ borderWidth: 1, borderBottomColor: 'black', backgroundColor: 'black' }}
                        status={isSelected ? 'checked' : 'unchecked'}

                    />
                </View>
                <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center' }}>
                    <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}