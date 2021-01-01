import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchCategoryScreenRow from '../rows/SearchCategoryScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape, PROBLEMSET_SELECTED } from "../Common";

export default function SearchCategoryScreen({ navigation, route }) {
  const { problemSetSN, problemSetName, problemSetHit } = route.params;
  const [DATA, setDATA] = React.useState([]); // 서버로 부터 받은 데이터를 저장하는 변수
  const [problemDATA, setProblemDATA] = React.useState([]);
  const [DATA_copy, setDATA_copy] = React.useState([]); 
  const [isSearch, setIsSearch] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [name, setName] = React.useState("~의 카테고리");


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('SearchCategoryScreen focused!');
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
      if(element.name.indexOf(_text) != -1){
        DATA[i].visible = true;
      }else{
        DATA[i].visible = false;
      }
      res.push(DATA[i]);
    }
    setDATA(res);
  }

  function getDATA() {
    fetch(APIVO+'/problem-set/'+problemSetSN+'/category', {
      method: 'GET'
    })
    .then((response) => response.text())
    .then((responseJson) => {
      console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
      var res = JSON.parse(jsonEscape(responseJson)).array;
      if(res.length > 0){
        res.unshift({"SN": '-1', "name":"모든 문제", "problemSet":problemSetSN});
      }
      setDATA(res);
      // DATA.unshift({"SN":-1, "name":"모든 문제", "problemSet":problemSetSN});
      setName(problemSetName+"의 카테고리");
      
      getProblem(res);
      // setSpinner(false);
    })
    .catch((error) => {
        console.error(error);
    });
  }

  function getProblem(_DATA) {
    let tmp_data = [];
    // console.log('_DATA.length '+_DATA.length);
    const datalength = _DATA.length;
    let cnt = 0;

    for (let i = 1; i < _DATA.length; i++) {
      // console.log("getProblem called! "+DATA[i].SN)
      fetch(APIVO + '/category/' + _DATA[i].SN + '/problem', {
        method: 'GET'
      })
      .then((response) => response.text())
      .then((responseJson) => {
        // console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
        cnt++;
        var tt = JSON.parse(jsonEscape(responseJson)).array;
        tt.forEach(element => {
          tmp_data.push(element);
        });

        if (cnt == datalength - 1) {
          setProblemDATA(tmp_data);
          let tmp_hitset = [];
          for (let j = 0; j < tmp_data.length; j++) {
            tmp_hitset.push(parseInt(tmp_data[j].hit));
          }
          tmp_hitset.sort();
          const hitset = new Set(tmp_hitset);

          var res = _DATA;
          for (const item of hitset) {
            res.push({"SN":('@'+item), "name":"hit "+item, "problemSet":problemSetSN})
          }

          for (let j = 0; j < res.length; j++) {
            res[j].visible = true;
          }

          setDATA(res);
          console.log('fffff '+JSON.stringify(res, undefined, 4));
          setDATA_copy(res);
        }
      })
      .catch((error) => {
          console.error(error);
      });
    }
  }

  return (
    <SafeAreaView style={{}}>
      <View style={{ margin: 20, marginBottom: 0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text);}} autoFocus ></TextInput> :
          <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
            <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>
          </View>
        }
        <TouchableOpacity style={{ alignSelf: 'flex-end', alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
          {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
        </TouchableOpacity>
      </View>
      
      <KeyboardAwareScrollView>
        <ScrollView style={{}}>
          <FlatList
            data={DATA}
            renderItem={({ item }) => <SearchCategoryScreenRow
              navigation={navigation}
              SN={item.SN}
              name={item.name}
              problemSet={item.problemSet}
              category={DATA}
              visible={item.visible}
            />}
            keyExtractor={item => item.SN}
          />
        </ScrollView>
      </KeyboardAwareScrollView>
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