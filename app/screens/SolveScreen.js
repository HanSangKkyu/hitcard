import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, FontAwesome5, Foundation, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

export default function SolveScreen({ navigation, route }) {
  const { selectedItem, category, problemSetSN } = route.params;
  const [DATA, setDATA] = React.useState([]); // 서버로 부터 받은 데이터를 저장하는 변수
  const [isMenu, setIsMenu] = React.useState(false);
  const [isCategory, setIsCategory] = React.useState(false);
  const [nowIdex, setNowIdex] = React.useState(0);
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [hit, setHit] = React.useState('');
  const [isQuestTurn, setIsQuestTurn] = React.useState(true);

  let categoryList = category.map((element, i) => {
    return (
      <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { edit_problem_category(element.SN); setIsCategory(!isCategory); }}>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Feather name="folder" size={24} color="black" />
          <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>{element.name}</Text>
        </View>
      </TouchableOpacity>)
  });

  function edit_problem_category(_category) {
    fetch(APIVO + '/problem/' + DATA[nowIdex].SN + '/category', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'category': _category,
      })
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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

  React.useEffect(() => {
    if (DATA.length > 0) {
      setQuestion(DATA[0].question);
      setAnswer(DATA[0].answer);
      setHit(DATA[0].hit);
    }
  }, [DATA]);

  function getDATA() {
    console.log('eiofo'+selectedItem.toString());
    let cnt = 1;
    let categorylength = category.length;
    let allProblem = [];
    for (let i = 1; i < categorylength; i++) {
      fetch(APIVO + '/category/' + category[i].SN + '/problem', {
        method: 'GET'
      })
        .then((response) => response.text())
        .then((responseJson) => {
          // console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array, undefined, 4));
          cnt++;
          
          var tt = JSON.parse(jsonEscape(responseJson)).array;
          for (let j = 0; j < tt.length; j++) {
            // const element = tt[j];
            console.log(JSON.stringify(tt[j], undefined, 4));
            allProblem.push(tt[j]);
          }
          // tt.forEach(element => {
          //   allProblem.push(element)
          // });

          // console.log('flag111 ',cnt,categorylength);
          if (cnt == categorylength) {
            console.log('abser' + allProblem);
            if(selectedItem.toString().indexOf('-1') != -1){
              // 모든 문제를 골랐을 시
              setDATA(shuffle(allProblem));        
              return;
            }else{
              let real_problem = [];
              for (let j = 0; j < selectedItem.length; j++) {
                var item = selectedItem[j];
                if(item.toString().indexOf('@') != -1){
                  // hit인 경우
                  item = parseInt(item.substring(1));
                  for (let k = 0; k < allProblem.length; k++) {
                    if(allProblem[k].hit.toString() == item){
                      real_problem.push(allProblem[k]);
                    } 
                  }
                }else{
                  // 일반 카테고리 경우
                  for (let k = 0; k < allProblem.length; k++) {
                    if(allProblem[k].category.toString() == item){
                      real_problem.push(allProblem[k]);
                    } 
                  }
                  
                }
              }
              var tmp_set =  new Set(real_problem);
              var result = Array.from(tmp_set);
              setDATA(shuffle(result));
            }
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

  function hitup() {

    fetch(APIVO + '/problem/' + DATA[nowIdex].SN + '/hitup', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array, undefined, 4));
        DATA[nowIdex].hit = parseInt(DATA[nowIdex].hit) + 1;
        setHit(DATA[nowIdex].hit);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function hitdown() {
    fetch(APIVO + '/problem/' + DATA[nowIdex].SN + '/hitdown', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array, undefined, 4));
        DATA[nowIdex].hit = parseInt(DATA[nowIdex].hit) - 1;
        setHit(DATA[nowIdex].hit);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function delete_problem_Q() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Alert.alert(
        "문제 삭제",
        "이 문제를 삭제하시겠습니까?",
        [
          {
            text: "Cancel",
            onPress: () => { console.log("cancel Pressed") },
            style: "cancel"
          },
          { text: "OK", onPress: () => { delete_problem(); console.log("OK Pressed"); } }
        ],
        { cancelable: false }
      )
    } else {
      if (confirm("이 문제를 삭제하시겠습니까?")) {
        delete_problem();
      } else {
        // 취소 버튼 클릭 시 동작
      }
    }
  }

  function delete_problem() {
    fetch(APIVO + '/problem/' + DATA[nowIdex].SN, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function goEditProblemScreen(){
    navigation.navigate("EditProblemScreen", {
      "SN": DATA[nowIdex].SN,
      "question": question,
      "answer": answer,
      "category": DATA[nowIdex].category,
      "hit": hit,
      "problemSet": problemSetSN
  });
  }

  return (
    <Provider>
      <SafeAreaView style={{ flexDirection: 'column', height: WINDOW_HEIGHT }}>
        <Portal>
          <Modal visible={isMenu} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column' }}>
            {/* <Text>hi</Text> */}
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { setIsCategory(!isCategory); setIsMenu(!isMenu); }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="file-move-outline" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>다른 카테고리로 이동</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { setIsMenu(!isMenu); goEditProblemScreen();}}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Feather name="edit" size={24} color="black" />
                <Text style={{ marginLeft: 12, alignSelf: 'center', fontSize: 18 }}>이 문제 수정</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { setIsMenu(!isMenu); delete_problem_Q(); }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color="black" />
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

          <Modal visible={isCategory} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>다른 카테고리로 이동</Text>
            {categoryList}
            <TouchableOpacity style={{ marginTop: 60 }} onPress={() => { setIsCategory(!isCategory) }}>
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
            <Text style={{ color: isQuestTurn ? 'black' : 'red' }}>{DATA.length > 0 ? isQuestTurn ? DATA[nowIdex].question : DATA[nowIdex].answer : null}</Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { setIsMenu(!isMenu) }}>
              <Feather name="more-vertical" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.5 }}>
            <Text style={{ alignSelf: 'center', fontSize: 30 }}>{nowIdex + 1} 번째 {isQuestTurn ? "문제" : "답"}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }} onPress={() => { hitup() }}>
              <AntDesign name="caretup" size={24} color="gray" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignContent: 'center', justifyContent: 'flex-start' }}>
              <Text>
                H!T
            </Text>
              <Text style={{ alignSelf: 'center' }}>
                {DATA.length > 0 ? DATA[nowIdex].hit : null}
              </Text>
            </View>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }} onPress={() => { hitdown() }}>
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