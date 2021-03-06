import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, Entypo, FontAwesome5, Foundation } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProblemScreenRow from '../rows/ProblemScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

export default function ProblemScreen({ navigation, route }) {
  const { categorySN, categoryName, problemSet, category } = route.params;
  const [DATA, setDATA] = React.useState([]); // 실제 render 되고 있는 item들
  const [DATA_result, setDATA_result] = React.useState('?'); // 검색된 결과 item들, render를 대기중인 item들
  const [DATA_all, setDATA_all] = React.useState('?'); // 모든 item 데이터들
  const [categoryDATA, setCategoryDATA] = React.useState([]);
  const [isSearch, setIsSearch] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [editEnable, setEditEnable] = React.useState(false);
  const [name, setName] = React.useState(categoryName);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [deleteEnable, setDeleteEnable] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState([]);
  const [PAGE, setPAGE] = React.useState(1);

  let categoryList = categoryDATA.map((element, i) => {
    return (
      <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { edit_problem_category(element.SN); setModalVisible(!modalVisible); }}>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Feather name="folder" size={24} color="black" />
          <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>{element.name}</Text>
        </View>
      </TouchableOpacity>)
  });
  // let pickerItems = DATA.map((element, i) => {
  //   return (<Picker.Item label={element.name} key={i} value={element.SN} />)
  // });

  let timeoutID; // 검색결과를 보여주는 settimeout함수가 담기는 곳
  const ITEMS_PER_PAGE = 20; // 한번에 가져올 페이지당 item 수

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getCategoryDATA();
      getDATA();
      console.log('ProblemScreen focused!');
    });
    return unsubscribe;
  }, [navigation, DATA]);

  React.useEffect(() => {
    if (name) {
      setEditEnable(true);
    } else {
      setEditEnable(false);
    }
  }, [navigation, name]);

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
    

    // 사용자 지정 카테고리로 들어온 경우
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
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getCategoryDATA() {
    fetch(APIVO + '/problem-set/' + problemSet + '/category', {
      method: 'GET'
    })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
        setCategoryDATA(JSON.parse(jsonEscape(responseJson)).array);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function editCategoryName() {
    console.log('editEnable ' + editEnable);
    console.log('isEdit ' + isEdit);
    if (editEnable && isEdit) {
      console.log('categorySN ' + categorySN);
      fetch(APIVO + '/category/' + categorySN, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'name': name,
          'problemSet': problemSet
        })
      })
        .then((response) => response.text())
        .then((responseJson) => {
          // getDATA();
          setName(name);
          setIsEdit(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setIsEdit(true);
    }
  }

  function toggleSelectedItem(_SN) {
    const idx = selectedItem.indexOf(_SN)
    if (idx > -1) {
      selectedItem.splice(idx, 1)
      setSelectedItem(selectedItem);
    } else {
      selectedItem.push(_SN);
      setSelectedItem(selectedItem);
    }

    if (selectedItem.length > 0) {
      setDeleteEnable(true);
    } else {
      setDeleteEnable(false);
    }

    console.log(selectedItem);
  }

  function delete_problem() {
    if (!deleteEnable) {
      return
    }

    selectedItem.forEach(element => {
      fetch(APIVO + '/problem/' + element, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })
        .then((response) => response.text())
        .then((responseJson) => {
          getDATA();
          toggleSelectedItem(element);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  function edit_problem_category(_category) {
    for (let i = 0; i < selectedItem.length; i++) {
      fetch(APIVO+'/problem/'+selectedItem[i]+'/category', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'category' : _category,
        })
      })
      .then((response) => response.text())
      .then((responseJson) => {
        console.log(responseJson);
        if(i == selectedItem.length-1){
          getDATA();
          selectedItem.length = 0;
        }
      })
      .catch((error) => {
          console.error(error);
      });
    }
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

  return (
    <Provider>
      <SafeAreaView style={{}}>
        <Portal>
          <Modal visible={modalVisible} style={{ margin: 10 }} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column' }}>
            <Text style={{fontSize:20, fontWeight:'bold', marginBottom:10}}>다른 카테고리로 이동</Text>
            {categoryList}
            <TouchableOpacity style={{ marginTop: 60 }} onPress={() => { setModalVisible(!modalVisible) }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <AntDesign name="close" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>취소</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </Portal>
        <View style={{ margin: 20, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, marginBottom: 0 }}>
          <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text);}} autoFocus ></TextInput> :
            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
              {isEdit ? <TextInput style={{ fontSize: 22, alignSelf: 'center' }} value={name} onChangeText={(text) => { setName(text) }} autoFocus></TextInput> : <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>}
              <TouchableOpacity style={{ marginLeft: 10, alignContent: 'center', justifyContent: 'center' }} onPress={() => { editCategoryName(); }}>
                {isEdit ? <Entypo name="check" size={24} color={editEnable ? "black" : "gray"} /> : <MaterialIcons name="edit" size={24} color="black" />}
              </TouchableOpacity>
            </View>
          }
          <TouchableOpacity style={{ alignSelf: 'flex-end', alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
            {isSearch ? <Feather name="x" size={24} color="black" />: <Octicons name="search" size={24} color="black" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, }}>
          <TouchableOpacity onPress={() => { if(deleteEnable){setModalVisible(!modalVisible)} }} style={{ flex: 1, alignSelf: 'flex-start' }}>
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="file-move-outline" size={24} color={deleteEnable ? "black" : "gray"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('AddProblemScreen', { 'categorySN': categorySN, 'problemSet': problemSet }) }} style={{ flex: 1, alignSelf: 'flex-start' }}>
            <Ionicons style={{ alignSelf: 'center' }} name="add" size={24} color="black" />
          </TouchableOpacity>
          {Platform.OS === 'ios' || Platform.OS === 'android' ?
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                if (!deleteEnable) {
                  return
                }
                Alert.alert(
                  "문제 삭제",
                  "선택한 문제를 삭제하시겠습니까?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => { console.log("cancel Pressed") },
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => { delete_problem(); console.log("OK Pressed"); } }
                  ],
                  { cancelable: false }
                );
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color={deleteEnable ? "black" : "gray"} />
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                if (!deleteEnable) {
                  return
                }

                if (confirm("선택한 문제를 삭제하시겠습니까?")) {
                  delete_problem();
                } else {
                  // 취소 버튼 클릭 시 동작
                }
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color={deleteEnable ? "black" : "gray"} />
            </TouchableOpacity>
          }
        </View>
        <KeyboardAwareScrollView>
          <FlatList style={{ height: WINDOW_HEIGHT - 140 }}
            data={DATA}
            renderItem={({ item }) => <ProblemScreenRow
              navigation={navigation}
              SN={item.SN}
              question={item.question}
              answer={item.answer}
              category={item.category}
              hit={item.hit}
              toggleSelectedItem={toggleSelectedItem}
              problemSet={problemSet}
              visible={item.visible}
            />}
            onEndReachedThreshold={1}
            onEndReached={()=>{loadMore()}}
            keyExtractor={item => item.SN}
          />
        </KeyboardAwareScrollView>
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