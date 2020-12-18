import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, FontAwesome5, Foundation, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

export default function MyProblemSetScreen({ navigation }) {
  const [DATA, setDATA] = React.useState('?'); // 서버로 부터 받은 데이터를 저장하는 변수
  const [isSearch, setIsSearch] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('MyProblemSetScreen focused!');
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
    <Provider>
      <SafeAreaView style={{}}>
        <Portal>
          <Modal visible={modalVisible} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column' }}>
            <Text style={{fontSize: 18,fontWeight:'bold'}}>새 문제 SET 만들기</Text>
            <TextInput></TextInput>
            <TouchableOpacity style={{ marginTop: 60 }} onPress={() => { setModalVisible(!modalVisible) }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <AntDesign name="close" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>닫기</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </Portal>
        <View style={{ margin: 20, marginBottom: 0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
          <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
            {/* <AntDesign name="arrowleft" size={24} color="black" /> */}
            <MaterialIcons name="menu" size={24} color="black" />
          </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} autoFocus ></TextInput> : <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>내 문제 SET</Text>}
          <TouchableOpacity style={{ alignSelf: 'flex-end', alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
            {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, alignContent: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => { navigation.navigate('SearchScreen') }} style={{ flex: 1, alignSelf: 'center', }} >
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="cloud-search-outline" size={24} color="black" />
            {/* <Ionicons style={{ alignSelf: 'center'}} name="add" size={24} color="black" /> */}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }} style={{ flex: 1, alignSelf: 'center', }} >
            {/* <Text style={{alignSelf:'center', fontSize:Platform.OS === 'ios' || Platform.OS === 'android'? 20 : 25}}>추가</Text> */}
            <Ionicons style={{ alignSelf: 'center' }} name="add" size={24} color="black" />
          </TouchableOpacity>
          {Platform.OS === 'ios' || Platform.OS === 'android' ?
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                Alert.alert(
                  "카테고리 삭제",
                  "선택한 카테고리를 삭제하시겠습니까?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                  ],
                  { cancelable: false }
                );
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color="black" />
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                if (confirm("선택한 카테고리를 삭제하시겠습니까?")) {
                  // 확인 버튼 클릭 시 동작
                } else {
                  // 취소 버튼 클릭 시 동작
                }
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color="black" />
            </TouchableOpacity>
          }
        </View>
        <KeyboardAwareScrollView>
          <ScrollView style={{height:WINDOW_HEIGHT-100}}>
            <FlatList data={DATA}
              renderItem={({ item }) => <MyProblemSetScreenRow
                navigation={navigation}
                title={item.title}
              />}
              keyExtractor={item => item.id}
            />
          </ScrollView>
        </KeyboardAwareScrollView>
        <View>

        </View>
      </SafeAreaView>
    </Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 200,
    marginBottom: 100
  },
});