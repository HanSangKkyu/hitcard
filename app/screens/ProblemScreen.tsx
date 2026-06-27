import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons, Octicons, AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, CategoryData, ProblemData } from '../types';
import ProblemScreenRow from '../rows/ProblemScreenRow';
import { WINDOW_WIDTH, WINDOW_HEIGHT, jsonEscape, apiClient } from "../Common";
import { Modal, Portal, Provider } from "react-native-paper";

type ProblemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProblemScreen'>;
type ProblemScreenRouteProp = RouteProp<RootStackParamList, 'ProblemScreen'>;

type Props = {
  navigation: ProblemScreenNavigationProp;
  route: ProblemScreenRouteProp;
};

export default function ProblemScreen({ navigation, route }: Props) {
  const { categorySN, categoryName, problemSet, category } = route.params;
  const [DATA, setDATA] = React.useState<ProblemData[]>([]);
  const [DATA_result, setDATA_result] = React.useState<ProblemData[]>([]);
  const [DATA_all, setDATA_all] = React.useState<ProblemData[]>([]);
  const [categoryDATA, setCategoryDATA] = React.useState<CategoryData[]>([]);
  const [isSearch, setIsSearch] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [editEnable, setEditEnable] = React.useState(false);
  const [name, setName] = React.useState(categoryName);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [deleteEnable, setDeleteEnable] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<string[]>([]);
  const [PAGE, setPAGE] = React.useState(1);

  const categoryList = categoryDATA.map((element, i) => {
    return (
      <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { edit_problem_category(element.SN); setModalVisible(!modalVisible); }}>
        <View style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Feather name="folder" size={24} color="black" />
          <Text style={{ marginLeft: 10, alignSelf: 'center', fontSize: 18 }}>{element.name}</Text>
        </View>
      </TouchableOpacity>)
  });

  let timeoutID: ReturnType<typeof setTimeout>;
  const ITEMS_PER_PAGE = 20;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCategoryDATA();
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (name) {
      setEditEnable(true);
    } else {
      setEditEnable(false);
    }
  }, [name]);

  React.useEffect(() => {
    if(!isSearch){
      setDATA_result(DATA_all);
    }
  }, [isSearch]);

  React.useEffect(() => {
    setPAGE(1);
    setDATA(DATA_result.slice(0, ITEMS_PER_PAGE));
  }, [DATA_result]);

  function loadMore(){
    const end = (PAGE+1)*ITEMS_PER_PAGE;
    const newData = DATA_result.slice(0, end);
    setPAGE(PAGE+1);
    setDATA(newData);
  }

  function getDATA() {
    let tmp_data: ProblemData[] = [];
    let categorylength = category.length;
    let cnt = 1;
    if(categorySN.toString() == "-1" || categorySN.toString().indexOf("@") != -1){
      for(let i=1;i<category.length;i++){
        apiClient.get('/category/' + category[i].SN + '/problem')
          .then((response) => {
            cnt++;
            var tt: ProblemData[] = JSON.parse(jsonEscape(response.data)).array;
            tt.forEach(element => {
              tmp_data.push(element);
            });
            if (cnt == categorylength) {
              for (let i = 0; i < tmp_data.length; i++) {
                tmp_data[i].visible = true;
              }

              if(categorySN.toString().indexOf("@") != -1){
                let hit_data: ProblemData[] = [];
                for (let j = 0; j < tmp_data.length; j++) {
                  if(tmp_data[j].hit.toString() == categorySN.substring(1).toString()){
                    hit_data.push(tmp_data[j]);
                  }
                }
                setDATA_result(hit_data);
                setDATA_all(hit_data);
              }else{
                setDATA_result(tmp_data)
                setDATA_all(tmp_data);
              }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
      return;
    }

    apiClient.get('/category/' + categorySN + '/problem')
      .then((response) => {
        let res: ProblemData[] = JSON.parse(jsonEscape(response.data)).array;
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
    apiClient.get('/problem-set/' + problemSet + '/category')
      .then((response) => {
        console.log(JSON.stringify(JSON.parse(jsonEscape(response.data)), undefined, 4));
        setCategoryDATA(JSON.parse(jsonEscape(response.data)).array);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function editCategoryName() {
    if (editEnable && isEdit) {
      apiClient.put('/category/' + categorySN, {
        'name': name,
        'problemSet': problemSet
      })
        .then((response) => {
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

  function toggleSelectedItem(_SN: string) {
    const idx = selectedItem.indexOf(_SN)
    if (idx > -1) {
      selectedItem.splice(idx, 1)
      setSelectedItem([...selectedItem]);
    } else {
      selectedItem.push(_SN);
      setSelectedItem([...selectedItem]);
    }

    if (selectedItem.length > 0) {
      setDeleteEnable(true);
    } else {
      setDeleteEnable(false);
    }
  }

  function delete_problem() {
    if (!deleteEnable) {
      return
    }

    selectedItem.forEach(element => {
      apiClient.delete('/problem/' + element)
        .then((response) => {
          getDATA();
          toggleSelectedItem(element);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  function edit_problem_category(_category: string) {
    for (let i = 0; i < selectedItem.length; i++) {
      apiClient.put('/problem/'+selectedItem[i]+'/category', {
        'category' : _category,
      })
      .then((response) => {
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

  function search(_text: string){
    clearTimeout(timeoutID);
    timeoutID = setTimeout(function(){
      let res: ProblemData[] = [];
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
          <Modal visible={modalVisible} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20, flexDirection: 'column' }}>
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
            <AntDesign name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text);}} autoFocus ></TextInput> :
            <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
              {isEdit ? <TextInput style={{ fontSize: 22, alignSelf: 'center' }} value={name} onChangeText={(text) => { setName(text) }} autoFocus></TextInput> : <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>}
              <TouchableOpacity style={{ marginLeft: 10, alignContent: 'center', justifyContent: 'center' }} onPress={() => { editCategoryName(); }}>
                {isEdit ? <Entypo name="check" size={24} color={editEnable ? "black" : "gray"} /> : <MaterialIcons name="edit" size={24} color="black" />}
              </TouchableOpacity>
            </View>
          }
          <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
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
                if (!deleteEnable) { return }
                Alert.alert(
                  "문제 삭제",
                  "선택한 문제를 삭제하시겠습니까?",
                  [
                    { text: "Cancel", onPress: () => { console.log("cancel Pressed") }, style: "cancel" },
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
                if (!deleteEnable) { return }
                if (confirm("선택한 문제를 삭제하시겠습니까?")) {
                  delete_problem();
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
