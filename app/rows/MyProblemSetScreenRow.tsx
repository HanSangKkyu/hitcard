import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { Modal, Portal, Provider } from 'react-native-paper';
import { USER_SN, apiClient, jsonEscape } from "../Common";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type MyProblemSetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyProblemSetScreen'>;

type Props = {
  navigation: MyProblemSetScreenNavigationProp;
  SN: string;
  name: string;
  tag: string;
  hit: string;
  created_data: string;
  modified_data: string;
  getDATA: () => void;
  visible?: boolean;
};

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

export default function MyProblemSetScreenRow({ navigation, SN, name, tag, hit, created_data, modified_data, getDATA, visible }: Props) {
  const [isSelected, setIsSelected] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modifyEnable, setModifyEnable] = React.useState(false);
  const [nameInModal, setNameInModal] = React.useState(name);
  const [tagInModal, setTagInModal] = React.useState(tag);

  React.useEffect(() => {
    if (nameInModal) {
      setModifyEnable(true);
    } else {
      setModifyEnable(false);
    }
  }, [nameInModal]);

  function editProblemSet() {
    apiClient.put('/problem-set/' + SN, {
      'name': nameInModal,
      'owner': USER_SN[0],
      'tag': tagInModal,
      'hit': hit
    })
      .then((response) => {
        getDATA();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function deleteItem(){
    apiClient.delete('/problem-set/' + SN)
      .then((response) => {
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
                      { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                      { text: "OK", onPress: () => deleteItem() }
                    ],
                    { cancelable: false }
                  );
                } else {
                  if (confirm(name+"를 삭제하시겠습니까?")) {
                    deleteItem();
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
                <AntDesign name="close" size={24} color="black" />
                <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18, color: 'black' }}>취소</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
      <View style={visible?styles.container:{display:'none' as const}}>
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
        <View style={{ alignContent: 'center', justifyContent: 'center' }} />
        <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center' }}
          onPress={() => { setModalVisible(true); }}>
          <Feather name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
