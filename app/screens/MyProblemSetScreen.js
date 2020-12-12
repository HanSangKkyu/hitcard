import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyProblemSetScreenRow from '../rows/MyProblemSetScreenRow';

export default function MyProblemSetScreen({ navigation }) {
  const [DATA, setDATA] = React.useState('?'); // 서버로 부터 받은 데이터를 저장하는 변수

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getDATA();
      console.log('MyProblemSetScreen focused!');
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
        title: 'First Item',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
      },
    ]);
  }

  return (
    <KeyboardAwareScrollView>
      <SafeAreaView>
        <View style={{ margin: 20, borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 30 }}>내 문제 SET</Text>
        </View>
        <View style={{margin: 20}}>
          <FlatList data={DATA}
            renderItem={({ item }) => (
              <Text>{item.title}</Text> 
            )}
            keyExtractor={item => item.id}
          />
        </View>
        <View>

        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
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