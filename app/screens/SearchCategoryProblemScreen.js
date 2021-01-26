import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, Entypo, FontAwesome5, Foundation } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchCategoryProblemScreenRow from '../rows/SearchCategoryProblemScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape } from "../Common";

export default function SearchCategoryProblemScreen({ navigation, route }) {
  const { categorySN, categoryName, problemSet, category } = route.params;
  const [DATA, setDATA] = React.useState([]); // 실제 render 되고 있는 item들
  const [DATA_result, setDATA_result] = React.useState('?'); // 검색된 결과 item들, render를 대기중인 item들
  const [DATA_all, setDATA_all] = React.useState('?'); // 모든 item 데이터들
  const [isSearch, setIsSearch] = React.useState(false);
  const [name, setName] = React.useState(categoryName);
  const [PAGE, setPAGE] = React.useState(1);

  let timeoutID; // 검색결과를 보여주는 settimeout함수가 담기는 곳
  const ITEMS_PER_PAGE = 20; // 한번에 가져올 페이지당 item 수

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('SearchCategoryProblemScreen focused!');
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
  }, [isSearch]);

  React.useEffect(() => {
    if(!isSearch){
      setDATA_result(DATA_all);
    }
  }, [isSearch]);

  React.useEffect(() => {
    setPAGE(1);
    setDATA(DATA_result.slice(0, ITEMS_PER_PAGE));
  }, [DATA_result]); // 검색이 완료되면
  
  function loadMore(){
    console.log('this is end!'+DATA.length);
    console.log('PAGE', PAGE);
    const end = (PAGE+1)*ITEMS_PER_PAGE;
    const newData = DATA_result.slice(0, end);
    console.log(newData.length);
    setPAGE(PAGE+1);
    setDATA(newData);
  }

  function search(_text){
    window.clearTimeout(timeoutID);
    timeoutID = window.setTimeout(function(){
      console.log("search real called!");
      let res = [];
      for (let i = 0; i < DATA_all.length; i++) {
        const element = DATA_all[i];
        if(element.question.indexOf(_text) != -1||
        element.answer.indexOf(_text) != -1||
        element.hit.indexOf(_text) != -1){
          res.push(DATA_all[i]);
        }
      }
      setDATA_result(res);
    }, 500);
  }

  function getDATA() {
    let tmp_data = [];
    console.log('categorySN '+categorySN);
    let categorylength = category.length;
    let cnt = 1;
    if(categorySN.toString() == "-1" || categorySN.toString().indexOf("@") != -1){
      
      for(let i=1;i<category.length;i++){
        fetch(APIVO + '/category/' + category[i].SN + '/problem', {
          method: 'GET'
        })
          .then((response) => response.text())
          .then((responseJson) => {
            // console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array, undefined, 4));
            cnt++;
            var tt = JSON.parse(jsonEscape(responseJson)).array;
            tt.forEach(element => {
              tmp_data.push(element);
            });
            if (cnt == categorylength) {
              for (let i = 0; i < tmp_data.length; i++) {
                tmp_data[i].visible = true;
              }

              if(categorySN.toString().indexOf("@") != -1){
                // hit 별로 보기로 들어온 경우
                let hit_data = [];
                for (let j = 0; j < tmp_data.length; j++) {
                  // console.log(tmp_data[j].hit+' '+parseInt(categorySN.substring(1)));
                  if(tmp_data[j].hit.toString() == categorySN.substring(1).toString()){
                    hit_data.push(tmp_data[j]);
                  }
                }
                setDATA_result(hit_data);
                setDATA_all(hit_data);
              }else{
                // 모든 문제 보기로 들어온 경우
                setDATA_result(tmp_data)
                setDATA_all(tmp_data);
              }
        
            }
            // setSpinner(false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      return;
    }
    

    // 사용자 지정 카테고리로 들어온 겨우
    fetch(APIVO + '/category/' + categorySN + '/problem', {
      method: 'GET'
    })
      .then((response) => response.text())
      .then((responseJson) => {
        // console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));

        let res = JSON.parse(jsonEscape(responseJson)).array;
        for (let i = 0; i < res.length; i++) {
          res[i].visible = true;
        }

        setDATA_result(res);
        setDATA_all(res);
        // setSpinner(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={{}}>
      <View style={{ margin: 20, marginBottom: 0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text)}} autoFocus ></TextInput> :
          <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
            <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>
          </View>
        }
        <TouchableOpacity style={{ alignSelf: 'flex-end', alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
          {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
        </TouchableOpacity>
      </View>
      
      <KeyboardAwareScrollView>
        <FlatList style={{ height: WINDOW_HEIGHT - 140 }}
          data={DATA}
          renderItem={({ item }) => <SearchCategoryProblemScreenRow
            navigation={navigation}
            SN={item.SN}
            question={item.question}
            answer={item.answer}
            category={item.category}
            hit={item.hit}
            problemSet={problemSet}
            visible={item.visible}
          />}
          onEndReachedThreshold={1}
          onEndReached={()=>{loadMore()}}
          keyExtractor={item => item.SN}
        />
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