import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Alert, Platform } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, FontAwesome5, Foundation, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ProblemData } from '../types';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, jsonEscape, apiClient } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

type SolveScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SolveScreen'>;
type SolveScreenRouteProp = RouteProp<RootStackParamList, 'SolveScreen'>;

type Props = {
  navigation: SolveScreenNavigationProp;
  route: SolveScreenRouteProp;
};

export default function SolveScreen({ navigation, route }: Props) {
  const { selectedItem, category, problemSetSN } = route.params;
  const [DATA, setDATA] = React.useState<ProblemData[]>([]);
  const [isMenu, setIsMenu] = React.useState(false);
  const [isCategory, setIsCategory] = React.useState(false);
  const [nowIdex, setNowIdex] = React.useState(0);
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [hit, setHit] = React.useState('');
  const [isQuestTurn, setIsQuestTurn] = React.useState(true);

  let nowIdex_c = 0;
  let isQuestTurn_c = true;
  let hit_c = 0;

  const categoryList = category.map((element) => {
    return (
      <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { edit_problem_category(element.SN); setIsCategory(!isCategory); }}>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Feather name="folder" size={24} color="black" />
          <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>{element.name}</Text>
        </View>
      </TouchableOpacity>)
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (DATA.length > 0) {
      setQuestion(DATA[nowIdex].question);
      setAnswer(DATA[nowIdex].answer);
      setHit(DATA[nowIdex].hit);
      hit_c = parseInt(DATA[nowIdex].hit);
    }
  }, [nowIdex, isQuestTurn]);

  React.useEffect(() => {
    if (DATA.length > 0) {
      setQuestion(DATA[0].question);
      setAnswer(DATA[0].answer);
      setHit(DATA[0].hit);

      if (!(Platform.OS === 'ios' || Platform.OS === 'android')) {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }
    }
  }, [DATA]);

  function getDATA() {
    let cnt = 1;
    let categorylength = category.length;
    let allProblem: ProblemData[] = [];
    for (let i = 1; i < categorylength; i++) {
      apiClient.get('/category/' + category[i].SN + '/problem')
        .then((response) => {
          const responseJson = response.data;
          cnt++;
          var tt: ProblemData[] = JSON.parse(jsonEscape(responseJson)).array;
          for (let j = 0; j < tt.length; j++) {
            allProblem.push(tt[j]);
          }

          if (cnt == categorylength) {
            var slctAllFlag = false;
            for (let j = 0; j < selectedItem.length; j++) {
              const element = selectedItem[j];
              if(element == '-1'){
                slctAllFlag = true;
                break;
              }
            }

            if(slctAllFlag){
              setDATA(shuffle(allProblem));
              return;
            }else{
              let real_problem: ProblemData[] = [];
              for (let j = 0; j < selectedItem.length; j++) {
                var item: string | number = selectedItem[j];
                if(item.toString().indexOf('@') != -1){
                  item = parseInt((item as string).substring(1));
                  for (let k = 0; k < allProblem.length; k++) {
                    if(allProblem[k].hit.toString() == item.toString()){
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
              var tmp_set = new Set(real_problem);
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

  function edit_problem_category(_category: string) {
    apiClient.put('/problem/' + DATA[nowIdex].SN + '/category', {
      'category': _category,
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function shuffle(a: ProblemData[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showNextProblem() {
    if (!isQuestTurn && DATA.length - 1 > nowIdex) {
      setNowIdex(nowIdex + 1);
    }
    setIsQuestTurn(!isQuestTurn);
  }

  function showPreviousProblem() {
    if (isQuestTurn && nowIdex > 0) {
      setNowIdex(nowIdex - 1);
    }
    setIsQuestTurn(!isQuestTurn);
  }

  function hitup() {
    apiClient.put('/problem/' + DATA[nowIdex].SN + '/hitup', {})
      .then((response) => {
        DATA[nowIdex].hit = (parseInt(DATA[nowIdex].hit) + 1).toString();
        setHit(DATA[nowIdex].hit);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function hitdown() {
    apiClient.put('/problem/' + DATA[nowIdex].SN + '/hitdown', {})
      .then((response) => {
        DATA[nowIdex].hit = (parseInt(DATA[nowIdex].hit) - 1).toString();
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
          { text: "Cancel", onPress: () => { console.log("cancel Pressed") }, style: "cancel" },
          { text: "OK", onPress: () => { delete_problem(); console.log("OK Pressed"); } }
        ],
        { cancelable: false }
      )
    } else {
      if (confirm("이 문제를 삭제하시겠습니까?")) {
        delete_problem();
      }
    }
  }

  function delete_problem() {
    apiClient.delete('/problem/' + DATA[nowIdex].SN)
      .then((response) => {
        console.log(response.data);
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

  function handleKeyDown(event: KeyboardEvent){
    if (event.key == "ArrowRight") {
      if (!isQuestTurn_c && DATA.length - 1 > nowIdex_c) {
        nowIdex_c = nowIdex_c + 1;
        setNowIdex(nowIdex_c);
      }
      isQuestTurn_c = !isQuestTurn_c;
      setIsQuestTurn(isQuestTurn_c);
    } else if (event.key == "ArrowLeft") {
      if (isQuestTurn_c && nowIdex_c > 0) {
        nowIdex_c = nowIdex_c - 1;
        setNowIdex(nowIdex_c);
      }
      isQuestTurn_c = !isQuestTurn_c;
      setIsQuestTurn(isQuestTurn_c);
    } else if (event.key == "ArrowUp") {
      apiClient.put('/problem/' + DATA[nowIdex_c].SN + '/hitup', {})
        .then((response) => {
          DATA[nowIdex_c].hit = (parseInt(DATA[nowIdex_c].hit) + 1).toString();
          setHit(DATA[nowIdex_c].hit);
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (event.key == "ArrowDown") {
      apiClient.put('/problem/' + DATA[nowIdex_c].SN + '/hitdown', {})
        .then((response) => {
          DATA[nowIdex_c].hit = (parseInt(DATA[nowIdex_c].hit) - 1).toString();
          setHit(DATA[nowIdex_c].hit);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Provider>
      <SafeAreaView style={{ flexDirection: 'column', height: WINDOW_HEIGHT }}>
        <Portal>
          <Modal visible={isMenu} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column' }}>
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
            <ScrollView style={{height:WINDOW_HEIGHT/2}}>
              {categoryList}
            </ScrollView>
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
            <AntDesign name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제풀기</Text>
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
              <AntDesign name="caret-up" size={24} color="gray" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignContent: 'center', justifyContent: 'flex-start' }}>
              <Text>H!T</Text>
              <Text style={{ alignSelf: 'center' }}>
                {DATA.length > 0 ? hit : null}
              </Text>
            </View>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }} onPress={() => { hitdown() }}>
              <AntDesign name="caret-down" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1, }} onPressOut={() => { showPreviousProblem() }} >
              <AntDesign name="caret-left" size={40} color="gray" style={{ alignSelf: 'center', justifyContent: 'center' }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, }} onPressOut={() => { showNextProblem() }}>
              <AntDesign name="caret-right" size={40} color="gray" style={{ alignSelf: 'center', justifyContent: 'center' }} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Provider>
  );
}
