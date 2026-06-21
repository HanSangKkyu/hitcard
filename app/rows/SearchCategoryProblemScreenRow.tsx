import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SearchCategoryProblemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchCategoryProblemScreen'>;

type Props = {
  navigation: SearchCategoryProblemScreenNavigationProp;
  SN: string;
  question: string;
  answer: string;
  category: string;
  hit: string;
  toggleSelectedItem?: (SN: string) => void;
  problemSet: string;
  visible?: boolean;
};

export default function SearchCategoryProblemScreenRow({ navigation, SN, question, answer, category, hit, toggleSelectedItem, problemSet, visible }: Props) {
  const [isSelected, setIsSelected] = React.useState(false);

  return (
    <TouchableOpacity onPress={() => { setIsSelected(!isSelected); }}>
      <View style={visible ? styles.container : { display:'none' as const }}>
        <View style={styles.photo}>
          <FontAwesome name="sticky-note-o" size={24} color="black" />
        </View>
        <View style={styles.container_text}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}>Q. {question}</Text>
            <Text style={styles.title}>A. {answer}</Text>
            <Text style={styles.title}><Text>hit: </Text> {hit}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 2,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e1e1",
        backgroundColor: "#f1f1f1",
        elevation: 2,
    },
    title: {
        fontSize: 14,
        color: '#3f3f3f',
        fontWeight: 'bold'
    },
    container_text: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 12,
        justifyContent: 'center',
    },
    description: {
        fontSize: 11,
        color: '#3f3f3f',
        marginTop: 20,
        marginBottom: 20,
    },
    photo: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    displayname: {
        fontSize: 11,
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        color: 'blue'
    },
});
