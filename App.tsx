@@ .. @@
-import { StatusBar } from 'expo-status-bar';
-import { StyleSheet, Text, View } from 'react-native';
+import React from 'react';
+import { StatusBar } from 'expo-status-bar';
+import { AuthProvider } from './src/contexts/AuthContext';
+import { AppNavigator } from './src/navigation/AppNavigator';
 
 export default function App() {
   return (
-    <View style={styles.container}>
-      <Text>Open up App.tsx to start working on your app!</Text>
+    <AuthProvider>
       <StatusBar style="auto" />
-    </View>
+      <AppNavigator />
+    </AuthProvider>
   );
 }
-
-const styles = StyleSheet.create({
-  container: {
-    flex: 1,
-    backgroundColor: '#fff',
-    alignItems: 'center',
-    justifyContent: 'center',
-  },
-});