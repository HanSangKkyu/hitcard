import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, CategoryData, ProblemData } from '../types';
import CategoryScreenRow from '../rows/CategoryScreenRow';
import { ScrollView } from 'react-native-gesture-handler';
import { WINDOW_WIDTH, WINDOW_HEIGHT, USER_SN, jsonEscape, apiClient } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CategoryScreen'>;
type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'CategoryScreen'>;

type Props = {
  navigation: CategoryScreenNavigationProp;
  route: CategoryScreenRouteProp;
};

export default function CategoryScreen({ route, navigation }: Props) {
  const {problemSetSN, problemSetName} = route.params;
  const [DATA, setDATA] = React.useState<CategoryData[]>([]);
  const [problemDATA, setProblemDATA] = React.useState<ProblemData[]>([]);
  const [DATA_copy, setDATA_copy] = React.useState<CategoryData[]>([]);
  const [categoryCounts, setCategoryCounts] = React.useState<{[key: string]: number}>({});
  const [isSearch, setIsSearch] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [name, setName] = React.useState(problemSetName+"의 카테고리");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [createEnable, setCreateEnable] = React.useState(false);
  const [createName, setCreateName] = React.useState("");
  const [deleteEnable, setDeleteEnable] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<string[]>([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if(createName){
      setCreateEnable(true);
    }else{
      setCreateEnable(false);
    }
  }, [createName]);

  React.useEffect(() => {
    if(!isSearch){
      let res: CategoryData[] = [];
      for (let i = 0; i < DATA.length; i++) {
        DATA[i].visible = true;
        res.push(DATA[i]);
      }
      setDATA(res);
    }
  }, [isSearch]);

  function toggleSelectedItem(_SN: string){
    const idx = selectedItem.indexOf(_SN)
    if (idx > -1) {
      selectedItem.splice(idx, 1)
      setSelectedItem([...selectedItem]);
    }else{
      selectedItem.push(_SN);
      setSelectedItem([...selectedItem]);
    }

    if(selectedItem.length > 0){
      setDeleteEnable(true);
    }else{
      setDeleteEnable(false);
    }
  }

  function getDATA() {
    apiClient.get('/problem-set/'+problemSetSN+'/category')
    .then((response) => {
      var res: CategoryData[] = JSON.parse(jsonEscape(response.data)).array;
      if(res.length > 0){
        res.unshift({"SN": '-1', "name":"모든 문제", "problemSet":problemSetSN});
      }
      setDATA(res);
      setName(problemSetName+"의 카테고리");
      getProblem(res);
    })
    .catch((error) => {
        console.error(error);
    });
  }

  function getProblem(_DATA: CategoryData[]) {
    let tmp_data: ProblemData[] = [];
    const datalength = _DATA.length;
    let cnt = 0;
    let counts: {[key: string]: number} = {};

    for (let i = 1; i < _DATA.length; i++) {
      const catSN = _DATA[i].SN;
      apiClient.get('/category/' + catSN + '/problem')
      .then((response) => {
        cnt++;
        var tt: ProblemData[] = JSON.parse(jsonEscape(response.data)).array;
        counts[catSN] = tt.length;
        tt.forEach(element => {
          tmp_data.push(element);
        });

        if (cnt == datalength - 1) {
          counts['-1'] = tmp_data.length;
          setCategoryCounts(counts);
          setProblemDATA(tmp_data);
          let tmp_hitset: number[] = [];
          for (let j = 0; j < tmp_data.length; j++) {
            tmp_hitset.push(parseInt(tmp_data[j].hit));
          }
          tmp_hitset.sort();
          const hitset = new Set(tmp_hitset);

          var res = _DATA;
          Array.from(hitset).forEach(item => {
            res.push({"SN":('@'+item), "name":"hit "+item, "problemSet":problemSetSN})
          });

          for (let j = 0; j < res.length; j++) {
            res[j].visible = true;
          }

          setDATA(res);
          setDATA_copy([...res]);
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

    apiClient.post('/category', {
      'name' : createName,
      'problemSet' : problemSetSN
    })
    .then((response) => {
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
      apiClient.delete('/category/'+element)
      .then((response) => {
        getDATA();
        toggleSelectedItem(element);
      })
      .catch((error) => {
          console.error(error);
      });
    });
  }

  function goSolve(){
    if(deleteEnable){
      navigation.navigate('SolveScreen',{
        "selectedItem":selectedItem,
        "category":DATA,
        "problemSetSN":problemSetSN
      });
    }
  }

  function search(_text: string){
    let res: CategoryData[] = [];
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
            <AntDesign name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 30, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text);}} autoFocus ></TextInput> :
            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
              <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>
            </View>
          }
          <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
            {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, alignContent: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => { goSolve() }} style={{ flex: 1, alignSelf: 'center', }}>
            <MaterialCommunityIcons style={{ alignSelf: 'center' }} name="play-outline" size={24} color={deleteEnable?"black":"gray"} />
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => { setModalVisible(!modalVisible) }}  style={{ flex: 1, alignSelf: 'center', }}>
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
          <FlatList style={{ height: WINDOW_HEIGHT - 140 }}
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
              count={categoryCounts[item.SN]} />}
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
