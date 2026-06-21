import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, CategoryData } from '../types';
import { WINDOW_HEIGHT, jsonEscape, apiClient } from "../Common";
import { Picker } from '@react-native-community/picker';

type AddProblemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddProblemScreen'>;
type AddProblemScreenRouteProp = RouteProp<RootStackParamList, 'AddProblemScreen'>;

type Props = {
  navigation: AddProblemScreenNavigationProp;
  route: AddProblemScreenRouteProp;
};

export default function AddProblemScreen({ navigation, route }: Props) {
  const { categorySN, problemSet } = route.params;
  const [DATA, setDATA] = React.useState<CategoryData[]>([]);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [category, setCategory] = React.useState(categorySN);
  const [hit, setHit] = React.useState(0);
  const [createEnable, setCreateEnable] = React.useState(false);

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
    if (question && answer) {
      setCreateEnable(true);
    } else {
      setCreateEnable(false);
    }
  }, [question, answer]);

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

  function create_problem() {
    if (!createEnable) {
      return
    }

    apiClient.post('/problem', {
      'question': question,
      'answer': answer,
      'category': category,
      'hit': hit.toString()
    })
      .then((response) => {
        setQuestion('');
        setAnswer('');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>){
    if (e.nativeEvent.key === 'Tab') {
      create_problem();
    }
  }

  return (
    <SafeAreaView style={{ flexDirection: 'column', margin: 20, }}>
      <View style={{ borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제 추가하기</Text>
      </View>
      <KeyboardAwareScrollView style={{}}>
        <View style={{ flexDirection: 'column', height: WINDOW_HEIGHT - 100 }}>
          <TextInput
            style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, padding: 10 }}
            multiline={true}
            numberOfLines={10}
            value={question}
            onChangeText={(text) => setQuestion(text)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <TextInput
            style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, padding: 10 }}
            multiline={true}
            numberOfLines={10}
            value={answer}
            onChangeText={(text) => setAnswer(text)}
            onKeyPress={handleKeyPress}
          />
          <Picker
            style={{ flex: 1, backgroundColor: 'white', borderWidth: 1, justifyContent: 'center', }}
            selectedValue={category}
            onValueChange={(itemValue: string | number) => { setCategory(itemValue as string) }}>
            {pickerItems}
          </Picker>
          <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: 'white', borderWidth: 1 }}>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }} onPress={() => { setHit(hit + 1) }}>
              <AntDesign name="caretup" size={24} color="gray" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignContent: 'center', justifyContent: 'flex-start' }}>
              <Text>H!T</Text>
              <Text style={{ alignSelf: 'center' }}>{hit}</Text>
            </View>
            <TouchableOpacity style={{ marginTop: 10, alignContent: 'center', justifyContent: 'flex-start' }} onPress={() => { setHit(hit - 1) }}>
              <AntDesign name="caretdown" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: 'white', borderWidth: 1 }} onPress={() => { create_problem() }}>
            <Text style={{ alignSelf: 'center', fontSize: 25, color: createEnable ? 'black' : 'gray' }}>만들기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
