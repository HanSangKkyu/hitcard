import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { WINDOW_HEIGHT } from '../Common';
import { Picker } from '@react-native-community/picker';

type MakeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MakeScreen'>;

type Props = {
  navigation: MakeScreenNavigationProp;
};

export default function MakeScreen({ navigation }: Props) {
  const [DATA, setDATA] = React.useState([{ id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba', title: 'First Item' }]);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [category, setCategory] = React.useState("모든문제");

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

  function getDATA() {
    setDATA([
      { id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba', title: 'First Item' },
      { id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63', title: 'Second Item' },
      { id: '58694a0f-3da1-471f-bd9-145571e29d72', title: 'Third Item' },
    ]);
  }

  return (
    <SafeAreaView style={{ flexDirection:'column',margin: 20, }}>
      <View style={{ borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>~에 문제만들기</Text>
      </View>
      <KeyboardAwareScrollView style={{}}>
        <View style={{flexDirection:'column', height:WINDOW_HEIGHT-100}}>
          <TextInput
            style={{flex:1, backgroundColor:'white', borderWidth:1,}}
            multiline={true}
            numberOfLines={10}
            onChangeText={(text) => setQuestion(text)}
            />
          <TextInput
            style={{flex:1, backgroundColor:'white', borderWidth:1,}}
            multiline={true}
            numberOfLines={10}
            onChangeText={(text) => setAnswer(text)}
            />
          <Picker
            style={{flex:1,backgroundColor:'white',borderWidth:1}}
            selectedValue={category}
            onValueChange={(itemValue: string | number) => setCategory(itemValue as string)}>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>
          <TouchableOpacity style={{flex:1, justifyContent:'center', alignContent:'center', backgroundColor:'white',borderWidth:1}}>
            <Text style={{alignSelf:'center'}}>만들기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
