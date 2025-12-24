# Hangover App - Expo Implementation

A modern event discovery app for Montenegro's nightlife scene, built with Expo and React Native.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- VS Code with React Native extensions
- Android Studio (for Android) or Xcode (for iOS/Mac only)
- Expo Go app on your phone (for testing)

### Setup Instructions

1. **Create new Expo project in VS Code terminal:**
```bash
npx create-expo-app hangover-app --template blank-typescript
cd hangover-app
```

2. **Copy the provided files:**
- Replace the default `App.tsx` with the provided one
- Copy `app.json` configuration
- Copy `package.json` dependencies
- Copy the entire `src/` folder structure

3. **Install dependencies:**
```bash
npm install
```

4. **Install additional Expo packages:**
```bash
npx expo install expo-linear-gradient expo-blur expo-notifications expo-location expo-font expo-splash-screen expo-image expo-haptics expo-constants expo-device expo-secure-store expo-barcode-scanner
```

5. **Install React Navigation and other libraries:**
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated
```

6. **Install UI dependencies:**
```bash
npm install react-native-vector-icons @types/react-native-vector-icons
npx expo install react-native-svg
```

7. **Install state management and utilities:**
```bash
npm install @reduxjs/toolkit react-redux axios date-fns
npm install @react-native-async-storage/async-storage @react-native-community/netinfo
```

8. **Start the development server:**
```bash
npx expo start
```

9. **Run on device/simulator:**
- Press `a` for Android emulator
- Press `i` for iOS simulator (Mac only)
- Scan QR code with Expo Go app on your phone

## 📱 Testing on Your Phone

1. Download **Expo Go** from:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Make sure your phone and computer are on the same WiFi network

3. Scan the QR code shown in the terminal with:
   - iOS: Camera app
   - Android: Expo Go app

## 🎨 App Features

- **Event Discovery**: Browse events in Montenegro cities
- **City Filter**: Podgorica, Bar, Nikšić, Cetinje, Berane, Bijelo Polje, Kolašin
- **Genre Filters**: Live Music, DJ Set, Festival, Club Night, Concert, Party
- **Search**: Real-time search across events, venues, and artists
- **Favorites**: Like/unlike events with heart button
- **Beautiful UI**: Purple/pink gradients, dark theme, Instagram-style cards

## 🛠️ Project Structure

```
hangover-app/
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── src/
│   ├── screens/          # Screen components
│   │   ├── EventsScreen.tsx
│   │   ├── PlacesScreen.tsx
│   │   ├── TicketsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ...
│   ├── store/            # Redux store
│   │   ├── index.ts
│   │   ├── eventsSlice.ts
│   │   └── ...
│   └── services/         # API services
│       └── api.ts
└── assets/              # Images, fonts
```

## 🔧 Environment Setup

1. **Create `.env` file in root:**
```
EXPO_PUBLIC_API_URL=https://api.hangover.me
```

2. **Update API URL in `src/services/api.ts`:**
```typescript
const API_BASE_URL = 'https://your-backend-url.com';
```

## 📦 Building for Production

### Android APK:
```bash
eas build --platform android --profile preview
```

### iOS (requires Apple Developer account):
```bash
eas build --platform ios --profile preview
```

### Submit to App Stores:
```bash
eas submit --platform android
eas submit --platform ios
```

## 🐛 Troubleshooting

### Common Issues:

1. **Metro bundler issues:**
```bash
npx expo start --clear
```

2. **Dependencies issues:**
```bash
rm -rf node_modules
npm install
npx expo doctor
```

3. **Android build issues:**
```bash
cd android && ./gradlew clean
cd .. && npx expo run:android
```

## 🚀 Next Steps

1. **Connect to Backend:**
   - Update API endpoints in `src/services/api.ts`
   - Add your Laravel backend URL

2. **Add Real Data:**
   - Replace mock data in `eventsSlice.ts`
   - Connect to real API endpoints

3. **Implement Features:**
   - Complete table reservation flow
   - Add QR code generation
   - Implement push notifications

4. **Testing:**
   - Test on real devices
   - Test offline functionality
   - Performance optimization

## 📞 Support

For questions or issues:
- Check [Expo Documentation](https://docs.expo.dev)
- Visit [React Navigation Docs](https://reactnavigation.org)
- Review [Redux Toolkit Docs](https://redux-toolkit.js.org)

## 🎉 Ready to Party!

Your Hangover app is now ready for development. Start coding and bring Montenegro's nightlife to mobile! 🇲🇪

---

**Note**: This is the Expo version optimized for faster development and easier deployment. Perfect for your event discovery app!
