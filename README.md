# 🏙️ UrbanApp

*Improve your city, one report at a time.*

**UrbanApp** is an exclusive, corporate mobile application built with **React Native** and **Expo**, designed for authorized technicians and workers to swiftly and centrally log, manage, and resolve urban incidents.

## 🚀 Key Features

- 🔒 **Secure Private Access:** Bulletproof, exclusive login system (no public registration). Smart 15-day persistent sessions with automatic reconnection.
- 📋 **Incident Manager:** Real-time board to visualize active and resolved reports at a glance.
- 👨‍🔧 **Operator Profiles:** Internal gamification that measures and acknowledges performance and resolved incidents for each technical profile.
- ⚡ **Real-Time Synchronization:** Backed by **Supabase** to ensure the incident database is always up to date among all employees.

## 🛠️ Technologies Used

This corporate project is built following the most robust modern standards:
- **Frontend:** [React Native](https://reactnative.dev/)
- **Framework:** [Expo](https://expo.dev/) (with Expo Router for *file-based routing*)
- **Backend & Auth:** [Supabase](https://supabase.com/) (BaaS, comprehensive authentication without local passwords, and database)
- **Local Persistence:** `@react-native-async-storage/async-storage`

## ⚙️ Setup and Usage

For temporary development and technician usage:

1. **Install dependencies:**
   Run the following command in your terminal. This will automatically download and generate the `node_modules` folder with all required packages *(Note: The `node_modules` folder is intentionally excluded from this repository due to its large size).*
   ```bash
   npm install
   ```

2. **Environment Variables:**
   To authenticate on the private network, connect the project to Supabase.
   Make sure to configure the `.env` file in the root directory (this file is intentionally excluded from repositories for security) containing:
   ```env
   EXPO_PUBLIC_SUPABASE_URL="your-supabase-url"
   EXPO_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

3. **Start the local development server:**
   ```bash
   npx expo start
   ```

4. **Physical Deployment:**
   To instantly test on your device, use the **Expo Go** App by scanning the generated QR code.

---
*Built to make cities cleaner, safer, and more efficient.* 🙌
