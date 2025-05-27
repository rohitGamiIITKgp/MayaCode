# MayaCode - Learn to Code App

MayaCode is a modern mobile application designed to help users learn programming through interactive courses, coding challenges, and practice exercises. The app provides a comprehensive learning experience with features like course tracking, progress monitoring, and a supportive community.

## Features

- **Authentication**
  - User registration and login
  - Secure authentication system
  - Profile management

- **Learning Experience**
  - Structured courses in various programming languages
  - Interactive coding challenges
  - Progress tracking
  - Course completion certificates

- **Practice Section**
  - Coding challenges with different difficulty levels
  - Real-time code editor
  - Mini projects
  - Daily challenges

- **User Profile**
  - Learning statistics
  - Achievement tracking
  - Course progress
  - Settings management

## Tech Stack

- React Native
- TypeScript
- Expo Router
- NativeWind (Tailwind CSS)
- FontAwesome Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mayacode.git
   cd mayacode
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on your device:
   - Scan the QR code with the Expo Go app (Android) or Camera app (iOS)
   - Press 'a' to run on Android emulator
   - Press 'i' to run on iOS simulator

## Project Structure

```
mayacode/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── learn.tsx
│   │   ├── practice.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── assets/
│   ├── images/
│   └── fonts/
├── types/
│   └── index.ts
├── components/
├── constants/
└── utils/
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by ChiltelApp
- Icons provided by FontAwesome
To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
