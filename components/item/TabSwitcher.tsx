import { Status } from "@/interface/booking";
import { Text, TouchableOpacity, View } from "react-native";

// --- Component con: Chuyển Tab ---
const TabSwitcher = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: Status;
  setActiveTab: (tab: Status) => void;
}) => {
  return (
    <View className="flex-row bg-gray-100 rounded-full p-1 mx-5 mb-5">
      {/* Tab Upcoming */}
      <TouchableOpacity
        onPress={() => setActiveTab(Status.PENDING)}
        className={`flex-1 py-3 rounded-full ${
          activeTab === Status.PENDING
            ? "bg-blue-600 shadow-md"
            : "bg-transparent"
        }`}
      >
        <Text
          className={`text-base font-bold text-center ${
            activeTab === Status.PENDING ? "text-white" : "text-gray-500"
          }`}
        >
          Đang chờ
        </Text>
      </TouchableOpacity>
      {/* Tab Past */}
      <TouchableOpacity
        onPress={() => setActiveTab(Status.CONFIRMED)}
        className={`flex-1 py-3 rounded-full ${
          activeTab === Status.CONFIRMED
            ? "bg-blue-600 shadow-md"
            : "bg-transparent"
        }`}
      >
        <Text
          className={`text-base font-bold text-center ${
            activeTab === Status.CONFIRMED ? "text-white" : "text-gray-500"
          }`}
        >
          Đã đặt
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setActiveTab(Status.CANCELLED)}
        className={`flex-1 py-3 rounded-full ${
          activeTab === Status.CANCELLED
            ? "bg-blue-600 shadow-md"
            : "bg-transparent"
        }`}
      >
        <Text
          className={`text-base font-bold text-center ${
            activeTab === Status.CANCELLED ? "text-white" : "text-gray-500"
          }`}
        >
          Đã hủy
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabSwitcher