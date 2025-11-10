import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Modal, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DateSelectionModal({
  isVisible,
  onClose,
  onConfirm,
  isFromPayment = false,
}: {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  isFromPayment?: boolean
}){
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');

  useEffect(() => {
    const fetchRangeDate = async () => {
      if (!isFromPayment) return; // chỉ load nếu đến từ Payment
      try {
        const stored = await AsyncStorage.getItem("rangeDate");
        if (stored) {
          const parsed = JSON.parse(stored);
          setStartDate(new Date(parsed.checkInDate));
          setEndDate(new Date(parsed.checkOutDate));
        }
      } catch (error) {
        console.error("Lỗi khi lấy rangeDate:", error);
      }
    };

    if (isVisible) fetchRangeDate(); // chỉ gọi khi modal mở
  }, [isVisible, isFromPayment]);

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || (pickerMode === 'start' ? startDate : endDate);
    setShowPicker(Platform.OS === 'ios'); 

    if (pickerMode === 'start') {
      setStartDate(currentDate);
      if (currentDate >= endDate) {
        setEndDate(new Date(new Date(currentDate).setDate(currentDate.getDate() + 1)));
      }
    } else {
      setEndDate(currentDate);
    }
  };

  // Hàm helper để định dạng ngày
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Hàm xử lý khi bấm nút "Xác nhận"
  const handleConfirm = async () => {
    onConfirm(startDate, endDate);
    await AsyncStorage.setItem("rangeDate", JSON.stringify({
      checkInDate: startDate.toISOString(),
      checkOutDate: endDate.toISOString(),
    }))
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {/* Lớp nền mờ */}
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        {/* Nội dung Modal */}
        <Pressable
          className="bg-white rounded-t-3xl shadow-lg"
          onPress={() => {}} // Ngăn modal đóng khi bấm vào nội dung
        >
          <SafeAreaView edges={["bottom"]} className="pt-4">
            {/* Grabber */}
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

            <View className="px-6">
              <Text className="text-xl font-bold text-gray-900 mb-5">
                Chọn ngày
              </Text>

              {/* Ô 1: Ngày nhận phòng */}
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3 mb-4"
                onPress={() => {
                  setPickerMode('start');
                  setShowPicker(true);
                }}
              >
                <Text className="text-xs font-medium text-gray-500">
                  NHẬN PHÒNG
                </Text>
                <Text className="text-base font-bold text-gray-900 mt-1">
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>

              {/* Ô 2: Ngày trả phòng */}
              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3"
                onPress={() => {
                  setPickerMode('end');
                  setShowPicker(true);
                }}
              >
                <Text className="text-xs font-medium text-gray-500">
                  TRẢ PHÒNG
                </Text>
                <Text className="text-base font-bold text-gray-900 mt-1">
                  {formatDate(endDate)}
                </Text>
              </TouchableOpacity>

              {/* Nút Xác nhận */}
              <TouchableOpacity
                className="bg-blue-600 py-4 rounded-lg mt-6 mb-4"
                onPress={handleConfirm}
              >
                <Text className="text-white text-base font-bold text-center">
                  Tiếp theo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Component DateTimePicker (Sẽ hiện đè lên nếu là Android) */}
            {showPicker && (
              <DateTimePicker
                value={pickerMode === 'start' ? startDate : endDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={pickerMode === 'end' ? new Date(new Date(startDate).setDate(startDate.getDate() + 1)) : new Date()}
                onTouchCancel={() => setShowPicker(false)}
              />
            )}
            
            {/* Trên iOS, picker cần có nút "Done" */}
            {Platform.OS === 'ios' && showPicker && (
               <TouchableOpacity
                className="bg-gray-200 py-3 rounded-lg mx-6 mb-4"
                onPress={() => setShowPicker(false)}
              >
                <Text className="text-blue-600 text-base font-bold text-center">
                  Xong
                </Text>
              </TouchableOpacity>
            )}

          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};