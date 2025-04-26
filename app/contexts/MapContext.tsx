import React, { createContext, useContext, useState, ReactNode } from 'react';

type Location = { latitude: number; longitude: number };
type MapContextType = {
    location: Location;
    setLocation: (loc: Location) => void;
    placeName: string;
    setPlaceName: (name: string) => void;
    placeAddress: string;
    setPlaceAddress: (addr: string) => void;
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState<Location>({ latitude: 6.9271, longitude: 79.8612 });
    const [placeName, setPlaceName] = useState('');
    const [placeAddress, setPlaceAddress] = useState('');

    return (
        <MapContext.Provider
            value={{ location, setLocation, placeName, setPlaceName, placeAddress, setPlaceAddress }}
        >
            {children}
        </MapContext.Provider>
    );
}

export function useMap() {
    const ctx = useContext(MapContext);
    if (!ctx) throw new Error("useMap must be used within <MapProvider>");
    return ctx;
}

export default MapContext;
