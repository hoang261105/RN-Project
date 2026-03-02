import React from "react";
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// (Giả sử bạn đã cài đặt @expo/vector-icons)
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Màn hình chính ---
const TermsAndConditionsScreen = () => {
  const router = useRouter();
  const loremIpsum =
    "Một thực tế đã được chứng minh từ lâu là người đọc sẽ bị phân tâm bởi nội dung dễ đọc của một trang khi nhìn vào bố cục của nó. Mục đích của việc sử dụng Lorem Ipsum là nó có sự phân bổ các chữ cái gần như bình thường, trái ngược với việc sử dụng kiểu (Nội dung ở đây, nội dung ở đây), khiến nó trông giống như tiếng Anh dễ đọc. Nhiều phần mềm xuất bản trên máy tính để bàn và trình soạn thảo trang web hiện nay sử dụng Lorem Ipsum làm văn bản mẫu mặc định, và khi tìm kiếm lorem ipsum, bạn sẽ thấy rất nhiều trang web vẫn còn trong giai đoạn sơ khai. Nhiều phiên bản khác nhau đã phát triển qua nhiều năm, đôi khi vô tình, đôi khi cố ý (thêm thắt sự hài hước, v.v.).";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* 1. Header */}
      <View className="flex-row items-center p-5 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-gray-900 -ml-6">
          Điều khoản và dịch vụ
        </Text>
      </View>

      {/* 2. Nội dung cuộn */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
      >
        {/* Ngày cập nhật */}
        <Text className="text-sm text-gray-500 mb-4">
          Ngày cập nhật mới nhất: 11/11/2025
        </Text>

        {/* Đoạn 1 */}
        <Text className="text-base text-gray-700 leading-6 mb-6">
          Vui lòng đọc kỹ các điều khoản dịch vụ này trước khi sử dụng ứng dụng
          do chúng tôi vận hành.
        </Text>

        {/* Tiêu đề 2 */}
        <Text className="text-lg font-bold text-blue-600 mb-3">
          Điều kiện sử dụng
        </Text>

        {/* Đoạn 2 (Lorem Ipsum) */}
        <Text className="text-base text-gray-700 leading-6">{loremIpsum}</Text>

        {/* (Bạn có thể thêm các đoạn text và tiêu đề khác ở đây) */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;
