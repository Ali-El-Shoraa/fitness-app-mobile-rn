import { Stack } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="exercise"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="exerciseDetails"
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>

    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme].tint,
    //     // Disable the static render of the header on web
    //     // to prevent a hydration error in React Navigation v6.
    //     headerShown: useClientOnlyValue(false, true),
    //   }}
    // >
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       headerShown: false,
    //       title: "Tab One",
    //       tabBarIcon: ({ color }) => (
    //         <SymbolView
    //           name={{
    //             ios: "chevron.left.forwardslash.chevron.right",
    //             android: "code",
    //             web: "code",
    //           }}
    //           tintColor={color}
    //           size={28}
    //         />
    //       ),
    //       headerRight: () => (
    //         <Link href="/modal" asChild>
    //           <Pressable style={{ marginRight: 15 }}>
    //             {({ pressed }) => (
    //               <SymbolView
    //                 name={{ ios: "info.circle", android: "info", web: "info" }}
    //                 size={25}
    //                 tintColor={Colors[colorScheme].text}
    //                 style={{ opacity: pressed ? 0.5 : 1 }}
    //               />
    //             )}
    //           </Pressable>
    //         </Link>
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="two"
    //     options={{
    //       title: "Tab Two",
    //       tabBarIcon: ({ color }) => (
    //         <SymbolView
    //           name={{
    //             ios: "chevron.left.forwardslash.chevron.right",
    //             android: "code",
    //             web: "code",
    //           }}
    //           tintColor={color}
    //           size={28}
    //         />
    //       ),
    //     }}
    //   />
    // </Tabs>
  );
}
