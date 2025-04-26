import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@search_history';

export async function saveSearchHistory(item: string) {
    const raw = await AsyncStorage.getItem(KEY) || '[]';
    const arr: string[] = JSON.parse(raw);
    const next = [item, ...arr.filter(i => i !== item)];
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function loadSearchHistory(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(KEY) || '[]';
    return JSON.parse(raw);
}

/** Remove a single entry */
export async function removeSearchHistoryItem(item: string) {
    const raw = await AsyncStorage.getItem(KEY) || '[]';
    const arr: string[] = JSON.parse(raw);
    const next = arr.filter(i => i !== item);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

/** Clear the entire history */
export async function clearSearchHistory() {
    await AsyncStorage.removeItem(KEY);
}
