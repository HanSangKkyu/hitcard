import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, Foundation } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CategoryData } from '../types';

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CategoryScreen'>;

type Props = {
  navigation: CategoryScreenNavigationProp;
  SN: string;
  name: string;
  problemSet: string;
  toggleSelectedItem: (SN: string) => void;
  category: CategoryData[];
  visible?: boolean;
  selectedItem: string[];
  count?: number;
};

export default function CategoryScreenRow({ navigation, SN, name, problemSet, toggleSelectedItem, category, visible, selectedItem, count }: Props) {
  const [isSelected, setIsSelected] = React.useState(false);

  React.useEffect(() => {
    if(selectedItem.indexOf(SN) != -1){
      setIsSelected(true);
    }else{
      setIsSelected(false);
    }
  }, [selectedItem]);

  function selectThisItem() {
    setIsSelected(!isSelected);
    toggleSelectedItem(SN);
  }

  return (
    <TouchableOpacity onPress={() => { selectThisItem(); }}>
      <View style={visible||visible==undefined ? styles.container : { display:'none' as const }}>
        <View style={styles.photo}>
          <Feather name="folder" size={30} color="black" />
        </View>
        <View style={styles.container_text}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.title}>{name}</Text>
            {count !== undefined && <Text style={styles.countText}>{count}개</Text>}
          </View>
        </View>
        <View style={{ alignContent: 'center', justifyContent: 'center' }}>
          <Checkbox
            onPress={() => { selectThisItem(); }}
            status={isSelected ? 'checked' : 'unchecked'}
          />
        </View>
        <TouchableOpacity style={{ alignContent: 'center', justifyContent: 'center' }}
          onPress={() => {
            navigation.navigate('ProblemScreen', {
              "categorySN": SN,
              "categoryName": name,
              "problemSet": problemSet,
              "category": category
            })
          }}>
          <Foundation name="indent-more" size={24} color="black" />
        </TouchableOpacity>
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
    countText: {
        fontSize: 11,
        color: '#888',
        marginTop: 2,
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
