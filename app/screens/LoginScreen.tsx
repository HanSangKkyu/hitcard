import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { jsonEscape, USER_ID, USER_SN, apiClient, loadSession, saveSession } from '../Common'

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [err, setErr] = React.useState(false);

  React.useEffect(() => {
    loadSession().then((session) => {
      if (session) {
        setId(session.USER_ID);
        setPw(session.USER_PW);
        loginWithCredentials(session.USER_ID, session.USER_PW);
      }
    });
  }, [navigation]);

  function loginWithCredentials(_id: string, _pw: string){
    apiClient.post('/login', { 'id': _id,'pw': _pw })
      .then((response) => {
        const resjson = JSON.parse(jsonEscape(response.data));
        if(resjson.status == '500'){
          setErr(true);
        }else{
          setErr(false);
          USER_ID.length = 0;
          USER_SN.length = 0;
          USER_ID.push(resjson.id);
          USER_SN.push(resjson.SN);
          saveSession(resjson.SN, resjson.id, _pw);
          navigation.replace('MyProblemSetScreen');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function login(){
    loginWithCredentials(id, pw);
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={{ fontSize: 30, marginBottom: 50 }}>H!T CARD</Text>
        <StatusBar barStyle="dark-content" translucent={true} />
        <TextInput style={{ width: 300, borderBottomColor: err?'red':'black', borderBottomWidth: 1, fontSize: 40, textAlign: "center" }} placeholder="아이디" value={id} onChangeText={(text)=>{setId(text)}}></TextInput>
        <TextInput style={{ width: 300, borderBottomColor: err?'red':'black', borderBottomWidth: 1, fontSize: 40, textAlign: "center" }} placeholder="비밀번호" value={pw} onChangeText={(text)=>{setPw(text)}} secureTextEntry={true} ></TextInput>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => login()} style={{ width: 150, marginTop: 10, alignItems: "center" }}>
            <Text>login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 150, marginTop: 10, alignItems: "center" }} onPress={() => { navigation.navigate('JoinScreen') }}>
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
