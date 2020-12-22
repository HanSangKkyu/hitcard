import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { APIVO, jsonEscape } from '../Common'

export default function JoinScreen({ navigation }) {
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [pwc, setPwc] = React.useState("");
  const [iderr, setIderr] = React.useState(false);
  const [pwerr, setPwerr] = React.useState(false);
  const [createEnable, setCreateEnable] = React.useState(false);

  React.useEffect(() => {
    chkID();
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log('DB screen focused!');
    });
    return unsubscribe;
  }, [navigation, id]);

  React.useEffect(() => {
    checkCreateEnable();
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log('DB1 screen focused!');
    });
    return unsubscribe;
  }, [navigation, id, pw, pwc, iderr, pwerr]);

  React.useEffect(() => {
    chkPW();
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log('DB2 screen focused!');
    });
    return unsubscribe;
  }, [navigation, pw, pwc]);

  function chkID() {
    console.log(APIVO + '/userbyid');
    fetch(APIVO + '/userbyid', {
    // fetch('https://reactnative.dev/movies.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'id': id })
    })
      .then((response) => response.text())
      .then((responseJson) => {
        // console.log(responseJson);
        var resjson = JSON.parse(jsonEscape(responseJson));

        console.log(resjson.status);
        if(resjson.status == '500'){
          setIderr(false);
          console.log('iderr '+iderr);
        }else{
          setIderr(true);
          console.log('iderr '+iderr);
        }



      })
      .catch((error) => {
        console.error(error);
      });
  }

  function chkPW() {
    console.log('pw' + pw);
    console.log('pwc' + pwc);
    if (pw != pwc) {
      setPwerr(true);
      console.log(pwerr);
    } else {
      setPwerr(false);
      console.log(pwerr);
    }
  }

  function checkCreateEnable(){
    if(pwerr == false && iderr == false && id.length > 0 && pw.length > 0 && pwc.length > 0){
      setCreateEnable(true);
    }else{
      setCreateEnable(false);
    }
  }

  function createUser(){
    console.log('createUser called');
    console.log(pwerr, iderr,id,pw,pwc);
    console.log(createEnable);
    if(createEnable){
      fetch(APIVO + '/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'id': id, 'pw': pw, 'introduction' : ' ' })
      })
        .then((response) => response.text())
        .then((responseJson) => {
          console.log(responseJson);
          navigation.navigate('MyProblemSetScreen');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 30, marginBottom: 50 }}>JO!N</Text>
        <StatusBar barStyle="dark-content" translucent={true} />
        <TextInput style={{ width: 300, borderBottomColor: iderr ? 'red' : 'black', borderBottomWidth: 1, fontSize: 40, textAlign: "center", }} placeholder="아이디" value={id} onChangeText={(text) => setId(text)}></TextInput>
        <TextInput style={{ width: 300, borderBottomColor: pwerr ? 'red' : 'black', borderBottomWidth: 1, fontSize: 40, textAlign: "center", }} placeholder="비밀번호" secureTextEntry={true} value={pw} onChangeText={(text) => { setPw(text); }}></TextInput>
        <TextInput style={{ width: 300, borderBottomColor: pwerr ? 'red' : 'black', borderBottomWidth: 1, fontSize: 40, textAlign: "center", }} placeholder="비밀번호 확인" secureTextEntry={true} value={pwc} onChangeText={(text) => { setPwc(text); }}></TextInput>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => {createUser();}} style={{ width: 150, marginTop: 10, textAlign: "center", alignItems: "center" }}>
            <Text style={{color:createEnable?'black':'gray'}}>확인</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{ width: 150, marginTop: 10, textAlign:"center", alignItems:"center" }}>
              <Text>join</Text>
          </TouchableOpacity> */}
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