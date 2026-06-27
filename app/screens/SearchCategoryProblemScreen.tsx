import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Feather, Octicons, AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ProblemData } from '../types';
import SearchCategoryProblemScreenRow from '../rows/SearchCategoryProblemScreenRow';
import { WINDOW_HEIGHT, jsonEscape, apiClient } from "../Common";

type SearchCategoryProblemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchCategoryProblemScreen'>;
type SearchCategoryProblemScreenRouteProp = RouteProp<RootStackParamList, 'SearchCategoryProblemScreen'>;

type Props = {
  navigation: SearchCategoryProblemScreenNavigationProp;
  route: SearchCategoryProblemScreenRouteProp;
};

export default function SearchCategoryProblemScreen({ navigation, route }: Props) {
  const { categorySN, categoryName, problemSet, category } = route.params;
  const [DATA, setDATA] = React.useState<ProblemData[]>([]);
  const [DATA_result, setDATA_result] = React.useState<ProblemData[]>([]);
  const [DATA_all, setDATA_all] = React.useState<ProblemData[]>([]);
  const [isSearch, setIsSearch] = React.useState(false);
  const [name, setName] = React.useState(categoryName);
  const [PAGE, setPAGE] = React.useState(1);

  let timeoutID: ReturnType<typeof setTimeout>;
  const ITEMS_PER_PAGE = 20;

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if(!isSearch){
      let res: ProblemData[] = [];
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
  }, [DATA_result]);

  function loadMore(){
    const end = (PAGE+1)*ITEMS_PER_PAGE;
    const newData = DATA_result.slice(0, end);
    setPAGE(PAGE+1);
    setDATA(newData);
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

  function getDATA() {
    let tmp_data: ProblemData[] = [];
    let categorylength = category.length;
    let cnt = 1;
    if(categorySN.toString() == "-1" || categorySN.toString().indexOf("@") != -1){

      for(let i=1;i<category.length;i++){
        apiClient.get('/category/' + category[i].SN + '/problem')
          .then((response) => {
            const responseJson = response.data;
            cnt++;
            var tt: ProblemData[] = JSON.parse(jsonEscape(responseJson)).array;
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
        const responseJson = response.data;
        let res: ProblemData[] = JSON.parse(jsonEscape(responseJson)).array;
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

  return (
    <SafeAreaView style={{}}>
      <View style={{ margin: 20, marginBottom: 0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text)}} autoFocus ></TextInput> :
          <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center' }}>
            <Text style={{ fontSize: 22, alignSelf: 'center' }}>{name}</Text>
          </View>
        }
        <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
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
