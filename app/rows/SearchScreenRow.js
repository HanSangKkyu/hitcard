import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity, Button } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, Entypo, Foundation } from '@expo/vector-icons';
import { Checkbox, TouchableRipple } from 'react-native-paper';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape, PROBLEMSET_SELECTED, USER_ID } from "../Common";
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


export default function SearchScreenRow({ navigation, SN, name, owner, tag, hit, visible }) {
    const [isSelected, setIsSelected] = React.useState(false); // 서버로 부터 받은 데이터를 저장하는 변수

    async function copyProblemSet(_name, _tag) {
        if(owner.toString() != USER_SN[0].toString()){
            await hitup();
            await createNewProblemSet(_name, _tag); // 문제SET만들기
            const newProblemSetSN = await getNewProblemSetSN(); // 새로 만들어진 문제SET SN값 얻기
            const category = await getCategory();// 카테고리 정보 얻기
    
            for (let i = 0; i < category.length; i++) {
                await createNewCategory(category[i].name, newProblemSetSN); // 카테고리 만들기
                var newCategorySN = await getNewCategorySN(newProblemSetSN)// 새로 만들어진 카테고리 SN값 얻기
                var problem = await getProblem(category[i].SN); // 문제 정보 얻기
                for (let j = 0; j < problem.length; j++) {
                    await createNewProblem(problem[j].question, problem[j].answer, newCategorySN, problem[j].hit);// 새로 만들어진 카테고리에 문제 정보 넣기
                }
            }
    
    
            alert("내 문제set에 추가되었습니다");
        }else{
            alert("자신의 문제SET은 다운로드 할 수 없습니다.");
        }
    }

    function createNewProblemSet(_name, _tag) {
        // 문제SET만들기
        return new Promise(function (resolve, reject) {
            fetch(APIVO + '/problem-set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'name': _name,
                    'owner': USER_SN[0],
                    'tag': _tag
                })
            })
                .then((response) => response.text())
                .then((responseJson) => {
                    console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
                    console.log(_name, USER_SN[0], _tag + " 문제SET 만들기 성공!");
                    resolve(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    function getNewProblemSetSN() {
        // 새로 만들어진 문제SET SN값 얻기
        return new Promise(function (resolve, reject) {
            fetch(APIVO + '/problem-set/owner/' + USER_SN[0], {
                method: 'GET'
            })
                .then((response) => response.text())
                .then((responseJson) => {
                    console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
                    var res = JSON.parse(jsonEscape(responseJson)).array;
                    console.log('새로 만들어진 문제SET의 SN값은' + res[res.length - 1].SN + '입니다.');
                    resolve(res[res.length - 1].SN);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    function getCategory() {
        // 카테고리 정보 얻기
        return new Promise(function (resolve, reject) {
            fetch(APIVO + '/problem-set/' + SN + '/category', {
                method: 'GET'
            })
                .then((response) => response.text())
                .then((responseJson) => {
                    console.log('카테고리 정보를 얻었습니다.'+JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
                    var res = JSON.parse(jsonEscape(responseJson)).array;
                    resolve(res);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    function createNewCategory(_name, _newProblemSetSN) {
        // 카테고리 만들기
        return new Promise(function (resolve, reject) {
            fetch(APIVO + '/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'name': _name,
                    'problemSet': _newProblemSetSN
                })
            })
                .then((response) => response.text())
                .then((responseJson) => {
                    console.log(_name,_newProblemSetSN,'새로운 카테고리를 만들었습니다.');
                    resolve(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    function getNewCategorySN(_problemSetSN) {
        // 새로 만들어진 카테고리 SN값 얻기
        return new Promise(function (resolve, reject) {
            fetch(APIVO + '/problem-set/' + _problemSetSN + '/category', {
                method: 'GET'
            })
                .then((response) => response.text())
                .then((responseJson) => {
                    console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
                    var res = JSON.parse(jsonEscape(responseJson)).array;
                    console.log('새로 만들어진 문제SET의 SN값은' + res[res.length - 1].SN + '입니다.');
                    resolve(res[res.length - 1].SN);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    function getProblem(_categorySN) {
        // 문제 정보 얻기
        return new Promise(function (resolve, reject) {
            fetch(APIVO + '/category/' + _categorySN + '/problem', {
                method: 'GET'
            })
                .then((response) => response.text())
                .then((responseJson) => {
                    console.log('문제 정보를 얻었습니다.'+JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
                    let res = JSON.parse(jsonEscape(responseJson)).array;

                    resolve(res);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    function createNewProblem(_question, _answer, _newCategorySN, _hit) {
        // 새로 만들어진 카테고리에 문제 정보 넣기
        return new Promise(function (resolve, reject) {
            fetch(APIVO + '/problem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'question': _question,
                    'answer': _answer,
                    'category': _newCategorySN,
                    'hit': _hit.toString()
                })
            })
                .then((response) => response.text())
                .then((responseJson) => {
                    console.log(_question, _answer, _newCategorySN, _hit,'새로 문제를 만들었습니다.');
                    resolve(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    function hitup() {
        return new Promise(function (resolve, reject) {
        fetch(APIVO + '/problem-set/' + SN + '/hitup', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
          })
            .then((response) => response.text())
            .then((responseJson) => {
              console.log('hitup 성공!');
              resolve(responseJson);
            })
            .catch((error) => {
              console.error(error);
            });
        });
    }
    return (
        <TouchableOpacity>
            <View style={visible ? styles.container : { display:'none' }}>
                <View style={styles.photo}>
                    <AntDesign name="inbox" size={30} color="black" />
                </View>
                <View style={styles.container_text}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.title}>
                            {name}
                        </Text>
                        <Text style={styles.title}>
                            <Text>만든이: </Text> {owner}
                        </Text>
                        <Text style={styles.title}>
                            <Text>태그: </Text> {tag}
                        </Text>
                        <Text style={styles.title}>
                            <Text>다운로드 횟수: </Text> {hit}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        copyProblemSet(name, tag);
                    }}>
                    <Entypo name="download" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center', marginLeft: 10 }}
                    onPress={() => {
                        navigation.navigate('SearchCategoryScreen', {
                            "problemSetSN": SN,
                            "problemSetName": name,
                            "problemSetHit": hit
                        })
                    }}>
                    <Foundation name="indent-more" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}