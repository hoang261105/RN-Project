import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// Import các bộ icon cần thiết
import RoomCard from "@/components/item/RoomCard";
import { useHotelById } from "@/hooks/useHotels";
import { useFilterRooms } from "@/hooks/useRooms";
import { RangePrice, RoomResponse } from "@/interface/room";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const sortByName = [
  {
    id: 1,
    sortBy: "title_az",
    name: "Tên tăng dần",
    icon: "sort-ascending",
    type: "name",
  },
  {
    id: 2,
    sortBy: "title_za",
    name: "Tên giảm dần",
    icon: "sort-descending",
    type: "name",
  },
  {
    id: 3,
    sortBy: "price_asc",
    name: "Giá tăng dần",
    icon: "sort-ascending",
    type: "price",
  },
  {
    id: 4,
    sortBy: "price_desc",
    name: "Giá giảm dần",
    icon: "sort-descending",
    type: "price",
  },
];

const FilterButton = ({
  label,
  icon,
  onPress,
}: {
  label: any;
  icon: any;
  onPress: () => void;
}) => (
  <TouchableOpacity
    className="flex-row items-center bg-gray-100 rounded-full px-4 py-2.5 mr-3"
    onPress={onPress}
  >
    <Text className="text-sm font-medium text-gray-700">{label}</Text>
    {icon && <Feather name={icon} size={16} color="#555" className="ml-1.5" />}
  </TouchableOpacity>
);

// --- Component chính: Màn hình Danh sách ---
export default function RoomScreen() {
  const router = useRouter();
  const { hotelId } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisiblePrice, setModalVisiblePrice] = useState(false);

  const [selectedSort, setSelectedSort] = useState("title_az");
  const [rangePrice, setRangePrice] = useState<RangePrice>({
    minPrice: 0,
    maxPrice: 0,
  });
  const [priceError, setPriceError] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const togglePriceModal = () => {
    setModalVisiblePrice(!isModalVisiblePrice);
  };

  const { data: rooms } = useFilterRooms(+hotelId, rangePrice, selectedSort);

  const { data: hotel } = useHotelById(+hotelId);

  const handlePress = (roomId: number) => {
    router.push({
      pathname: "/(tabs)/home/room/roomDetail/[roomId]",
      params: {
        roomId: roomId,
        hotelId: hotelId,
      },
    });
  };

  const handleChange = (field: string, value: string) => {
    const numericValue = value === "" ? 0 : parseInt(value, 10);

    if (isNaN(numericValue)) {
      return;
    }

    const newMin = field === "minPrice" ? numericValue : rangePrice.minPrice;
    const newMax = field === "maxPrice" ? numericValue : rangePrice.maxPrice;

    if (newMax > 0 && newMin > newMax) {
      setPriceError("Giá tối thiểu phải lớn hơn giá tối đa!");
    } else {
      setPriceError(""); 
    }

    setRangePrice((prevState) => ({
      ...prevState,
      [field]: numericValue,
    }));
  };

  const renderSortItem = ({ item }: any) => {
    const isSelected = selectedSort === item.sortBy;

    const IconComponent =
      item.type === "name" ? AntDesign : MaterialCommunityIcons;
    const iconName = item.icon;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedSort(item.sortBy); // Sửa: Set giá trị 'sortBy' (ví dụ: "az")
          toggleModal();
        }}
        className="flex-row justify-between items-center py-3.5"
      >
        <View className="flex-row items-center">
          <IconComponent
            name={iconName}
            size={22}
            color={isSelected ? "#504DE4" : "#333"}
          />
          <Text
            className={`ml-3 text-base ${
              isSelected ? "font-bold text-blue-600" : "text-gray-800"
            }`}
          >
            {item.name}
          </Text>
        </View>

        {/* Hiển thị dấu tick nếu được chọn */}
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#504DE4" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* --- 1. Header --- */}
      <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">{hotel?.name}</Text>
        {/* View rỗng để căn giữa title */}
        <View className="w-6" />
      </View>

      {/* --- 2. Thanh Lọc (Filter Bar) --- */}
      <View className="py-3 bg-white">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <FilterButton
            label="Sắp xếp theo"
            icon="chevron-down"
            onPress={toggleModal}
          />
          <FilterButton
            label="Lọc giá"
            icon="chevron-down"
            onPress={togglePriceModal}
          />
        </ScrollView>
      </View>

      <FlatList
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        data={rooms}
        keyExtractor={(item: RoomResponse) => item.id.toString()}
        renderItem={({ item }: { item: RoomResponse }) => (
          <RoomCard room={item} onPress={() => handlePress(item.id)} />
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-md text-center">
            Chưa có phòng nào.
          </Text>
        }
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Nội dung Modal (Giữ nguyên NativeWind) */}
        <View style={styles.modalContent}>
          <View className="bg-white rounded-t-2xl pt-3 pb-8 px-6">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Sắp xếp theo
            </Text>
            {sortByName.map((item) => (
              <View key={item.id}>{renderSortItem({ item })}</View>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalVisiblePrice}
        animationType="slide"
        transparent={true}
        onRequestClose={togglePriceModal}
      >
        <TouchableWithoutFeedback onPress={togglePriceModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          <View className="bg-white rounded-t-2xl pt-3 pb-8 flex-col">
            <View className="px-6">
              {/* Thanh gạt */}
              <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Lọc khoảng giá
              </Text>
            </View>

            <View className="px-6">
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-600 mb-2">
                  Từ
                </Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg p-3 text-base text-gray-900"
                  onChangeText={(text) => handleChange("minPrice", text)}
                />
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-600 mb-2">
                  Đến
                </Text>
                <TextInput
                  placeholder="5.000.000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-lg p-3 text-base text-gray-900"
                  onChangeText={(text) => handleChange("maxPrice", text)}
                />
                {
                  priceError && <Text className="text-red-500 text-sm">{priceError}</Text>
                }
              </View>
            </View>

            <View className="px-6 mt-2 pt-4 border-t border-gray-200">
              <TouchableOpacity
                className="bg-blue-600 rounded-lg py-3 items-center"
                onPress={togglePriceModal}
              >
                <Text className="text-base font-bold text-white">Lọc</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    // Chiếm toàn bộ màn hình, màu đen mờ
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    // Đẩy modal xuống dưới cùng
    flex: 1, // Chiếm toàn bộ chiều cao
    justifyContent: "flex-end",
    margin: 0,
  },
});
