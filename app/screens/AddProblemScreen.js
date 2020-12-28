import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, FontAwesome5, Foundation } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape } from "../Common";
import { Picker } from '@react-native-community/picker';
import { set } from 'react-native-reanimated';

export default function AddProblemScreen({ navigation, route }) {
  const { categorySN, problemSet } = route.params;
  const [DATA, setDATA] = React.useState([]); // 서버로 부터 받은 데이터를 저장하는 변수
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [category, setCategory] = React.useState(categorySN);
  const [hit, setHit] = React.useState(0);
  const [createEnable, setCreateEnable] = React.useState(false);


  let pickerItems = DATA.map((element,i) => { 
    return( <Picker.Item label={element.name} key={i} value={element.SN} />)
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('AddProblemScreen focused in '+categorySN);
    });
    return unsubscribe;
  }, [navigation, DATA]);

  React.useEffect(() => {
    if(question && answer){
      setCreateEnable(true);
    }else{
      setCreateEnable(false);
    }
  }, [question, answer]);

  function getDATA() {
    fetch(APIVO+'/problem-set/'+problemSet+'/category', {
      method: 'GET'
    })
    .then((response) => response.text())
    .then((responseJson) => {
      console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
      setDATA(JSON.parse(jsonEscape(responseJson)).array);
      // setSpinner(false);
      console.log('aasdf'+DATA);
    })
    .catch((error) => {
        console.error(error);
    });
  }

  function create_problem(){
    if(!createEnable){
      return
    }

    fetch(APIVO+'/problem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'question' : question,
        'answer' : answer,
        'category' : category,
        'hit' : hit.toString()
      })
    })
    .then((response) => response.text())
    .then((responseJson) => {
      // getDATA();
      setQuestion('');
      setAnswer('');
    })
    .catch((error) => {
        console.error(error);
    });
  }

  return (
    <SafeAreaView style={{ flexDirection:'column',margin: 20, }}>
      <View style={{ borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제 추가하기</Text>
      </View>
      <KeyboardAwareScrollView style={{}}>
        <View style={{flexDirection:'column', height:WINDOW_HEIGHT-100}}>
          <TextInput 
            style={{flex:1, backgroundColor:'white', borderWidth:1, padding:5}}
            multiline={true}     
            numberOfLines={10}
            value={question}
            onChangeText={(text) => setQuestion(text)}
            />
          <TextInput 
            style={{flex:1, backgroundColor:'white', borderWidth:1, padding:5}}
            multiline={true}     
            numberOfLines={10}
            value={answer}
            onChangeText={(text) => setAnswer(text)}
            />
          <Picker
            style={{flex:1,backgroundColor:'white',borderWidth:1, justifyContent:'center',}}
            selectedValue={category}
            onValueChange={(itemValue, itemIndex) => {setCategory(itemValue)}}>
            {pickerItems}
          </Picker>
          <View style={{flexDirection:'row', alignContent:'center', justifyContent:'center', paddingVertical:10, backgroundColor:'white', borderWidth:1}}>
            <TouchableOpacity style={{marginTop:10, alignContent:'center', justifyContent:'flex-start'}} onPress={()=>{setHit(hit+1)}}>
              <AntDesign name="caretup" size={24} color="gray" />
            </TouchableOpacity>
            <View style={{flexDirection:'column',marginLeft:10, marginRight:10, alignContent:'center', justifyContent:'flex-start' }}>
              <Text>
                H!T
              </Text>
              <Text style={{alignSelf:'center'}}>
                {hit}
              </Text>
            </View>
            <TouchableOpacity style={{marginTop:10, alignContent:'center', justifyContent:'flex-start'}} onPress={()=>{setHit(hit-1)}}>
              <AntDesign name="caretdown" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{flex:1, justifyContent:'center', alignContent:'center', backgroundColor:'white',borderWidth:1}} onPress={()=>{create_problem()}}>
            <Text style={{alignSelf:'center', fontSize:25, color:createEnable?'black':'gray'}}>만들기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}