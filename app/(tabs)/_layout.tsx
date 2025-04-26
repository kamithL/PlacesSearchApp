import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import {MapProvider} from "@/app/contexts/MapContext";

export default function Layout() {
    return (
        <MapProvider>
            <Tabs screenOptions={{
                headerShown: false,
            }} >
                <Tabs.Screen
                    name="map"
                    options={{
                        title: 'Map',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="map" color={color} size={size} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: 'History',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome5 name="history" color={color} size={size} />
                        ),
                    }}
                />
            </Tabs>
        </MapProvider>
    );
}
