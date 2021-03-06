import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity, Button } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, Foundation } from '@expo/vector-icons';
import { Checkbox, TouchableRipple } from 'react-native-paper';


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

export default function CategoryScreeRow({ navigation, SN, name, problemSet, toggleSelectedItem, category, visible, selectedItem }) {
    const [isSelected, setIsSelected] = React.useState(false); // 서버로 부터 받은 데이터를 저장하는 변수
    const [slctdItm, setSlctdItm] = React.useState(selectedItem);

    React.useEffect(() => {
        if(slctdItm.toString().indexOf(SN) != -1){
            setIsSelected(true);
        }else{
            setIsSelected(false);
        }
    }, [slctdItm]);

    function selectThisItem() {
        setIsSelected(!isSelected);
        toggleSelectedItem(SN);
    }

    return (
        <TouchableOpacity
            onPress={() => {
                selectThisItem();
            }}>
            {/* <View style={styles.container}> */}
            <View style={visible||visible==undefined ? styles.container : { display:'none' }}>
                <View style={styles.photo}>
                    <Feather name="folder" size={30} color="black" />
                </View>
                <View style={styles.container_text}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.title}>
                            {name}
                        </Text>
                    </View>
                </View>
                <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                    <Checkbox
                        onPress={() => {
                            selectThisItem();
                        }}
                        style={{ borderWidth: 1, borderBottomColor: 'black', backgroundColor: 'black' }}
                        status={isSelected ? 'checked' : 'unchecked'}
                    />
                </View>
                <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        navigation.navigate('ProblemScreen', {
                            "categorySN": SN,
                            "categoryName": name,
                            "problemSet": problemSet,
                            "category": category
                        })
                    }}>
                    {/* <Feather name="edit" size={24} color="black" /> */}
                    <Foundation name="indent-more" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}