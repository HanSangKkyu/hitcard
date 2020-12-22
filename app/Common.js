import { Button, View, SafeAreaView, Dimensions, Image, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Animated, FlatList } from 'react-native';

export let APIVO = "http://192.168.0.18:8080";
export let PATH = "D:/was/apache-tomcat-9.0.21_M2BINFRA/webapps/m2binfra_api/";
export let RPATH = "resources/upload/";

export function jsonEscape(str) {
    return str.trim().replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

export let WINDOW_WIDTH = Dimensions.get('window').width; //full width
export let WINDOW_HEIGHT = Dimensions.get('window').height; //full height


export let PROBLEMSET_SELECTED = [];
export let CATEGORY_SELECTED = [];
export let PROBLEM_SELECTED = [];


// export { APIVO, PATH, RPATH, jsonEscape, WINDOW_HEIGHT, WINDOW_WIDTH };