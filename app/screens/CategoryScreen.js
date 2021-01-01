import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CategoryScreenRow from '../rows/CategoryScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

export default function CategoryScreen({ route, navigation }) {
  const {problemSetSN, problemSetName} = route.params;
  const [DATA, setDATA] = React.useState([]); // 서버로 부터 받은 데이터를 저장하는 변수
  const [problemDATA, setProblemDATA] = React.useState([]);
  const [DATA_copy, setDATA_copy] = React.useState('?'); 
  const [isSearch, setIsSearch] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [name, setName] = React.useState(problemSetName+"의 카테고리");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [createEnable, setCreateEnable] = React.useState(false);
  const [createName, setCreateName] = React.useState("");
  const [deleteEnable, setDeleteEnable] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState([]);
  


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      // setSelectedItem([]);
      getDATA();
      console.log('CategoryScreen focused!');
    });
    // console.log(DATA);
    
    return unsubscribe;
  }, [navigation, DATA]);

  React.useEffect(() => {
    if(createName){
      setCreateEnable(true);
    }else{
      setCreateEnable(false);
    }

  }, [navigation, createName]);

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

  function toggleSelectedItem(_SN){
    const idx = selectedItem.indexOf(_SN)
    if (idx > -1) {
      selectedItem.splice(idx, 1)
      setSelectedItem(selectedItem);
    }else{
      selectedItem.push(_SN);
      setSelectedItem(selectedItem);
    }

    if(selectedItem.length > 0){
      setDeleteEnable(true);
    }else{
      setDeleteEnable(false);
    }

    console.log(selectedItem);
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
        res.unshift({"SN": -1, "name":"모든 문제", "problemSet":problemSetSN});
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

  function create_category(){
    if(!createEnable){
      return
    }

    fetch(APIVO+'/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'name' : createName,
        'problemSet' : problemSetSN
      })
    })
    .then((response) => response.text())
    .then((responseJson) => {
      getDATA();
    })
    .catch((error) => {
        console.error(error);
    });
    setModalVisible(!modalVisible);
  }

  function delete_category(){
    if(!deleteEnable){
      return
    }

    selectedItem.forEach(element => {
      fetch(APIVO+'/category/'+element, {
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

  function goSolve(){
    console.log(deleteEnable);
    if(deleteEnable){
      navigation.navigate('SolveScreen',{
        "selectedItem":selectedItem,
        "category":DATA,
        "problemSetSN":problemSetSN
      });
      // for (let i = 0; i < selectedItem.length; i++) {
      //   toggleSelectedItem(selectedItem[i]);
      // }
    }
  }

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

  return (
    <Provider>
      <SafeAreaView style={{}}>
        <Portal>
          <Modal visible={modalVisible} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column', marginBottom: 100 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>새 카테고리 만들기</Text>
            <TextInput style={{ borderWidth: 1, height: 30, fontSize: 20, paddingBottom: 5, paddingLeft: 5 }} onChangeText={(text)=>{setCreateName(text)}} autoFocus></TextInput>
            <View style={{ marginTop: 10, flexDirection: 'row' }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { setModalVisible(!modalVisible) }}>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  <AntDesign name="close" size={24} color="black" />
                  <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>취소</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => { create_category(); }}>
                <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                  <Entypo name="check" size={24} color={createEnable?"black":"gray"} />
                  <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18, color:createEnable?'black':'gray' }}>생성</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        <View style={{ margin: 20, marginBottom: 0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
          <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={()=>{navigation.goBack();}} >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 30, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text);}} autoFocus ></TextInput> :
            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
              <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>
              {/* {isEdit ? <TextInput style={{ fontSize: 22, alignSelf: 'center' }} value={name} onChangeText={(text) => { setName(text) }} autoFocus></TextInput> : <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>}
              <TouchableOpacity style={{ marginLeft: 10, alignContent: 'center', justifyContent: 'center' }} onPress={() => { setIsEdit(!isEdit) }}>
                {isEdit ? <Entypo name="check" size={24} color="black" /> : <MaterialIcons name="edit" size={24} color="black" />}
              </TouchableOpacity> */}
            </View>
          }
          <TouchableOpacity style={{ alignSelf: 'flex-end', alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
            {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, alignContent: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => { goSolve() }} style={{ flex: 1, alignSelf: 'center', }}>
            {/* <Text style={{alignSelf:'center', fontSize: Platform.OS === 'ios' || Platform.OS === 'android' ? 20 : 25 }}>문제풀기</Text> */}
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="play-outline" size={24} color={deleteEnable?"black":"gray"} />
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => { setModalVisible(!modalVisible) }}  style={{ flex: 1, alignSelf: 'center', }}>
            {/* <Text style={{alignSelf:'center', fontSize: Platform.OS === 'ios' || Platform.OS === 'android' ? 20 : 25 }}>카테고리 추가</Text> */}
            <Ionicons style={{ alignSelf: 'center' }} name="add" size={24} color="black" />
          </TouchableOpacity>
          {Platform.OS === 'ios' || Platform.OS === 'android' ?
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                if(!deleteEnable){
                  return
                }
                Alert.alert(
                  "카테고리 삭제",
                  "❗주의❗\n선택한 카테고리에 들어있는 모든 문제가 함께 삭제됩니다.\n정말로 삭제하시겠습니까?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => {delete_category();console.log("OK Pressed");} }
                  ],
                  { cancelable: false }
                );
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color={deleteEnable?"black":"gray"} />
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                if(!deleteEnable){
                  return
                }

                if (confirm("❗주의❗\n선택한 카테고리에 들어있는 모든 문제가 함께 삭제됩니다.\n정말로 삭제하시겠습니까?")) {
                  delete_category();console.log("OK Pressed");
                } else {
                  console.log("Cancel Pressed")
                }
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color={deleteEnable?"black":"gray"} />
            </TouchableOpacity>
          }
        </View>
        <KeyboardAwareScrollView>
          <ScrollView style={{}}>
            <FlatList
              data={DATA}
              renderItem={({ item }) => <CategoryScreenRow
                navigation={navigation}
                SN={item.SN}
                name={item.name}
                problemSet={item.problemSet}
                toggleSelectedItem = {toggleSelectedItem}
                category={DATA}
                visible={item.visible}
                selectedItem={selectedItem}
              />}
              keyExtractor={item => item.SN.toString()}
            />
          </ScrollView>
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