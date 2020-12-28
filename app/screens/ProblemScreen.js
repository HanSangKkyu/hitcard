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

export default function ProblemScreen({ route, navigation }) {
  const { categorySN, categoryName, problemSet } = route.params;
  const [DATA, setDATA] = React.useState('?'); // 서버로 부터 받은 데이터를 저장하는 변수
  const [DATA_copy, setDATA_copy] = React.useState('?'); 
  const [isSearch, setIsSearch] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [editEnable, setEditEnable] = React.useState(false);
  const [name, setName] = React.useState(categoryName);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [deleteEnable, setDeleteEnable] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('ProblemScreen focused!');
    });
    return unsubscribe;
  }, [navigation, DATA]);

  React.useEffect(() => {
    if(name){
      setEditEnable(true);
    }else{
      setEditEnable(false);
    }
  }, [navigation, name]);

  function getDATA() {
    fetch(APIVO+'/category/'+categorySN+'/problem', {
      method: 'GET'
    })
    .then((response) => response.text())
    .then((responseJson) => {
      console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
      setDATA(JSON.parse(jsonEscape(responseJson)).array);
      setDATA_copy(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array));
      // setSpinner(false);
    })
    .catch((error) => {
        console.error(error);
    });
  }

  function editCategoryName(){
    console.log('editEnable ' + editEnable);
    console.log('isEdit ' + isEdit);
    if(editEnable && isEdit){
      console.log('categorySN '+categorySN);
      fetch(APIVO+'/category/'+categorySN, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'name' : name,
          'problemSet' : problemSet
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
    }else{
      setIsEdit(true);
    }
  }

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

  function delete_problem(){
    if(!deleteEnable){
      return
    }

    selectedItem.forEach(element => {
      fetch(APIVO+'/problem/'+element, {
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

    // navigation.goBack();
    // navigation.navigate('ProblemScreen');
  }

  return (
    <Provider>
      <SafeAreaView style={{}}>
        <Portal>
          <Modal visible={modalVisible} style={{margin:10}} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column' }}>
            {/* <Text>hi</Text> */}
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { setModalVisible(!modalVisible) }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <FontAwesome5 name="file-import" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>다른 카테고리로 이동</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={() => { setModalVisible(!modalVisible) }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Foundation name="page-remove" size={30} color="black" />
                <Text style={{ marginLeft: 12, alignSelf: 'center', fontSize: 18 }}>이 문제 삭제</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 60 }} onPress={() => { setModalVisible(!modalVisible) }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <AntDesign name="close" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>닫기</Text>
              </View>
            </TouchableOpacity>
          </Modal>
        </Portal>
        <View style={{ margin: 20, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, marginBottom: 0 }}>
          <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} autoFocus ></TextInput> :
            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
              {isEdit ? <TextInput style={{ fontSize: 22, alignSelf: 'center' }} value={name} onChangeText={(text) => { setName(text) }} autoFocus></TextInput> : <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>}
              <TouchableOpacity style={{ marginLeft: 10, alignContent: 'center', justifyContent: 'center' }} onPress={() => { editCategoryName(); }}>
                {isEdit ? <Entypo name="check" size={24} color={editEnable?"black":"gray"} /> : <MaterialIcons name="edit" size={24} color="black" />}
              </TouchableOpacity>
            </View>
          }
          <TouchableOpacity style={{ alignSelf: 'flex-end', alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
            {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, }}>
          <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }} style={{ flex: 1, alignSelf: 'flex-start' }}>
            {/* <Text style={{ alignSelf: 'center', fontSize: Platform.OS === 'ios' || Platform.OS === 'android' ? 20 : 25 }}>이동</Text> */}
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="file-move-outline" size={24} color={deleteEnable?"black":"gray"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('AddProblemScreen', {'categorySN':categorySN, 'problemSet':problemSet}) }} style={{ flex: 1, alignSelf: 'flex-start' }}>
            {/* <Text style={{ alignSelf: 'center', fontSize: Platform.OS === 'ios' || Platform.OS === 'android' ? 20 : 25 }}>문제 추가</Text> */}
            <Ionicons style={{ alignSelf: 'center' }} name="add" size={24} color="black" />
          </TouchableOpacity>
          {Platform.OS === 'ios' || Platform.OS === 'android' ?
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                if(!deleteEnable){
                  return
                }
                Alert.alert(
                  "문제 삭제",
                  "선택한 문제를 삭제하시겠습니까?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => {console.log("cancel Pressed")},
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => {delete_problem();console.log("OK Pressed");} }
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

                if (confirm("선택한 문제를 삭제하시겠습니까?")) {
                  delete_problem();
                } else {
                  // 취소 버튼 클릭 시 동작
                }
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color={deleteEnable?"black":"gray"} />
            </TouchableOpacity>
          }
        </View>
        <KeyboardAwareScrollView>
          <ScrollView style={{height:WINDOW_HEIGHT-100}}>
            <FlatList
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
              />}
              keyExtractor={item => item.SN}
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