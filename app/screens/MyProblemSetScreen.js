import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, FontAwesome5, Foundation, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape, PROBLEMSET_SELECTED } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

export default function MyProblemSetScreen({ navigation }) {
  const [DATA, setDATA] = React.useState('?'); // 서버로 부터 받은 데이터를 저장하는 변수
  const [DATA_copy, setDATA_copy] = React.useState('?'); // 서버로 부터 받은 데이터를 저장하는 변수
  const [isSearch, setIsSearch] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [createEnable, setCreateEnable] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('MyProblemSetScreen focused!');
    });
    return unsubscribe;
  }, [navigation, DATA]);

  React.useEffect(() => {
    if (name.length > 0) {
      setCreateEnable(true);
    } else {
      setCreateEnable(false);
    }
  }, [navigation, name]);

  React.useEffect(() => {
    if(!isSearch){
      setDATA(DATA_copy);
    }
  }, [isSearch]);

  function getDATA() {
    fetch(APIVO+'/problem-set/owner/'+USER_SN[0], {
      method: 'GET'
    })
    .then((response) => response.text())
    .then((responseJson) => {
      console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
      setDATA(JSON.parse(jsonEscape(responseJson)).array);
      setDATA_copy(JSON.parse(jsonEscape(responseJson)).array);
      // setSpinner(false);
    })
    .catch((error) => {
        console.error(error);
    });
  }

  function createProblemSet() {
    // console.log(APIVO + '/problem-set');
    fetch(APIVO + '/problem-set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'name': name,
        'owner': USER_SN[0],
        'tag': tag
      })
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
        getDATA();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function search(_text){
    let res = [];
    for (let i = 0; i < DATA_copy.length; i++) {
      const element = DATA_copy[i];
      // console.log(JSON.stringify(element));
      if(element.name.indexOf(_text) != -1 ||
      element.tag.indexOf(_text) != -1||
      element.hit.indexOf(_text) != -1||
      element.created_data.indexOf(_text) != -1||
      element.modified_data.indexOf(_text) != -1){
        res.push(element);
      }
    }

    setDATA(res);
  }

  return (
    <Provider>
      <SafeAreaView style={{}}>
        {Platform.OS === 'android' ?
        <StatusBar
          backgroundColor="black"
          barStyle="default"
        />:null}
        <Portal>
          <Modal visible={modalVisible} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column', marginBottom: 100 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>새 문제 SET 만들기</Text>
            <TextInput style={{ borderWidth: 1, height: 40, fontSize: 20, padding: 5, marginBottom: 5 }} placeholder="문제SET 이름" onChangeText={(text) => { setName(text); }} autoFocus></TextInput>
            <TextInput style={{ borderWidth: 1, height: 40, fontSize: 20, padding: 5 }} placeholder="태그 (ex: tag1, tag2, tag3)" onChangeText={(text) => { setTag(text); }} ></TextInput>
            <View style={{ marginTop: 10, flexDirection: 'row' }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { setModalVisible(!modalVisible) }}>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  <AntDesign name="close" size={24} color="black" />
                  <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>취소</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { createProblemSet(); setModalVisible(!modalVisible); }}>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  <Entypo name="check" size={24} color={createEnable ? "black" : "gray"} />
                  <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18, color: createEnable ? 'black' : 'gray' }}>생성</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        <View style={{ margin: 20, marginBottom: 0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
          <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
            <MaterialIcons name="menu" size={24} color="black" />
          </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text) => {search(text);}} autoFocus ></TextInput> : <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>내 문제 SET</Text>}
          <TouchableOpacity style={{ alignSelf: 'flex-end', alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
            {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, alignContent: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => { navigation.navigate('SearchScreen') }} style={{ flex: 1, alignSelf: 'center', }} >
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="cloud-search-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }} style={{ flex: 1, alignSelf: 'center', }} >
            <Ionicons style={{ alignSelf: 'center' }} name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView>
          <ScrollView style={{ height: WINDOW_HEIGHT - 100 }}>
            <FlatList data={DATA}
              renderItem={({ item }) => <MyProblemSetScreenRow
                navigation={navigation}
                SN={item.SN}
                name={item.name}
                tag={item.tag}
                hit={item.hit}
                created_data={item.created_data}
                modified_data={item.modified_data}
                getDATA={getDATA}
              />}
              keyExtractor={item => item.name}
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