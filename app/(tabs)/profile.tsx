import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  // بيانات تجريبية (يمكنك استبدالها ببيانات من Firebase أو API لاحقاً)
  const user = {
    name: "User Name",
    email: "user@gemini.com",
    image: "https://picsum.photos/200", // صورة عشوائية
    workouts: 24,
    weight: "75 kg",
    height: "180 cm",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* الجزء العلوي: الصورة والاسم */}
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <Image
              source={user.image}
              style={styles.profileImage}
              transition={500}
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={hp(2)} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* قسم الإحصائيات (Stats) */}
        <View style={styles.statsContainer}>
          <StatBox label="Workouts" value={user.workouts} color="#ff2056" />
          <StatBox label="Weight" value={user.weight} color="#3b82f6" />
          <StatBox label="Height" value={user.height} color="#10b981" />
        </View>

        {/* القائمة (Menu Options) */}
        <View style={styles.menuContainer}>
          <MenuItem icon="person-outline" title="Edit Profile" />
          <MenuItem icon="notifications-outline" title="Notifications" />
          <MenuItem icon="shield-checkmark-outline" title="Privacy Policy" />
          <MenuItem icon="help-circle-outline" title="Help & Support" />

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={hp(2.8)} color="#ff2056" />
              <Text style={[styles.menuText, { color: "#ff2056" }]}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// مكون فرعي لصناديق الإحصائيات
const StatBox = ({ label, value, color }: any) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// مكون فرعي لعناصر القائمة
const MenuItem = ({ icon, title }: any) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuLeft}>
      <Ionicons name={icon} size={hp(2.8)} color="#404040" />
      <Text style={styles.menuText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={hp(2.2)} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    alignItems: "center",
    marginTop: hp(3),
    marginBottom: hp(4),
  },
  imageContainer: {
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: {
    width: hp(15),
    height: hp(15),
    borderRadius: hp(7.5),
    borderWidth: 4,
    borderColor: "white",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#ff2056",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  userName: {
    fontSize: hp(2.8),
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  userEmail: {
    fontSize: hp(1.8),
    color: "#777",
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: hp(4),
  },
  statBox: {
    backgroundColor: "white",
    width: wp(28),
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statValue: {
    fontSize: hp(2.2),
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: hp(1.5),
    color: "#888",
    marginTop: 5,
  },
  menuContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuText: {
    fontSize: hp(2),
    fontWeight: "500",
    color: "#444",
  },
});
