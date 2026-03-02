import { useBookedDates } from "@/hooks/useBookings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DateSelectionModal({
  isVisible,
  onClose,
  onConfirm,
  roomId,
  isFromPayment = false,
}: {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  roomId: number;
  isFromPayment?: boolean;
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");

  const { data: bookedDates = [] } = useBookedDates(roomId);
  
  useEffect(() => {
    const fetchRangeDate = async () => {
      if (!isFromPayment) return;
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

    if (isVisible) fetchRangeDate();
  }, [isVisible, isFromPayment]);

  const normalize = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const isRangeAvailable = (start: Date, end: Date) => {
    const nStart = normalize(start);
    const nEnd = normalize(end);

    return !bookedDates.some(({ checkInDate, checkOutDate }: any) => {
      const bookedStart = normalize(new Date(checkInDate));
      const bookedEnd = normalize(new Date(checkOutDate));
      return nStart < bookedEnd && nEnd > bookedStart;
    });
  };
  
  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate =
      selectedDate || (pickerMode === "start" ? startDate : endDate);
    setShowPicker(Platform.OS === "ios");

    if (pickerMode === "start") {
      setStartDate(currentDate);
      if (currentDate >= endDate) {
        setEndDate(
          new Date(new Date(currentDate).setDate(currentDate.getDate() + 1))
        );
      }
    } else {
      setEndDate(currentDate);
    }
  };


  const formatDate = (date: Date) =>
    date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const handleConfirm = async () => {
    if (!isRangeAvailable(startDate, endDate)) {
      Alert.alert(
        "Ngày đã được đặt",
        "Khoảng ngày này đã có người đặt. Vui lòng chọn khoảng khác."
      );
      return;
    }

    onConfirm(startDate, endDate);
    await AsyncStorage.setItem(
      "rangeDate",
      JSON.stringify({
        checkInDate: startDate.toISOString(),
        checkOutDate: endDate.toISOString(),
      })
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-3xl shadow-lg"
          onPress={() => {}}
        >
          <SafeAreaView edges={["bottom"]} className="pt-4">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
            <View className="px-6">
              <Text className="text-xl font-bold text-gray-900 mb-5">
                Chọn ngày
              </Text>

              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3 mb-4"
                onPress={() => {
                  setPickerMode("start");
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

              <TouchableOpacity
                className="border border-gray-300 rounded-lg p-3"
                onPress={() => {
                  setPickerMode("end");
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

              <TouchableOpacity
                className="bg-blue-600 py-4 rounded-lg mt-6 mb-4"
                onPress={handleConfirm}
              >
                <Text className="text-white text-base font-bold text-center">
                  Tiếp theo
                </Text>
              </TouchableOpacity>
            </View>

            {showPicker && (
              <DateTimePicker
                value={pickerMode === "start" ? startDate : endDate}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={
                  pickerMode === "end"
                    ? new Date(
                        new Date(startDate).setDate(startDate.getDate() + 1)
                      )
                    : new Date()
                }
              />
            )}

            {Platform.OS === "ios" && showPicker && (
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
}
