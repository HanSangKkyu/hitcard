import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, FontAwesome, SimpleLineIcons, MaterialIcons, Entypo, FontAwesome5, Foundation } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProblemScreenRow from '../rows/ProblemScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../Common';
import { Modal, Portal, Provider } from "react-native-paper";

export default function ProblemScreen({ navigation }) {
  const [DATA, setDATA] = React.useState('?'); // 서버로 부터 받은 데이터를 저장하는 변수
  const [isSearch, setIsSearch] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [name, setName] = React.useState("~의 문제");
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('CategoryScreen focused!');
    });
    return unsubscribe;
  }, [navigation, DATA]);

  function getDATA() {
    // fetch(APIVO+'/db', {
    //   method: 'GET'
    // })
    // .then((response) => response.text())
    // .then((responseJson) => {
    //   setDATA(JSON.parse(jsonEscape(responseJson)).array);
    //   setDATA_copy(JSON.stringify(JSON.parse(jsonEscape(responseJson)).array));
    //   setSpinner(false);
    // })
    // .catch((error) => {
    //     console.error(error);
    // });
    setDATA([
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: '모든 문제',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: '신라',
      },
      {
        id: '58694a0f-3da1-471f-bd9-145571e29d72',
        title: '고려',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28a',
        title: '삼국시대',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91a97f63',
        title: '일제강점기',
      },
      {
        id: '58694a0f-3da1-471f-bd96-14557129d72',
        title: '1hit',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-ad53abb28ba',
        title: '2hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: '3hit',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: '4hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91a97f63',
        title: '일제강점기',
      },
      {
        id: '58694a0f-3da1-471f-bd96-14557129d72',
        title: '1hit',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-ad53abb28ba',
        title: '2hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: '3hit',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: '4hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91a97f63',
        title: '일제강점기',
      },
      {
        id: '58694a0f-3da1-471f-bd96-14557129d72',
        title: '1hit',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-ad53abb28ba',
        title: '2hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: '3hit',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: '4hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91a97f63',
        title: '일제강점기',
      },
      {
        id: '58694a0f-3da1-471f-bd96-14557129d72',
        title: '1hit',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-ad53abb28ba',
        title: '2hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: '3hit',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: '4hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91a97f63',
        title: '일제강점기',
      },
      {
        id: '58694a0f-3da1-471f-bd96-14557129d72',
        title: '1hit',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-ad53abb28ba',
        title: '2hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: '3hit',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: '4hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91a97f63',
        title: '일제강점기',
      },
      {
        id: '58694a0f-3da1-471f-bd96-14557129d72',
        title: '1hit',
      },
      {
        id: 'bd7acbea-c1b1-46c2-aed5-ad53abb28ba',
        title: '2hit',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f3',
        title: '3hit',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: '4hit',
      },
    ]);
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
              <TouchableOpacity style={{ marginLeft: 10, alignContent: 'center', justifyContent: 'center' }} onPress={() => { setIsEdit(!isEdit) }}>
                {isEdit ? <Entypo name="check" size={24} color="black" /> : <MaterialIcons name="edit" size={24} color="black" />}
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
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="file-move-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('AddProblemScreen') }} style={{ flex: 1, alignSelf: 'flex-start' }}>
            {/* <Text style={{ alignSelf: 'center', fontSize: Platform.OS === 'ios' || Platform.OS === 'android' ? 20 : 25 }}>문제 추가</Text> */}
            <Ionicons style={{ alignSelf: 'center' }} name="add" size={24} color="black" />
          </TouchableOpacity>
          {Platform.OS === 'ios' || Platform.OS === 'android' ?
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                Alert.alert(
                  "카테고리 삭제",
                  "선택한 문제를 삭제하시겠습니까?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                  ],
                  { cancelable: false }
                );
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color="black" />
            </TouchableOpacity>
            :
            <TouchableOpacity style={{ flex: 1, alignSelf: 'center', }}
              onPress={() => {
                if (confirm("선택한 문제를 삭제하시겠습니까?")) {
                  // 확인 버튼 클릭 시 동작
                } else {
                  // 취소 버튼 클릭 시 동작
                }
              }}>
              <Entypo style={{ alignSelf: 'center' }} name="trash" size={24} color="black" />
            </TouchableOpacity>
          }
        </View>
        <KeyboardAwareScrollView>
          <ScrollView style={{height:WINDOW_HEIGHT-100}}>
            <FlatList
              data={DATA}
              renderItem={({ item }) => <ProblemScreenRow
                navigation={navigation}
                title={item.title}
              />}
              keyExtractor={item => item.id}
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