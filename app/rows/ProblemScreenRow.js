import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity, Button } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { Checkbox, TouchableRipple } from 'react-native-paper';
import { PROBLEM_SELECTED } from '../Common';


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

export default function ProblemScreenRow({ navigation, SN, question, answer, category, hit }) {
    const [isSelected, setIsSelected] = React.useState(false); // 서버로 부터 받은 데이터를 저장하는 변수

    function selectProblem() {
        setIsSelected(!isSelected);
        if (isSelected == true) {
            const idx = PROBLEM_SELECTED.indexOf(SN)
            if (idx > -1) PROBLEM_SELECTED.splice(idx, 1)
        } else {
            PROBLEM_SELECTED.push(SN);
        }
        console.log(PROBLEM_SELECTED);
    }

    return (
        <TouchableOpacity
            onPress={() => {
                selectProblem();
            }}>
            <View style={styles.container}>
                <View style={styles.photo}>
                    <FontAwesome name="sticky-note-o" size={24} color="black" />
                </View>
                <View style={styles.container_text}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.title}>
                            {question}
                        </Text>
                        <Text style={styles.title}>
                            <Text>hit: </Text> {hit}
                        </Text>
                    </View>
                </View>
                <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                    <Checkbox
                        style={{ borderWidth: 1, borderBottomColor: 'black', backgroundColor: 'black' }}
                        status={isSelected ? 'checked' : 'unchecked'}
                        onPress={() => {
                            selectProblem();
                        }}
                    />
                </View>
                <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center' }} onPress={()=>{navigation.navigate('EditProblemScreen')}}>
                    <Feather name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}