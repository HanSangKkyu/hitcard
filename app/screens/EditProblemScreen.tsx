import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, CategoryData } from '../types';
import { WINDOW_HEIGHT, jsonEscape, apiClient } from "../Common";
import { Picker } from '@react-native-picker/picker';

type EditProblemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProblemScreen'>;
type EditProblemScreenRouteProp = RouteProp<RootStackParamList, 'EditProblemScreen'>;

type Props = {
  navigation: EditProblemScreenNavigationProp;
  route: EditProblemScreenRouteProp;
};

export default function EditProblemScreen({ navigation, route }: Props) {
  const { SN, question, answer, category, hit, problemSet } = route.params;
  const [DATA, setDATA] = React.useState<CategoryData[]>([]);
  const [question_e, setQuestion_e] = React.useState(question);
  const [answer_e, setAnswer_e] = React.useState(answer);
  const [category_e, setCategory_e] = React.useState(category);
  const [hit_e, setHit_e] = React.useState(parseInt(hit));
  const [editEnable, setEditEnable] = React.useState(false);

  const pickerItems = DATA.map((element, i) => {
    return (<Picker.Item label={element.name} key={i} value={element.SN} />)
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if(question_e && answer_e){
      setEditEnable(true);
    }else{
      setEditEnable(false);
    }
  }, [question_e, answer_e]);

  function getDATA() {
    apiClient.get('/problem-set/' + problemSet + '/category')
      .then((response) => {
        const responseJson = response.data;
        setDATA(JSON.parse(jsonEscape(responseJson)).array);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function edit_problem() {
    if(!editEnable){
      return
    }

    apiClient.put('/problem/'+SN, {
      'question' : question_e,
      'answer' : answer_e,
      'category' : category_e,
      'hit' : hit_e.toString()
    })
    .then((response) => {
      navigation.goBack();
    })
    .catch((error) => {
        console.error(error);
    });
  }

  return (
    <SafeAreaView style={{ flexDirection: 'column', margin: 20, }}>
      <View style={{ borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제 수정하기</Text>
      </View>
      <KeyboardAwareScrollView style={{}}>
        <View style={{ flexDirection: 'column', height: WINDOW_HEIGHT - 100 }}>
          <TextInput
            style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, padding:10 }}
            multiline={true}
            numberOfLines={10}
            value={question_e}
            onChangeText={(text) => setQuestion_e(text)}
          />
          <TextInput
            style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, padding:10 }}
            multiline={true}
            numberOfLines={10}
            value={answer_e}
            onChangeText={(text) => setAnswer_e(text)}
          />
          <Picker
            style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, justifyContent: 'center', }}
            selectedValue={category_e}
            onValueChange={(itemValue: string | number) => setCategory_e(itemValue as string)}>
            {pickerItems}
          </Picker>
          <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: 'white', borderWidth: 1 }}>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }} onPress={() => { setHit_e(hit_e + 1) }}>
              <AntDesign name="caret-up" size={24} color="gray" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignContent: 'center', justifyContent: 'flex-start' }}>
              <Text>H!T</Text>
              <Text style={{ alignSelf: 'center' }}>{hit_e}</Text>
            </View>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }} onPress={() => { setHit_e(hit_e - 1) }}>
              <AntDesign name="caret-down" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'white', borderWidth: 1 }} onPress={() => {edit_problem()}}>
            <Text style={{ alignSelf: 'center', color:editEnable?'black':'gray' }}>완료</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
