import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, FontAwesome5, Foundation } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../Common';
import { Picker } from '@react-native-community/picker';

export default function MakeScreen({ navigation }) {
  const [DATA, setDATA] = React.useState('?'); // 서버로 부터 받은 데이터를 저장하는 변수
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [category, setCategory] = React.useState("모든문제");

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('MakeScreen focused!');
    });
    return unsubscribe;
  }, [navigation, DATA]);

  function getDATA() {
    // fetch(APIVO+'/db', {
    //   method: 'GET'
    // })
    // .then((response) => response.text())
    // .then((responseJson) => {
    //   setDATA(JSON.parse(jsonEscape(responseJson)).array);
    //   setDATA_copy(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array));
    //   setSpinner(false);
    // })
    // .catch((error) => {
    //     console.error(error);
    // });
    setDATA([
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd9-145571e29d72',
        title: 'Third Item',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28a',
        title: 'First Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91a97f63',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-14557129d72',
        title: 'Third Item',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-ad53abb28ba',
        title: 'First Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
      },
    ]);
  }

  return (
    <SafeAreaView style={{ flexDirection:'column',margin: 20, }}>
      <View style={{ borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제 수정하기</Text>
      </View>
      <KeyboardAwareScrollView style={{}}>
        <View style={{flexDirection:'column', height:WINDOW_HEIGHT-100}}>
          <TextInput 
            style={{flex:1, backgroundColor:'white', borderWidth:1,}}
            multiline={true}     
            numberOfLines={10}
            onChangeText={(text) => setQuestion({text})}
            />
          <TextInput 
            style={{flex:1, backgroundColor:'white', borderWidth:1,}}
            multiline={true}     
            numberOfLines={10}
            onChangeText={(text) => setAnswer({text})}
            />
          <Picker
            style={{flex:1,backgroundColor:'white',borderWidth:1, justifyContent:'center',}}
            selectedValue={category}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>
          <View style={{flexDirection:'row', alignContent:'center', justifyContent:'center', paddingVertical:10, backgroundColor:'white', borderWidth:1}}>
            <TouchableOpacity style={{marginTop:10, alignContent:'center', justifyContent:'flex-start'}}>
              <AntDesign name="caretup" size={24} color="gray" />
            </TouchableOpacity>
            <View style={{flexDirection:'column',marginLeft:10, marginRight:10, alignContent:'center', justifyContent:'flex-start' }}>
              <Text>
                H!T
              </Text>
              <Text style={{alignSelf:'center'}}>
                2
              </Text>
            </View>
            <TouchableOpacity style={{marginTop:10, alignContent:'center', justifyContent:'flex-start'}}>
              <AntDesign name="caretdown" size={24} color="gray" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{flex:1, justifyContent:'center', alignContent:'center', backgroundColor:'white',borderWidth:1}}>
            <Text style={{alignSelf:'center'}}>만들기</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}