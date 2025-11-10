import { Text, View } from "react-native";

export default function PriceLine({
  label,
  amount,
  isTotal = false,
}: {
  label: string;
  amount: string;
  isTotal?: boolean;
}) {
  return (
    <View
      className={`flex-row justify-between items-center ${
        isTotal ? "mt-4 pt-4 border-t border-gray-200" : "mt-3"
      }`}
    >
      <Text
        className={`text-base ${
          isTotal ? "font-bold text-gray-900" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
      <Text
        className={`text-base ${
          isTotal ? "font-bold text-gray-900" : "font-semibold text-gray-800"
        }`}
      >
        {amount}
      </Text>
    </View>
  );
}
