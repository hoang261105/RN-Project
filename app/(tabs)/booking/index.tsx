import BookingCard from "@/components/item/BookingCard";
import TabSwitcher from "@/components/item/TabSwitcher";
import { useBookings } from "@/hooks/useBookings";
import { useCurrentUser } from "@/hooks/useUser";
import { BookingResponse, Status } from "@/interface/booking";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Màn hình chính ---
const BookingsScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Status>(Status.PENDING);
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const { data: bookings = [], isLoading: bookingsLoading } = useBookings(
    user?.id,
    activeTab
  );

  const TabSwitcherMemo = React.memo(TabSwitcher);

  // Gộp 2 trạng thái loading
  const isLoading = userLoading || bookingsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 1. Header Title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/(tabs)/home")
          }
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phòng của tôi</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#504DE4" />
        </View>
      ) : (
        <>
          {/* Tab Switcher */}
          <TabSwitcherMemo activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Danh sách Đặt phòng */}
          <FlatList
            data={bookings}
            keyExtractor={(item: BookingResponse) =>
              item.bookingId.toString()
            }
            renderItem={({ item }) => <BookingCard booking={item} />}
            showsVerticalScrollIndicator={false}
            extraData={activeTab}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Danh sách trống!
                </Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
