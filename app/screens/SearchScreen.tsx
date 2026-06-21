import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Feather, Octicons, AntDesign } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ProblemSetData } from '../types';
import SearchScreenRow from '../rows/SearchScreenRow';
import { WINDOW_HEIGHT, jsonEscape, apiClient } from "../Common";

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchScreen'>;

type Props = {
  navigation: SearchScreenNavigationProp;
};

export default function SearchScreen({ navigation }: Props) {
  const [DATA, setDATA] = React.useState<ProblemSetData[]>([]);
  const [DATA_copy, setDATA_copy] = React.useState<ProblemSetData[]>([]);
  const [isSearch, setIsSearch] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getDATA();
    });
    return unsubscribe;
  }, [navigation]);

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

  function search(_text: string){
    let res: ProblemSetData[] = [];
    for (let i = 0; i < DATA.length; i++) {
      const element = DATA[i];
      if(element.name.indexOf(_text) != -1 ||
      element.tag.indexOf(_text) != -1||
      element.owner.indexOf(_text) != -1||
      element.hit.indexOf(_text) != -1){
        DATA[i].visible = true;
      }else{
        DATA[i].visible = false;
      }
      res.push(DATA[i]);
    }
    setDATA(res);
  }

  function getDATA() {
    apiClient.get('/problem-set')
    .then((response) => {
      const responseJson = response.data;
      let res: ProblemSetData[] = JSON.parse(jsonEscape(responseJson)).array;
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

  return (
    <SafeAreaView style={{ }}>
      <View style={{ margin: 20, marginBottom:0, borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 10, }}>
        <TouchableOpacity style={{ marginRight: 20, alignSelf: 'center' }} onPress={() => navigation.goBack()} >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
          {isSearch ? <TextInput style={{ flex: 1, alignSelf: 'center', borderWidth: isSearch ? 1 : 0, borderRadius: 100, height: 26, paddingLeft: 10, paddingRight: 10 }} onChangeText={(text)=>{search(text);}} autoFocus ></TextInput> : <Text style={{ flex: 1, fontSize: 22, alignSelf: 'center' }}>문제 탐색</Text>}
        <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 20 }} onPress={() => setIsSearch(!isSearch)}>
          {isSearch ? <Feather name="x" size={24} color="black" /> : <Octicons name="search" size={24} color="black" />}
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView>
        <FlatList style={{ height: WINDOW_HEIGHT - 140 }}
          data={DATA}
          renderItem={({ item }) => <SearchScreenRow
            navigation={navigation}
            SN={item.SN}
            name={item.name}
            owner={item.owner}
            tag={item.tag}
            hit={item.hit}
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
