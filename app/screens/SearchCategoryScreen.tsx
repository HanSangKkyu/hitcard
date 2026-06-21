import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Feather, Octicons, AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, CategoryData, ProblemData } from '../types';
import SearchCategoryScreenRow from '../rows/SearchCategoryScreenRow';
import { WINDOW_HEIGHT, jsonEscape, apiClient } from "../Common";

type SearchCategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchCategoryScreen'>;
type SearchCategoryScreenRouteProp = RouteProp<RootStackParamList, 'SearchCategoryScreen'>;

type Props = {
  navigation: SearchCategoryScreenNavigationProp;
  route: SearchCategoryScreenRouteProp;
};

export default function SearchCategoryScreen({ navigation, route }: Props) {
  const { problemSetSN, problemSetName } = route.params;
  const [DATA, setDATA] = React.useState<CategoryData[]>([]);
  const [problemDATA, setProblemDATA] = React.useState<ProblemData[]>([]);
  const [DATA_copy, setDATA_copy] = React.useState<CategoryData[]>([]);
  const [isSearch, setIsSearch] = React.useState(false);
  const [name, setName] = React.useState("~의 카테고리");

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

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

  function getDATA() {
    apiClient.get('/problem-set/'+problemSetSN+'/category')
    .then((response) => {
      const responseJson = response.data;
      var res: CategoryData[] = JSON.parse(jsonEscape(responseJson)).array;
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

    for (let i = 1; i < _DATA.length; i++) {
      apiClient.get('/category/' + _DATA[i].SN + '/problem')
      .then((response) => {
        const responseJson = response.data;
        cnt++;
        var tt: ProblemData[] = JSON.parse(jsonEscape(responseJson)).array;
        tt.forEach(element => {
          tmp_data.push(element);
        });

        if (cnt == datalength - 1) {
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

  return (
    <SafeAreaView style={{}}>
      <View style={{ margin: 20, marginBottom: 0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text);}} autoFocus ></TextInput> :
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
          renderItem={({ item }) => <SearchCategoryScreenRow
            navigation={navigation}
            SN={item.SN}
            name={item.name}
            problemSet={item.problemSet}
            category={DATA}
            visible={item.visible}
          />}
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
