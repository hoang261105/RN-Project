import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentSuccessModal({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}){
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/50">
        <Pressable className="bg-white rounded-t-3xl shadow-lg">
          <SafeAreaView edges={["bottom"]} className="items-center px-6 pt-4 pb-8">
            {/* Grabber */}
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-5" />

            {/* Icon (2 vòng tròn lồng nhau) */}
            <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-lg">
                <Ionicons name="checkmark-sharp" size={40} color="white" />
              </View>
            </View>

            {/* Text */}
            <Text className="text-2xl font-bold text-gray-900 mt-6">
              Payment Received Successfully
            </Text>
            <Text className="text-base text-gray-600 mt-3">
              Congratulations 🎉
            </Text>
            <Text className="text-base text-gray-600 mt-1">
              Your booking has been confirmed
            </Text>

            {/* Nút Back to Home */}
            <TouchableOpacity
              className="bg-blue-600 py-4 rounded-lg mt-8 w-full"
              onPress={onClose}
            >
              <Text className="text-white text-lg font-bold text-center">
                Back to Home
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};