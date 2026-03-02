import React from 'react';
import {
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// (Giả sử bạn đã cài đặt @expo/vector-icons)
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Màn hình chính ---
const PrivacyAndPolicyScreen = () => {
  const router = useRouter();  
  const loremIpsum =
    "Có rất nhiều phiên bản khác nhau của Lorem Ipsum, nhưng phần lớn đã bị biến đổi ở một số dạng, bằng cách thêm thắt yếu tố hài hước, hoặc các từ ngữ ngẫu nhiên trông chẳng hề đáng tin chút nào. Nếu bạn định sử dụng một đoạn Lorem Ipsum, bạn cần đảm bảo không có bất kỳ chi tiết nhạy cảm nào được ẩn giấu ở giữa văn bản. Tất cả các công cụ tạo Lorem Ipsum trên Internet đều có xu hướng lặp lại các đoạn văn bản được định sẵn khi cần thiết, khiến đây trở thành công cụ tạo Lorem Ipsum thực sự đầu tiên trên Internet. Công cụ này sử dụng một từ điển gồm hơn 200 từ tiếng Latinh, kết hợp với một số ít cấu trúc câu mẫu, để tạo ra Lorem Ipsum trông có vẻ hợp lý. Do đó, Lorem Ipsum được tạo ra luôn không có sự lặp lại, không có yếu tố hài hước, hoặc các từ ngữ không phù hợp, v.v.";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* 1. Header */}
      <View className="flex-row items-center p-5 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-gray-900 -ml-6">
          Chính sách bảo vệ
        </Text>
      </View>

      {/* 2. Nội dung cuộn */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
      >
        {/* Ngày cập nhật */}
        <Text className="text-sm text-gray-500 mb-4">
          Ngày cập nhật: 11/11/2025
        </Text>

        {/* Đoạn 1 */}
        <Text className="text-base text-gray-700 leading-6 mb-6">
          Vui lòng đọc kỹ chính sách bảo mật này trước khi sử dụng ứng dụng do chúng tôi vận hành.
        </Text>

        {/* Tiêu đề 2 */}
        <Text className="text-lg font-bold text-blue-600 mb-3">
          Điều kiện sử dụng
        </Text>

        {/* Đoạn 2 (Lorem Ipsum) */}
        <Text className="text-base text-gray-700 leading-6">
          {loremIpsum}
        </Text>
        
        {/* (Bạn có thể thêm các đoạn text và tiêu đề khác ở đây) */}

      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyAndPolicyScreen;