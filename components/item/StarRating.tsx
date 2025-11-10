import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";

// --- Component con: Hiển thị 5 sao ---
export default function StarRating({ rating, size = 16 }: any) {
  const totalStars = 5;
  return (
    <View className="flex-row">
      {[...Array(totalStars)].map((_, index) => {
        const starIndex = index + 1;
        const filled = Math.min(Math.max(rating - index, 0), 1); 

        return (
          <View
            key={starIndex}
            style={{ position: "relative", marginRight: 2 }}
          >
            <FontAwesome name="star-o" size={size} color="#D1D5DB" />

            {filled > 0 && (
              <View
                style={{
                  position: "absolute",
                  overflow: "hidden",
                  width: `${filled * 100}%`, 
                }}
              >
                <FontAwesome name="star" size={size} color="#F59E0B" />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};