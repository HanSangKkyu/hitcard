import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Modal } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_HEIGHT } from '../rows/Common';

export default function SolveScreen({ navigation }) {
  const [DATA, setDATA] = React.useState('?'); // 서버로 부터 받은 데이터를 저장하는 변수
  const [isSearch, setIsSearch] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('SolveScreen focused!');
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
    <SafeAreaView style={{ flexDirection:'column',margin: 20, height: WINDOW_HEIGHT }}>
      <View style={{ borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} autoFocus ></TextInput> : null}
          {isSearch ? null : <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제이름 - 카테고리</Text>}
      </View>
      <View style={{flex:1, flexDirection:'column'}}>
        <View style={{    flex: 3, alignItems: 'center', justifyContent: 'center',}}>
          <Text>신라시대의 왕은?</Text>
        </View>
        <View style={{flex:0.5}}>
          <TouchableOpacity style={{alignSelf:'flex-end'}} onPress={()=>{setModalVisible(!modalVisible)}}>
            <Feather name="more-vertical" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{flex:0.5}}>
          <Text style={{alignSelf:'center', fontSize:30}}>31번 문제</Text>
        </View>
        <View style={{flex:1, flexDirection:'row', alignContent:'center', justifyContent:'center'}}>
          <TouchableOpacity style={{marginTop:10, alignContent:'center', justifyContent:'flex-start'}}>
            <AntDesign name="caretup" size={24} color="gray" />
          </TouchableOpacity>
          <View style={{flexDirection:'column', marginLeft:10, marginRight:10, alignContent:'center', justifyContent:'flex-start' }}>
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
        <View style={{flex:2, flexDirection:'row'}}>
          <TouchableOpacity style={{flex:1,}}>
            <AntDesign name="caretleft" size={40} color="gray" style={{alignSelf:'center', justifyContent:'center'}}  />
          </TouchableOpacity>
          <TouchableOpacity style={{flex:1,}}>
            <AntDesign name="caretright" size={40} color="gray" style={{alignSelf:'center', justifyContent:'center'}} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}