import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreenRow from '../rows/SearchScreenRow';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape, PROBLEMSET_SELECTED } from "../Common";

export default function SearchScreen({ navigation }) {
  const [DATA, setDATA] = React.useState([]); // 서버로 부터 받은 데이터를 저장하는 변수
  const [DATA_copy, setDATA_copy] = React.useState([]); // 서버로 부터 받은 데이터를 저장하는 변수
  const [isSearch, setIsSearch] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('SearchScreen focused!');
    });
    return unsubscribe;
  }, [navigation, DATA]);

  React.useEffect(() => {
    if(!isSearch){
      let res = [];
      for (let i = 0; i < DATA.length; i++) {
        DATA[i].visible = true;
        res.push(DATA[i]);
      }
      setDATA(res);
    }
    // try {
    //   if(!isSearch){
    //     let res = [];
    //     for (let i = 0; i < DATA.length; i++) {
    //       DATA[i].visible = true;
    //       res.push(DATA[i]);
    //     }
    //     setDATA(res);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }, [isSearch]);

  
  function search(_text){
    let res = [];
    for (let i = 0; i < DATA.length; i++) {
      const element = DATA[i];
      if(element.name.indexOf(_text) != -1 ||
      element.tag.indexOf(_text) != -1||
      element.owner.indexOf(_text) != -1||
      element.hit.indexOf(_text) != -1){
        DATA[i].visible = true;
      }else{
        DATA[i].visible = false;
      }
      res.push(DATA[i]);
    }
    setDATA(res);
  }

  function getDATA() {
    fetch(APIVO+'/problem-set', {
      method: 'GET'
    })
    .then((response) => response.text())
    .then((responseJson) => {
      console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));

      let res = JSON.parse(jsonEscape(responseJson)).array;
      for (let i = 0; i < res.length; i++) {
        res[i].visible = true;
      }
      setDATA(res);
      setDATA_copy(res);
      // setSpinner(false);
    })
    .catch((error) => {
        console.error(error);
    });
  }

  return (
    <SafeAreaView style={{ }}>
      <View style={{ margin: 20, marginBottom:0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
          {/* <MaterialIcons name="menu" size={24} color="black" /> */}
        </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text);}} autoFocus ></TextInput> : <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제 탐색</Text>}
        <TouchableOpacity style={{ alignSelf: 'flex-end', alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
          {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView>
        <FlatList style={{ height: WINDOW_HEIGHT - 140 }} 
          data={DATA}
          renderItem={({ item }) => <SearchScreenRow
            navigation={navigation}
            SN={item.SN}
            name={item.name}
            owner={item.owner}
            tag={item.tag}
            hit={item.hit}
            visible={item.visible}
          />}
          keyExtractor={item => item.SN}
        />
      </KeyboardAwareScrollView>
      <View>

      </View>
    </SafeAreaView>
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