import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Keyboard, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// 
export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', }}>
    {/* <KeyboardAwareScrollView> */}
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
    <View style={styles.container}>
      <Text style={{fontSize:30, marginBottom:50}}>H!T CARD</Text>
      <StatusBar  barStyle="dark-content" translucent={true} />
      <TextInput style={{ width:300, borderBottomColor:'black', borderBottomWidth:1, fontSize:40, textAlign:"center"}} placeholder="아이디"></TextInput>
      <TextInput style={{ width:300, borderBottomColor:'black', borderBottomWidth:1, fontSize:40, textAlign:"center"}} placeholder="비밀번호" secureTextEntry={true} ></TextInput>
      <View style={{flexDirection:'row'}}>
        {/* <Button color="black" title={'login'} style={{width:150,}} onPress={Keyboard.dismiss} />
        <Button color="black" title={'join'} style={{width:150,}} onPress={Keyboard.dismiss} /> */}
        <TouchableOpacity style={{ width: 150, marginTop: 10, textAlign:"center", alignItems:"center" }}>
            <Text>login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 150, marginTop: 10, textAlign:"center", alignItems:"center" }}>
            <Text>join</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableWithoutFeedback>
    {/* </KeyboardAwareScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
