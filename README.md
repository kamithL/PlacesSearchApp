# 📍 PlacesSearchApp

A React Native Expo application that lets users:

- 🔍 Search for places via the Google Maps Places API with real-time autocomplete  
- 🗺️ View selected places on a map with a marker  
- 📜 Persist and browse a local search history  
- 🔄 Re-center the map by tapping history items  
- 📱 Navigate between **Map** and **History** via bottom tabs  

---

## 🚀 Features

1. **Autocomplete Search**  
   - Debounced (300 ms) queries to Google Places Autocomplete  
   - Real-time suggestions under the search bar  

2. **Map Display**  
   - Map drops a marker at the selected place  
   - Animates to the new region smoothly  

3. **Search History**  
   - Stores each unique search locally via AsyncStorage  
   - Newest searches appear at the top  
   - Tap an item to re-fetch and re-center  

4. **Two-Tab Navigation**  
   - **Map**: Main search + map view  
   - **History**: List of past searches  

5. **Performance & UX**  
   - Debounced API calls  
   - AsyncStorage persistence  
   - Safe-area handling for notch/status bar  

---

## 🛠️ Getting Started

### 1. Prerequisites

- **Node.js** LTS (≥16.x)  
- **Yarn** _or_ **npm**  
- **Expo CLI**  
  ```bash
  npm install -g expo-cli
  # or
  yarn global add expo-cli



### 2. Clone & Install
git clone git@github.com:kamithL/PlacesSearchApp.git
cd PlacesSearchApp
yarn install   # or: npm install

### 3. Configure Your Google API Key (via `.env`)

1. In the Google Cloud Console, enable **Places API** and **Maps SDK for iOS/Android**.
2. Create an API key and add the usual restrictions (bundle ID / package name, and only enable Places & Maps SDK).

3. Install `dotenv` (dev-time) so you can load environment variables into your Expo config:

   ```bash
   yarn add -D dotenv
   # or
   npm install --save-dev dotenv
### 4. Create a file at the project root called .env:
GOOGLE_MAPS_API_KEY=*******…YourKeyHere

### 5. Run the App
    iOS Simulator
        expo run:ios --device

    Android Emulator
        expo run:android

    If you’re using a custom Dev Client, use:
        expo start --dev-client

📂 Project Structure
.
├── app/                        # Expo Router entry-point
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Bottom-tab layout
│   │   ├── map.tsx             # Map screen
│   │   └── history.tsx         # History screen
│   └── index.tsx               # App bootstrap
├── app/components/
│   └── MapWithLabel.tsx        # Custom map marker + label
├── app/contexts/
│   └── MapContext.tsx          # Shared map state (location, place info)
├── app/utils/
│   └── storage.ts              # AsyncStorage helpers
├── assets/                     # Icons, splash, etc.
├── app.json                    # Expo config (incl. API key in extra)
├── package.json
└── README.md                   # ← You are here
