import { Status } from "@/interface/booking";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- Component con: Chuyển Tab ---
const TabSwitcher = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: Status;
  setActiveTab: (tab: Status) => void;
}) => {
  return (
    <View style={styles.container}>
      {Object.values(Status).map((status) => {
        const isActive = activeTab === status;
        return (
          <TouchableOpacity
            key={status}
            onPress={() => setActiveTab(status)}
            style={[styles.tabButton, isActive && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {status === Status.PENDING
                ? "Đang chờ"
                : status === Status.CONFIRMED
                ? "Đã đặt"
                : status === Status.CANCELLED
                ? "Đã hủy"
                : "Đã trả phòng"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabSwitcher;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6", // gray-100
    borderRadius: 9999,
    padding: 2,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#2563EB", // blue-600
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B7280", // gray-500
    textAlign: "center",
  },
  tabTextActive: {
    color: "#FFFFFF", // white
  },
});
