import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Entypo, Foundation } from '@expo/vector-icons';
import { USER_SN, apiClient, jsonEscape } from "../Common";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchScreen'>;

type Props = {
  navigation: SearchScreenNavigationProp;
  SN: string;
  name: string;
  owner: string;
  tag: string;
  hit: string;
  visible?: boolean;
};

async function copyProblemSet(SN: string, name: string, tag: string, owner: string) {
  if(owner.toString() != USER_SN[0].toString()){
    await hitup(SN);
    await createNewProblemSet(name, tag);
    const newProblemSetSN = await getNewProblemSetSN();
    const category = await getCategory(SN);

    for (let i = 0; i < category.length; i++) {
      await createNewCategory(category[i].name, newProblemSetSN);
      var newCategorySN = await getNewCategorySN(newProblemSetSN)
      var problem = await getProblem(category[i].SN);
      for (let j = 0; j < problem.length; j++) {
        await createNewProblem(problem[j].question, problem[j].answer, newCategorySN, problem[j].hit);
      }
    }
    alert("내 문제set에 추가되었습니다");
  }else{
    alert("자신의 문제SET은 다운로드 할 수 없습니다.");
  }
}

function createNewProblemSet(_name: string, _tag: string) {
  return new Promise(function (resolve, reject) {
    apiClient.post('/problem-set', { 'name': _name, 'owner': USER_SN[0], 'tag': _tag })
      .then((response) => {
        const responseJson = response.data;
        resolve(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
      })
      .catch((error) => { console.error(error); });
  });
}

function getNewProblemSetSN() {
  return new Promise<string>(function (resolve, reject) {
    apiClient.get('/problem-set/owner/' + USER_SN[0])
      .then((response) => {
        const responseJson = response.data;
        var res = JSON.parse(jsonEscape(responseJson)).array;
        resolve(res[res.length - 1].SN);
      })
      .catch((error) => { console.error(error); });
  });
}

function getCategory(_SN: string) {
  return new Promise<any[]>(function (resolve, reject) {
    apiClient.get('/problem-set/' + _SN + '/category')
      .then((response) => {
        const responseJson = response.data;
        var res = JSON.parse(jsonEscape(responseJson)).array;
        resolve(res);
      })
      .catch((error) => { console.error(error); });
  });
}

function createNewCategory(_name: string, _newProblemSetSN: string) {
  return new Promise(function (resolve, reject) {
    apiClient.post('/category', { 'name': _name, 'problemSet': _newProblemSetSN })
      .then((response) => {
        const responseJson = response.data;
        resolve(responseJson);
      })
      .catch((error) => { console.error(error); });
  });
}

function getNewCategorySN(_problemSetSN: string) {
  return new Promise<string>(function (resolve, reject) {
    apiClient.get('/problem-set/' + _problemSetSN + '/category')
      .then((response) => {
        const responseJson = response.data;
        var res = JSON.parse(jsonEscape(responseJson)).array;
        resolve(res[res.length - 1].SN);
      })
      .catch((error) => { console.error(error); });
  });
}

function getProblem(_categorySN: string) {
  return new Promise<any[]>(function (resolve, reject) {
    apiClient.get('/category/' + _categorySN + '/problem')
      .then((response) => {
        const responseJson = response.data;
        let res = JSON.parse(jsonEscape(responseJson)).array;
        resolve(res);
      })
      .catch((error) => { console.error(error); });
  });
}

function createNewProblem(_question: string, _answer: string, _newCategorySN: string, _hit: string) {
  return new Promise(function (resolve, reject) {
    apiClient.post('/problem', { 'question': _question, 'answer': _answer, 'category': _newCategorySN, 'hit': _hit.toString() })
      .then((response) => {
        const responseJson = response.data;
        resolve(responseJson);
      })
      .catch((error) => { console.error(error); });
  });
}

function hitup(_SN: string) {
  return new Promise(function (resolve, reject) {
    apiClient.put('/problem-set/' + _SN + '/hitup', {})
      .then((response) => {
        const responseJson = response.data;
        resolve(responseJson);
      })
      .catch((error) => { console.error(error); });
  });
}

export default function SearchScreenRow({ navigation, SN, name, owner, tag, hit, visible }: Props) {
  return (
    <TouchableOpacity>
      <View style={visible ? styles.container : { display:'none' as const }}>
        <View style={styles.photo}>
          <AntDesign name="inbox" size={30} color="black" />
        </View>
        <View style={styles.container_text}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.title}><Text>만든이: </Text> {owner}</Text>
            <Text style={styles.title}><Text>태그: </Text> {tag}</Text>
            <Text style={styles.title}><Text>다운로드 횟수: </Text> {hit}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center' }}
          onPress={() => { copyProblemSet(SN, name, tag, owner); }}>
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
