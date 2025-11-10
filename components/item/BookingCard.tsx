import { useReviews } from "@/hooks/useReviews";
import { BookingResponse, Status } from "@/interface/booking";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Image, Text, TouchableOpacity, View } from "react-native";
import StarRating from "./StarRating";

// --- Component con: Thẻ Đặt phòng ---
export default function BookingCard({ booking }: { booking: BookingResponse }) {
  const { data: reviews } = useReviews(booking.hotelId, booking.roomId);

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        reviews.length
      : 0;

  return (
    <View className="bg-white rounded-2xl border border-gray-100 shadow-md p-4 mb-5">
      {/* Hàng 1: ID và Ngày */}
      <Text className="text-lg font-bold text-gray-900">
        Booking ID: {booking.bookingId}
      </Text>
      <Text className="text-sm text-gray-500 mb-4">
       Ngày đặt phòng: {format(new Date(booking.checkInDate), "dd/MM/yyyy")} - {format(new Date(booking.checkOutDate), "dd/MM/yyyy")}
      </Text>

      {/* Hàng 2: Chi tiết (Ảnh + Thông tin) */}
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: booking.imageURL }}
          className="w-20 h-20 rounded-lg"
        />
        <View className="ml-4 flex-1">
          {/* Rating */}
          <View className="flex-row items-center">
            <StarRating rating={averageRating} size={20} />
            <Text className="ml-2 text-sm text-gray-600">
              {averageRating.toFixed(1)} ({reviews?.length || 0} Reviews)
            </Text>
          </View>
          {/* Tên & Vị trí */}
          <Text className="text-lg font-bold text-gray-900 mt-1">
            {booking.roomName}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-sharp" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">
              {booking.hotelName}
            </Text>
          </View>
        </View>
      </View>

      {/* Hàng 3: Nút bấm */}
      <View className="flex-row justify-between space-x-3">
        {/* Nút Cancel */}
        <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-lg items-center">
          <Text className="text-base font-bold text-gray-700">
            {booking.status === Status.PENDING
              ? "Hủy đặt phòng"
              : booking.status === Status.CONFIRMED
                ? "Đã đặt"
                : "Đã hủy"}
          </Text>
        </TouchableOpacity>
        {/* Nút View Details */}
        {booking.status === Status.PENDING ? (
          <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-lg items-center">
            <Text className="text-base font-bold text-white">Xem chi tiết</Text>
          </TouchableOpacity>
        ) : booking.status === Status.CONFIRMED ? (
          <TouchableOpacity className="flex-1 bg-blue-600 py-3 rounded-lg items-center">
            <Text className="text-base font-bold text-white">Đặt lại</Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
}
