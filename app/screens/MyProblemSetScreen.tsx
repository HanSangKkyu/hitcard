import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Platform } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ProblemSetData } from '../types';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, jsonEscape, apiClient } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

type MyProblemSetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyProblemSetScreen'>;

type Props = {
  navigation: MyProblemSetScreenNavigationProp;
};

export default function MyProblemSetScreen({ navigation }: Props) {
  const [DATA, setDATA] = React.useState<ProblemSetData[]>([]);
  const [DATA_copy, setDATA_copy] = React.useState<ProblemSetData[]>([]);
  const [isSearch, setIsSearch] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [createEnable, setCreateEnable] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (name.length > 0) {
      setCreateEnable(true);
    } else {
      setCreateEnable(false);
    }
  }, [name]);

  React.useEffect(() => {
    if(!isSearch){
      let res: ProblemSetData[] = [];
      for (let i = 0; i < DATA.length; i++) {
        DATA[i].visible = true;
        res.push(DATA[i]);
      }
      setDATA(res);
    }
  }, [isSearch]);

  function getDATA() {
    apiClient.get('/problem-set/owner/'+USER_SN[0])
    .then((response) => {
      let res: ProblemSetData[] = JSON.parse(jsonEscape(response.data)).array;
      for (let i = 0; i < res.length; i++) {
        res[i].visible = true;
      }
      setDATA(res);
      setDATA_copy(res);
    })
    .catch((error) => {
        console.error(error);
    });
  }

  function createProblemSet() {
    apiClient.post('/problem-set', {
      'name': name,
      'owner': USER_SN[0],
      'tag': tag
    })
      .then((response) => {
        getDATA();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function search(_text: string){
    let res: ProblemSetData[] = [];
    for (let i = 0; i < DATA.length; i++) {
      const element = DATA[i];
      if(element.name.indexOf(_text) != -1 ||
      element.tag.indexOf(_text) != -1||
      element.hit.indexOf(_text) != -1||
      element.created_data.indexOf(_text) != -1||
      element.modified_data.indexOf(_text) != -1){
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
            <AntDesign name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text) => {search(text);}} autoFocus ></TextInput> : <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>내 문제 SET</Text>}
          <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
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
          <FlatList  style={{ height: WINDOW_HEIGHT - 140 }}
            data={DATA}
            renderItem={({ item }) => <MyProblemSetScreenRow
              navigation={navigation}
              SN={item.SN}
              name={item.name}
              tag={item.tag}
              hit={item.hit}
              created_data={item.created_data}
              modified_data={item.modified_data}
              getDATA={getDATA}
              visible={item.visible} />}
            keyExtractor={item => item.SN} />
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
