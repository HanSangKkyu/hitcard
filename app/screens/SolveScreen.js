import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, FontAwesome5, Foundation, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

export default function SolveScreen({ navigation, route }) {
  const { selectedItem } = route.params;
  const [DATA, setDATA] = React.useState([]); // 서버로 부터 받은 데이터를 저장하는 변수
  const [isMenu, setIsMenu] = React.useState(false);
  const [nowIdex, setNowIdex] = React.useState(0);
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [hit, setHit] = React.useState('');
  const [isQuestTurn, setIsQuestTurn] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('SolveScreen focused!' + selectedItem);
    });
    return unsubscribe;
  }, [navigation, DATA]);

  React.useEffect(() => {
    if (DATA.length > 0) {
      setQuestion(DATA[nowIdex].question);
      setAnswer(DATA[nowIdex].answer);
      setHit(DATA[nowIdex].hit);
    }
  }, [nowIdex, isQuestTurn]);

  function getDATA() {
    for (let i = 0; i < selectedItem.length; i++) {
      fetch(APIVO + '/category/' + selectedItem[i] + '/problem', {
        method: 'GET'
      })
        .then((response) => response.text())
        .then((responseJson) => {
          console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array, undefined, 4));
          var tt = JSON.parse(jsonEscape(responseJson)).array;
          tt.forEach(element => {
            DATA.push(element)
          });
          setDATA(DATA);
          // setDATA_copy(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array));
          // setName(problemSetName + "의 카테고리");
          // setSpinner(false);

          if (i == selectedItem.length - 1) {
            console.log('abser' + DATA);
            setDATA(shuffle(DATA));
            setQuestion(DATA[0].question);
            setAnswer(DATA[0].answer);
            setHit(DATA[0].hit);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showNextProblem() {
    // console.log(nowIdex)
    // console.log(isQuestTurn)
    // console.log(DATA[nowIdex])
    if (!isQuestTurn && DATA.length - 1 > nowIdex) {
      setNowIdex(nowIdex + 1);
    }
    setIsQuestTurn(!isQuestTurn);
  }

  function showPreviousProblem() {
    // console.log(nowIdex)
    // console.log(isQuestTurn)
    // console.log(DATA[nowIdex])

    if (isQuestTurn && nowIdex > 0) {
      setNowIdex(nowIdex - 1);
    }
    setIsQuestTurn(!isQuestTurn);
  }

  return (
    <Provider>
      <SafeAreaView style={{ flexDirection: 'column', height: WINDOW_HEIGHT }}>
        <Portal>
          <Modal visible={isMenu} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column' }}>
            {/* <Text>hi</Text> */}
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { setIsMenu(!isMenu) }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <FontAwesome5 name="file-import" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>다른 카테고리로 이동</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { setIsMenu(!isMenu) }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Foundation name="page-remove" size={30} color="black" />
                <Text style={{ marginLeft: 12, alignSelf: 'center', fontSize: 18 }}>이 문제 삭제</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 60 }} onPress={() => { setIsMenu(!isMenu) }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <AntDesign name="close" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>닫기</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </Portal>
        <View style={{ borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, margin: 20 }}>
          <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제이름 - 카테고리</Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'column', margin: 20 }}>
          <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', }}>
            <Text style={{color:isQuestTurn?'black':'red'}}>{DATA.length > 0?isQuestTurn?DATA[nowIdex].question:DATA[nowIdex].answer:null}</Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { setIsMenu(!isMenu) }}>
              <Feather name="more-vertical" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.5 }}>
            <Text style={{ alignSelf: 'center', fontSize: 30 }}>{nowIdex+1} 번째 {isQuestTurn?"문제":"답"}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }}>
              <AntDesign name="caretup" size={24} color="gray" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignContent: 'center', justifyContent: 'flex-start' }}>
            <Text>
              H!T
            </Text>
            <Text style={{ alignSelf: 'center' }}>
              {DATA.length > 0?DATA[nowIdex].hit:null}
            </Text>
            </View>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }}>
              <AntDesign name="caretdown" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1, }} onPressOut={() => { showPreviousProblem() }}>
              <AntDesign name="caretleft" size={40} color="gray" style={{ alignSelf: 'center', justifyContent: 'center' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, }} onPressOut={() => { showNextProblem() }}>
              <AntDesign name="caretright" size={40} color="gray" style={{ alignSelf: 'center', justifyContent: 'center' }} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Provider>
  );
}