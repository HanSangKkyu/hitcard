import { Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const extra = Constants.manifest?.extra || (Constants as any).expoConfig?.extra || {};
export let APIVO = process.env.EXPO_PUBLIC_API_URL || extra.apiUrl || "https://localhost:8443";

export function jsonEscape(str: string): string {
    return str.trim().replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

export const apiClient = axios.create({
  baseURL: APIVO,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [(data) => data],
  validateStatus: () => true,
});

export let WINDOW_WIDTH = Dimensions.get('window').width;
export let WINDOW_HEIGHT = Dimensions.get('window').height;

export let USER_SN: string[] = [];
export let USER_ID: string[] = [];

export let PROBLEMSET_SELECTED: string[] = [];
export let PROBLEM_SELECTED: string[] = [];

const USER_SN_KEY = 'USER_SN';
const USER_ID_KEY = 'USER_ID';
const USER_PW_KEY = 'USER_PW';

export async function saveSession(userSN: string, userID: string, userPW: string): Promise<void> {
  await AsyncStorage.setItem(USER_SN_KEY, userSN);
  await AsyncStorage.setItem(USER_ID_KEY, userID);
  await AsyncStorage.setItem(USER_PW_KEY, userPW);
}

export async function loadSession(): Promise<{ USER_SN: string; USER_ID: string; USER_PW: string } | null> {
  const userSN = await AsyncStorage.getItem(USER_SN_KEY);
  const userID = await AsyncStorage.getItem(USER_ID_KEY);
  const userPW = await AsyncStorage.getItem(USER_PW_KEY);
  if (userSN !== null && userID !== null && userPW !== null) {
    return { USER_SN: userSN, USER_ID: userID, USER_PW: userPW };
  }
  return null;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(USER_SN_KEY);
  await AsyncStorage.removeItem(USER_ID_KEY);
  await AsyncStorage.removeItem(USER_PW_KEY);
}
