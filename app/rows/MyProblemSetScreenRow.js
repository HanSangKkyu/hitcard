import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity, Button, TextInput, Alert, Platform } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, FontAwesome5, Foundation, Entypo } from '@expo/vector-icons';
import { Checkbox, Modal, Portal, Provider } from 'react-native-paper';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, APIVO, jsonEscape, PROBLEMSET_SELECTED } from "../Common";
import { set } from 'react-native-reanimated';
import MyProblemSetScreen from '../screens/MyProblemSetScreen'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    backgroundColor: "#f1f1f1",
    elevation: 2,
  },
  title: {
    fontSize: 20,
    color: '#3f3f3f',
    fontWeight: 'bold'
  },
  name: {
    fontSize: 14,
    color: '#3f3f3f',
    fontWeight: 'bold'
  },
  container_text: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center',
  },
  description: {
    fontSize: 11,
    color: '#3f3f3f',
    marginTop: 20,
    marginBottom: 20,
  },
  photo: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  displayname: {
    fontSize: 11,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: 'blue'
  },
});

export default function MyProblemSetScreenRow({ navigation, SN, name, tag, hit, created_data, modified_data, getDATA, visible }) {
  const [isSelected, setIsSelected] = React.useState(false); // 서버로 부터 받은 데이터를 저장하는 변수
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modifyEnable, setModifyEnable] = React.useState(false);
  const [nameInModal, setNameInModal] = React.useState(name);
  const [tagInModal, setTagInModal] = React.useState(tag);

  React.useEffect(() => {
    // console.log(nameInModal);
    // console.log(modifyEnable);
    if (nameInModal) {
      setModifyEnable(true);
    } else {
      setModifyEnable(false);
    }
  }, [nameInModal]);

  function editProblemSet() {
    // console.log(APIVO + '/problem-set/' + SN);
    fetch(APIVO + '/problem-set/' + SN, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'name': nameInModal,
        'owner': USER_SN[0],
        'tag': tagInModal,
        'hit': hit
      })
    })
      .then((response) => response.text())
      .then((responseJson) => {
        // console.log(responseJson)
        console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
        getDATA();

      })
      .catch((error) => {
        console.error(error);
      });
  }

  function deleteItem(){
    // console.log(APIVO + '/problem-set/' + SN);
    fetch(APIVO + '/problem-set/' + SN, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
      .then((response) => response.text())
      .then((responseJson) => {
        // console.log(responseJson)
        console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
        getDATA();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("CategoryScreen",{
          "problemSetSN" : SN,
          "problemSetName" : name
        });
      }}
    >

      <Portal>
        <Modal visible={modalVisible} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column', marginBottom: 100 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>문제SET 정보 편집</Text>
          <TextInput style={{ borderWidth: 1, height: 40, fontSize: 20, padding: 5, marginBottom: 5 }} placeholder="문제SET 이름" onChangeText={(text) => { setNameInModal(text); }} value={nameInModal} autoFocus></TextInput>
          <TextInput style={{ borderWidth: 1, height: 40, fontSize: 20, padding: 5 }} placeholder="태그 (ex: tag1, tag2, tag3)" value={tagInModal} onChangeText={(text) => { setTagInModal(text); }} ></TextInput>
          <View style={{ marginTop: 10, flexDirection: 'row' }}>
            <TouchableOpacity style={{ flex: 1 }}
              onPress={() => {

                if (Platform.OS === 'ios' || Platform.OS === 'android') {
                  Alert.alert(
                    "문제SET 삭제",
                    name+"를 삭제하시겠습니까?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => deleteItem() }
                    ],
                    { cancelable: false }
                  );
                } else {
                  if (confirm(name+"를 삭제하시겠습니까?")) {
                    deleteItem();
                  } else {
                    // 취소 버튼 클릭 시 동작
                  }
                }
                setModalVisible(!modalVisible);
              }}
            >
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>삭제</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { editProblemSet(); setModalVisible(!modalVisible); }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                <Entypo name="check" size={24} color={modifyEnable ? "black" : "gray"} />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18, color: modifyEnable ? 'black' : 'gray' }}>수정</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => { setModalVisible(!modalVisible); }}>
              <View style={{ flexDirection: 'row', alignContent: 'center' }}>
                {/* <Entypo name="check" size={24} color={createEnable ? "black" : "gray"} /> */}
                <AntDesign name="close" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18, color: 'black' }}>취소</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
      <View style={visible?styles.container:{display:'none'}}>
        <View style={styles.photo}>
          <AntDesign name="inbox" size={30} color="black" />
        </View>
        <View style={styles.container_text}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}> {name} </Text>
            <Text style={styles.name}>
              <Text>수정일: </Text> {modified_data}
            </Text>
            <Text style={styles.name}>
              <Text>태그: </Text> {tag}
            </Text>
          </View>
        </View>
        <View style={{ alignContent: 'center', justifyContent: 'center' }}>
          {/* <Checkbox
            onPress={() => {
              setIsSelected(!isSelected);
              if (isSelected == true) {
                const idx = PROBLEMSET_SELECTED.indexOf(name)
                if (idx > -1) PROBLEMSET_SELECTED.splice(idx, 1)
              } else {
                PROBLEMSET_SELECTED.push(name);
              }
              console.log(PROBLEMSET_SELECTED);
            }}
            style={{ borderWidth: 1, borderBottomColor: 'black', backgroundColor: 'black' }}
            status={isSelected ? 'checked' : 'unchecked'}
          /> */}
        </View>
        <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center' }}
          onPress={() => {
            // navigation.navigate('CategoryScreen', {

            // })
            setModalVisible(true);
          }}>
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}