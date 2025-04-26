import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useMap } from '@/app/contexts/MapContext';
import { saveSearchHistory } from '@/app/utils/storage';

const { width, height } = Dimensions.get('window');
// @ts-ignore
const API_KEY = Constants.expoConfig.extra.googleMapsApiKey;

export default function MapScreen() {
    const mapRef = useRef<MapView>(null);
    const {
        location,
        setLocation,
        placeName,
        placeAddress,
        setPlaceName,
        setPlaceAddress,
    } = useMap();

    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState<any[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const onChangeText = useCallback((text: string) => {
        setQuery(text);
        setPredictions([]);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (text.length < 2) return;
            fetchPredictions(text);
        }, 300);
    }, []);

    const fetchPredictions = async (text: string) => {
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                    text
                )}&key=${API_KEY}`
            );
            const json = await res.json();
            setPredictions(json.predictions || []);
        } catch (e) {
            console.warn('Error fetching predictions:', e);
        }
    };

    const onSelect = async (placeId: string, desc: string) => {
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`
            );
            const json = await res.json();
            const { location: loc } = json.result.geometry;
            const name = json.result.name;
            const address = json.result.formatted_address;

            setLocation({ latitude: loc.lat, longitude: loc.lng });
            setPlaceName(name);
            setPlaceAddress(address);
            mapRef.current?.animateToRegion(
                { latitude: loc.lat, longitude: loc.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 },
                600
            );

            await saveSearchHistory(desc);
            setQuery('');
            setPredictions([]);
        } catch (e) {
            console.warn('Error fetching place details', e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.searchContainer, { top: 8 }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Search…"
                    value={query}
                    onChangeText={onChangeText}
                />
                {predictions.length > 0 && (
                    <FlatList
                        data={predictions}
                        keyExtractor={(i) => i.place_id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.suggestion}
                                onPress={() => onSelect(item.place_id, item.description)}
                            >
                                <Text>{item.description}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.suggestionsList}
                    />
                )}
            </View>

            <MapView
                ref={mapRef}
                style={styles.map}
                region={{
                    ...location,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation
            >
                <Marker coordinate={location}>
                    <View style={styles.bubble}>
                        <Text style={styles.bubbleTitle} numberOfLines={1}>
                            {placeName}
                        </Text>
                        <Text style={styles.bubbleSubtitle} numberOfLines={2}>
                            {placeAddress}
                        </Text>
                    </View>
                    <View style={styles.arrowDown} />
                </Marker>
            </MapView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    searchContainer: {
        position: 'absolute',
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 6,
        zIndex: 10,
        elevation: 5,
    },
    input: {
        height: 42,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fafafa',
    },
    suggestionsList: {
        marginTop: 4,
        maxHeight: 160,
        backgroundColor: '#fff',
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    map: {
        width,
        height,
    },

    bubble: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 6,
        maxWidth: 180,
        alignItems: 'center',
        // shadow on iOS
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        // elevation on Android
        elevation: 3,
    },
    bubbleTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    bubbleSubtitle: {
        fontSize: 12,
        color: '#555',
        marginTop: 2,
    },
    arrowDown: {
        backgroundColor: 'transparent',
        borderWidth: 6,
        borderColor: 'transparent',
        borderTopColor: '#fff',
        alignSelf: 'center',
        marginTop: -1,
    },
});
