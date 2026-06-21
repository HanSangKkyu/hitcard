import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { jsonEscape, apiClient } from '../Common'

type JoinScreenNavigationProp = StackNavigationProp<RootStackParamList, 'JoinScreen'>;

type Props = {
  navigation: JoinScreenNavigationProp;
};

export default function JoinScreen({ navigation }: Props) {
  const [id, setId] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [pwc, setPwc] = React.useState("");
  const [iderr, setIderr] = React.useState(false);
  const [pwerr, setPwerr] = React.useState(false);
  const [createEnable, setCreateEnable] = React.useState(false);

  React.useEffect(() => {
    chkID();
  }, [id]);

  React.useEffect(() => {
    checkCreateEnable();
  }, [id, pw, pwc, iderr, pwerr]);

  React.useEffect(() => {
    chkPW();
  }, [pw, pwc]);

  function chkID() {
    if (id.length === 0) {
      setIderr(true);
      return;
    }
    apiClient.post('/userbyid', { 'id': id })
      .then((response) => {
        var resjson = JSON.parse(jsonEscape(response.data));
        if(resjson.status == '500'){
          setIderr(false);
        }else{
          setIderr(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setIderr(true);
      });
  }

  function chkPW() {
    if (pw != pwc) {
      setPwerr(true);
    } else {
      setPwerr(false);
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
    if(createEnable){
      apiClient.post('/user', { 'id': id, 'pw': pw, 'introduction' : ' ' })
        .then((response) => {
          if (response.data === 'true') {
            alert("가입 성공! 로그인 해주세요.");
            navigation.goBack();
          } else {
            alert("가입 실패. 다시 시도해주세요.");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("가입 중 오류가 발생했습니다.");
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
          <TouchableOpacity onPress={() => {navigation.goBack();}} style={{ width: 150, marginTop: 10, alignItems: "center" }}>
            <Text style={{color:'black'}}>뒤로</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {createUser();}} style={{ width: 150, marginTop: 10, alignItems: "center" }}>
            <Text style={{color:createEnable?'black':'gray'}}>가입</Text>
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
