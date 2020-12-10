import * as React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function LoginScreen() {
    return (
      <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={{fontSize:30, marginBottom:50}}>H!T CARD</Text>
        <StatusBar  barStyle="dark-content" translucent={true} />
        <TextInput style={{ width:300, borderBottomColor:'black', borderBottomWidth:1, fontSize:40, textAlign:"center"}} placeholder="아이디"></TextInput>
        <TextInput style={{ width:300, borderBottomColor:'black', borderBottomWidth:1, fontSize:40, textAlign:"center"}} placeholder="비밀번호" secureTextEntry={true} ></TextInput>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={{ width: 150, marginTop: 10, textAlign:"center", alignItems:"center" }}>
              <Text>login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 150, marginTop: 10, textAlign:"center", alignItems:"center" }}>
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
      marginTop:200,
      marginBottom:100
    },
  });