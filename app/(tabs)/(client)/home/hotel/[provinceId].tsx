import HotelCard from "@/components/item/HotelCard";
import { useFilterProvinces, useProvinceById, useProvinces } from "@/hooks/useProvinces";
import { HotelResponse } from "@/interface/hotel";
import { ProvinceResponse } from "@/interface/province";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sortOptions = [
  { id: "az", name: "Tên tăng dần", icon: "sort-ascending" },
  { id: "za", name: "Tên giảm dần", icon: "sort-descending" },
];

// --- Component con: Nút Lọc ---
const FilterButton = ({
  label,
  icon,
  onPress,
}: {
  label: any;
  icon: any;
  onPress?: () => void;
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
export default function ListingScreen() {
  const router = useRouter();
  const { provinceId } = useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLocalityModalVisible, setLocalityModalVisible] = useState(false);
  const [selectedProvinces, setSelectedProvinces] = useState<number[]>(
    provinceId ? [+provinceId] : []
  );
  const [tempSelectedProvinces, setTempSelectedProvinces] = useState<number[]>(
    []
  );
  const [selectedSort, setSelectedSort] = useState("az");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // --- HÀM ÁP DỤNG LỌC ---
  const handleApplyFilter = () => {
    if (tempSelectedProvinces.length === 0) {
      setSelectedProvinces(provinceId ? [+provinceId] : []);
    } else {
      setSelectedProvinces(tempSelectedProvinces);
    }

    // Đóng modal
    setLocalityModalVisible(false);
  };

  // (Hàm này dùng cho các checkbox BÊN TRONG modal)
  // Hàm xử lý khi nhấn vào 1 checkbox
  const handleLocalitySelect = (provinceId: number) => {
    if (tempSelectedProvinces.includes(provinceId)) {
      setTempSelectedProvinces((prev) =>
        prev.filter((item) => item !== provinceId)
      );
    } else {
      setTempSelectedProvinces((prev) => [...prev, provinceId]);
    }
  };

  // (Hàm này cho nút "Clear All" BÊN TRONG modal)
  const handleClearAll = () => {
    setTempSelectedProvinces([]); // Chỉ clear state tạm
  };

  const toggleLocalityModal = () => {
    setLocalityModalVisible(!isLocalityModalVisible);
  };

  const { data: province } = useProvinceById(+provinceId)

  const { data: provinces } = useProvinces();

  const {
    data: hotels,
    isLoading,
    isError,
  } = useFilterProvinces(selectedProvinces, selectedSort);

  const handlePress = (hotelId: number) => {
    router.push({
      pathname: "/(tabs)/(client)/home/room/[hotelId]",
      params: {
        hotelId: hotelId,
      },
    });
  };

  const renderSortItem = ({ item }: any) => {
    const isSelected = selectedSort === item.id;

    const IconComponent = AntDesign;
    const iconName = item.icon;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedSort(item.id);
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
    <React.Fragment>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* --- 1. Header --- */}
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          {/* ... (Code Header của bạn) ... */}
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            {province?.provinceName}
          </Text>
          <View className="w-6" />
        </View>

        {/* --- 2. Thanh Lọc (Filter Bar) --- */}
        <View className="py-3 bg-white">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always" // (Giữ cái này)
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <FilterButton
              label="Sắp xếp theo"
              icon="chevron-down"
              onPress={toggleModal}
            />
            <FilterButton
              label="Lọc vị trí"
              icon="chevron-down"
              onPress={toggleLocalityModal}
            />
          </ScrollView>
        </View>

        {/* --- 3. Danh sách khách sạn --- */}
        <FlatList
          className="flex-1 mt-4"
          // ... (Props của FlatList)
          data={hotels}
          keyExtractor={(item: HotelResponse) => item.id.toString()}
          renderItem={({ item }: { item: HotelResponse }) => (
            <HotelCard
              hotel={item}
              onPress={() => handlePress(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text className="text-gray-500 text-md text-center">
              Chưa có khách sạn nào.
            </Text>
          }
        />
      </SafeAreaView>

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
            {sortOptions.map((item) => (
              <View key={item.id}>{renderSortItem({ item })}</View>
            ))}
          </View>
        </View>
      </Modal>

      {/* --- THÊM MODAL MỚI: LỌC VỊ TRÍ --- */}
      <Modal
        visible={isLocalityModalVisible} // <-- State mới
        animationType="slide"
        transparent={true}
        onRequestClose={toggleLocalityModal} // <-- Hàm mới
      >
        {/* Backdrop (lớp nền mờ) */}
        <TouchableWithoutFeedback onPress={toggleLocalityModal}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Nội dung Modal */}
        <View style={styles.modalContent}>
          <View className="bg-white rounded-t-2xl pt-3 pb-8 px-6">
            {/* Thanh gạt */}
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

            {/* Tiêu đề */}
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Locality
            </Text>

            <ScrollView
              className="h-56 px-6 mt-2" // 'flex-1' làm cho nó lấp đầy không gian
              showsVerticalScrollIndicator={false}
            >
              {/* Danh sách Checkbox */}
              {provinces.map((item: ProvinceResponse) => {
                const isSelected = tempSelectedProvinces.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleLocalitySelect(item.id)}
                    className="flex-row items-center py-2.5"
                  >
                    <MaterialCommunityIcons
                      name={
                        isSelected
                          ? "checkbox-marked"
                          : "checkbox-blank-outline"
                      }
                      size={24}
                      color={isSelected ? "#504DE4" : "#555"}
                    />
                    <Text className="ml-3 text-base text-gray-800">
                      {item.provinceName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Nút Clear All / Apply */}
            <View className="flex-row justify-between mt-6 pt-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={handleClearAll}
                className="flex-1 border border-gray-300 rounded-lg py-3 items-center mr-2"
              >
                <Text className="text-base font-bold text-gray-800">
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApplyFilter}
                className="flex-1 bg-blue-600 rounded-lg py-3 items-center ml-2"
              >
                <Text className="text-base font-bold text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </React.Fragment>
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
