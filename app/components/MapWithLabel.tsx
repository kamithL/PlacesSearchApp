import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

type Props = {
    location: { latitude: number; longitude: number };
    placeName: string;
    placeAddress: string;
};

export default function MapWithLabel({ location, placeName, placeAddress }: Props) {
    return (
        <MapView
            style={styles.map}
            region={{
                ...location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            showsUserLocation
        >
            <Marker coordinate={location} anchor={{ x: 0.5, y: 1 }}>
                <View style={styles.container}>
                    <View style={styles.label}>
                        <Text style={styles.name}>{placeName}</Text>
                        <Text style={styles.address}>{placeAddress}</Text>
                    </View>
                    <View style={styles.pin} />
                </View>
            </Marker>
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width,
        height,
    },
    container: {
        alignItems: 'center',
    },
    label: {
        backgroundColor: 'white',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        elevation: 3,         // Android
        shadowColor: '#000',  // iOS
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 4,
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
    },
    address: {
        fontSize: 12,
        color: '#555',
    },
    pin: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'blue',
    },
});
