import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';  // ← import this
import { useMap } from '@/app/contexts/MapContext';
import {
    loadSearchHistory,
    removeSearchHistoryItem,
    clearSearchHistory,
} from '@/app/utils/storage';
import Constants from 'expo-constants';
import {useRouter} from "expo-router";
// @ts-ignore
const API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

export default function HistoryScreen() {
    const { setLocation } = useMap();
    const [history, setHistory] = useState<string[]>([]);
    const router = useRouter();
    const refresh = useCallback(async () => {
        setHistory(await loadSearchHistory());
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);


    useFocusEffect(
        useCallback(() => {
            refresh();
        }, [refresh])
    );

    const goTo = async (text: string) => {
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
                `?input=${encodeURIComponent(text)}` +
                `&inputtype=textquery&fields=geometry&key=${API_KEY}`
            );
            const json = await res.json();
            const loc = json.candidates?.[0]?.geometry?.location;
            if (loc) {
                setLocation({ latitude: loc.lat, longitude: loc.lng });
                router.push('/(tabs)/map');
            }
        } catch (e) {
            console.warn(e);
        }
    };
    const confirmDelete = (item: string) => {
        Alert.alert('Remove?', `Delete "${item}" from history?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await removeSearchHistoryItem(item);
                    await refresh();
                },
            },
        ]);
    };

    const confirmClearAll = () => {
        Alert.alert('Clear All?', 'Delete your entire search history?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Clear',
                style: 'destructive',
                onPress: async () => {
                    await clearSearchHistory();
                    await refresh();
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={styles.header}>
                <Text style={styles.title}>Search History</Text>
                {history.length > 0 && (
                    <TouchableOpacity onPress={confirmClearAll}>
                        <Text style={styles.clearAll}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={history}
                keyExtractor={(item, i) => `${item}-${i}`}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.rowText}
                            onPress={() => goTo(item)}
                        >
                            <Text>{item}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => confirmDelete(item)}>
                            <Text style={styles.delete}>🗑</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No history yet</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: { fontSize: 20, fontWeight: '600' },
    clearAll: { color: 'red', fontSize: 14 },
    row: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowText: { flex: 1 },
    delete: { color: 'red', marginLeft: 12 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#888' },
});
