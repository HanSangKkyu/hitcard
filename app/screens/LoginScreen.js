import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { APIVO, jsonEscape, USER_ID, USER_SN } from '../Common'

export default function LoginScreen({ navigation }) {
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [err, setErr] = React.useState(false);


  function login(){
    fetch(APIVO + '/login', {
      // fetch('https://reactnative.dev/movies.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'id': id,'pw':pw })
      })
        .then((response) => response.text())
        .then((responseJson) => {
          console.log(JSON.stringify(JSON.parse(jsonEscape(responseJson)), undefined, 4));
          var resjson = JSON.parse(jsonEscape(responseJson));
  
          console.log(resjson);
          if(resjson.status == '500'){
            setErr(true);
          }else{
            setErr(false);
            USER_ID.length = 0;
            USER_SN.length = 0;
            USER_ID.push(resjson.id);
            USER_SN.push(resjson.SN);
            console.log(USER_SN);
            navigation.navigate('MyProblemSetScreen');
          }
        })
        .catch((error) => {
          console.error(error);
        });
  }
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 30, marginBottom: 50 }}>H!T CARD</Text>
        <StatusBar barStyle="dark-content" translucent={true} />
        <TextInput style={{ width: 300, borderBottomColor: err?'red':'black', borderBottomWidth: 1, fontSize: 40, textAlign: "center" }} placeholder="아이디" value={id} onChangeText={(text)=>{setId(text)}}></TextInput>
        <TextInput style={{ width: 300, borderBottomColor: err?'red':'black', borderBottomWidth: 1, fontSize: 40, textAlign: "center" }} placeholder="비밀번호" value={pw} onChangeText={(text)=>{setPw(text)}} secureTextEntry={true} ></TextInput>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => login()} style={{ width: 150, marginTop: 10, textAlign: "center", alignItems: "center" }}>
            <Text>login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 150, marginTop: 10, textAlign: "center", alignItems: "center" }} onPress={() => { navigation.navigate('JoinScreen') }}>
            <Text>join</Text>
          </TouchableOpacity>
        </View>
      </View>
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