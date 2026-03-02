import { paymentRoom } from "@/apis/payment.api";
import DateSelectionModal from "@/components/item/CalendarModal";
import GuestSelectionModal from "@/components/item/GuestSelectionModal";
import PaymentSuccessModal from "@/components/item/PaymentSuccessModal";
import PriceLine from "@/components/item/PriceLine";
import StarRating from "@/components/item/StarRating";
import { useReviews } from "@/hooks/useReviews";
import { useRoomById } from "@/hooks/useRooms";
import { useUser } from "@/hooks/useUser";
import { BookingRequest } from "@/interface/booking";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
import { differenceInCalendarDays, format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const RadioOption = ({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row justify-between items-center py-4 border-b border-gray-100"
  >
    <View className="flex-1 mr-4">
      <Text className="text-base font-bold text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
    </View>
    <View
      className={`w-6 h-6 rounded-full border-2 ${
        selected ? "border-blue-600" : "border-gray-300"
      } items-center justify-center`}
    >
      {selected && <View className="w-3 h-3 rounded-full bg-blue-600" />}
    </View>
  </TouchableOpacity>
);

// --- Màn hình chính ---
const ConfirmAndPayScreen = () => {
  const router = useRouter();
  const { roomId, hotelId } = useLocalSearchParams();
  const [paymentOption, setPaymentOption] = useState("full"); // 'full' hoặc 'partial'
  const { user, loading } = useUser();
  const [rangeDate, setRangDate] = useState<any>({});
  const [people, setPeople] = useState<any>({});
  const [price, setPrice] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const { data: room, isLoading } = useRoomById(+roomId);

  const { data: reviews } = useReviews(+hotelId, +roomId);

  const { mutate: bookingMutation, isPending } = useMutation({
    mutationFn: paymentRoom,
    mutationKey: ["bookingMutation"],
    onSuccess: () => {
      setSuccessModalVisible(true);
    },
    onError: (error: any) => {
      console.log(error);
      Alert.alert("Thất bại!", "Thanh toán thất bại!");
    },
  });

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        reviews.length
      : 0;

  const days = differenceInCalendarDays(
    rangeDate.checkOutDate,
    rangeDate.checkInDate
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#504DE4" />
        <Text className="mt-2 text-gray-600">Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  const fetchData = async () => {
    try {
      const [rangeDateData, peopleData, totalPrice] = await Promise.all([
        AsyncStorage.getItem("rangeDate"),
        AsyncStorage.getItem("people"),
        AsyncStorage.getItem("totalPrice"),
      ]);

      if (rangeDateData) {
        const parsed = JSON.parse(rangeDateData);
        setRangDate({
          checkInDate: new Date(parsed.checkInDate),
          checkOutDate: new Date(parsed.checkOutDate),
        });
      }

      if (peopleData) {
        const parsed = JSON.parse(peopleData);
        setPeople(parsed);
      }

      if (totalPrice) {
        setPrice(JSON.parse(totalPrice));
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBackToHome = async () => {
    setSuccessModalVisible(false);
    router.push("/home");
    await AsyncStorage.multiRemove(["rangeDate", "people", "totalPrice"]);
  };

  const handleBooking = async () => {
    const newBooking: BookingRequest = {
      roomId: +roomId,
      hotelId: +hotelId,
      userId: user?.id || 0,
      checkInDate: format(new Date(rangeDate.checkInDate), "yyyy-MM-dd"),
      checkOutDate: format(new Date(rangeDate.checkOutDate), "yyyy-MM-dd"),
      adults: people.adults,
      children: people.children,
      infants: people.infants,
      paymentOption,
      paymentMethodId: 2,
    };

    bookingMutation(newBooking);
  };

  const handleBack = async () => {
    router.back();
    await AsyncStorage.multiRemove(["rangeDate", "people", "totalPrice"]);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* --- 1. Header --- */}
      <View className="flex-row items-center p-5 border-b border-gray-100">
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-gray-900">
          Xác nhận và thanh toán
        </Text>
        <View className="w-6" />
        {/* Spacer để căn giữa tiêu đề */}
      </View>

      {/* --- 2. Nội dung cuộn --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
      >
        {/* Thẻ Tóm tắt Phòng */}
        <View className="flex-row items-center mt-6">
          <Image
            source={{ uri: room.images[0]?.imageURL }}
            className="w-24 h-24 rounded-lg"
          />
          <View className="ml-4 flex-1">
            <View className="flex-row items-center">
              <StarRating rating={averageRating} size={20} />
              <Text className="ml-2 text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews?.length || 0} lượt đánh
                giá)
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mt-1">
              {room.title}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              <Ionicons name="location-sharp" size={14} /> {room.hotelName}
            </Text>
            <Text className="text-sm font-medium text-gray-700 mt-1">
              {people?.adults ?? 1} người lớn | {people?.children ?? 0} trẻ em |{" "}
              {people?.infants ?? 0} trẻ sơ sinh
            </Text>
          </View>
        </View>

        {/* --- Chi tiết Đặt phòng --- */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900">
            Your Booking Details
          </Text>
          {/* Hàng Ngày */}
          <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-lg mt-4">
            <View>
              <Text className="text-sm font-medium text-gray-500">Dates</Text>
              <Text className="text-base font-bold text-gray-900 mt-1">
                {rangeDate?.checkInDate && rangeDate?.checkOutDate
                  ? `${format(new Date(rangeDate.checkInDate), "dd/MM/yyyy")} - ${format(new Date(rangeDate.checkOutDate), "dd/MM/yyyy")}`
                  : "Chưa chọn ngày"}
              </Text>
            </View>
            <TouchableOpacity
              className="p-2 bg-white rounded-full border border-gray-200 shadow-sm"
              onPress={() => setModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color="#4B5563"
              />
            </TouchableOpacity>
          </View>
          {/* Hàng Khách */}
          <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-lg mt-3">
            <View>
              <Text className="text-sm font-medium text-gray-500">Guests</Text>
              <Text className="text-base font-bold text-gray-900 mt-1">
                {people?.adults ?? 1} người lớn | {people?.children ?? 0} trẻ em
                | {people?.infants ?? 0} trẻ sơ sinh
              </Text>
            </View>
            <TouchableOpacity
              className="p-2 bg-white rounded-full border border-gray-200 shadow-sm"
              onPress={() => setGuestModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color="#4B5563"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Chọn cách thanh toán --- */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900">
            Choose how to pay
          </Text>
          <RadioOption
            title="Pay in full"
            subtitle="Pay the total now and you're all set."
            selected={paymentOption === "full"}
            onPress={() => setPaymentOption("full")}
          />
          <RadioOption
            title="Pay pat now, part later"
            subtitle="Pay part now and you're all set."
            selected={paymentOption === "partial"}
            onPress={() => setPaymentOption("partial")}
          />
        </View>

        {/* --- Thanh toán với --- */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900">
            Chọn phương thức thanh toán
          </Text>
          <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-lg mt-4">
            <View className="flex-row items-center gap-3 space-x-3">
              <FontAwesome name="cc-visa" size={24} color="#1A1F71" />
              <FontAwesome name="cc-mastercard" size={24} color="#EB001B" />
              <FontAwesome name="cc-paypal" size={24} color="#003087" />
              <AntDesign name="google" size={24} color="#4285F4" />
            </View>
            <TouchableOpacity className="px-5 py-2 rounded-lg border border-blue-600">
              <Text className="text-base font-bold text-blue-600">Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Chi tiết Giá --- */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900">Tổng tiền</Text>
          <View className="mt-2">
            <PriceLine
              label={`${price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })} * ${days} ngày`}
              amount={`${(price * days).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}`}
            />
            <PriceLine
              label="Tổng cộng"
              amount={`${(price * days).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}`}
              isTotal={true}
            />
          </View>
        </View>
      </ScrollView>

      {/* --- 3. Footer (Nút Pay Now) --- */}
      <View className="px-5 py-4 border-t border-gray-200 bg-white absolute bottom-0 left-0 right-0">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-lg"
          onPress={handleBooking}
        >
          <Text className="text-white text-lg font-bold text-center">
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
      

      <PaymentSuccessModal
        isVisible={isSuccessModalVisible}
        onClose={handleBackToHome}
      />

      <DateSelectionModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        roomId={+roomId}
        onConfirm={(startDate, endDate) => {
          setRangDate({
            checkInDate: new Date(startDate),
            checkOutDate: new Date(endDate),
          });
          setModalVisible(false);
        }}
        isFromPayment={true}
      />

      <GuestSelectionModal
        isVisible={isGuestModalVisible}
        onClose={() => setGuestModalVisible(false)}
        onNext={(data: any) => {
          setPeople(data);
          setGuestModalVisible(false);
        }}
        isFromPayment={true}
      />
    </SafeAreaView>
  );
};

export default ConfirmAndPayScreen;
