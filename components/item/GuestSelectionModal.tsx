import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GuestCounterRow = ({ title, subtitle, count, onDecrement, onIncrement, decrementDisabled = false }: any) => {
  return (
    <View className="flex-row justify-between items-center py-4 border-b border-gray-100">
      <View>
        <Text className="text-lg font-medium text-gray-900">{title}</Text>
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onDecrement}
          disabled={decrementDisabled}
          className={`w-8 h-8 rounded-full items-center justify-center border ${decrementDisabled ? 'border-gray-200' : 'border-gray-400'}`}
        >
          <Text className={`text-xl ${decrementDisabled ? 'text-gray-200' : 'text-gray-600'}`}>−</Text>
        </TouchableOpacity>
        
        <Text className="text-base font-medium text-gray-900 w-10 text-center">{count}</Text>
        
        <TouchableOpacity
          onPress={onIncrement}
          className="w-8 h-8 rounded-full items-center justify-center bg-blue-600"
        >
          <Text className="text-xl text-white">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function GuestSelectionModal({ isVisible, onClose, onNext, isFromPayment = false}: any) {
  const [adults, setAdults] = useState(0); 
  const [children, setChildren] = useState(0); 
  const [infants, setInfants] = useState(0);


  useEffect(() => {
    const fetchRangeDate = async () => {
      if (!isFromPayment) return; // chỉ load nếu đến từ Payment
      try {
        const stored = await AsyncStorage.getItem("people");
        if (stored) {
          const parsed = JSON.parse(stored);
          setAdults(parsed.adults);
          setChildren(parsed.children)
          setInfants(parsed.infants)
        }
      } catch (error) {
        console.error("Lỗi khi lấy rangeDate:", error);
      }
    };

    if (isVisible) fetchRangeDate(); 
  }, [isVisible, isFromPayment]);

  const handleNext = async () => {
    onNext({ adults, children, infants });
    await AsyncStorage.setItem("people", JSON.stringify({
      adults: adults,
      children: children,
      infants: infants
    }))
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
            {/* Grabber */}
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
            
            <View className="px-6">
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Select Guest
              </Text>
              
              {/* Hàng Người lớn */}
              <GuestCounterRow
                title="Adults"
                subtitle="Ages 14 or above"
                count={adults}
                onDecrement={() => setAdults(Math.max(1, adults - 1))} // Người lớn ít nhất là 1
                onIncrement={() => setAdults(adults + 1)}
                decrementDisabled={adults === 1}
              />
              
              {/* Hàng Trẻ em */}
              <GuestCounterRow
                title="Children"
                subtitle="Ages 2-13"
                count={children}
                onDecrement={() => setChildren(Math.max(0, children - 1))}
                onIncrement={() => setChildren(children + 1)}
                decrementDisabled={children === 0}
              />
              
              {/* Hàng Em bé */}
              <GuestCounterRow
                title="Infants"
                subtitle="Under 2"
                count={infants}
                onDecrement={() => setInfants(Math.max(0, infants - 1))}
                onIncrement={() => setInfants(infants + 1)}
                decrementDisabled={infants === 0}
              />

              {/* Nút Next */}
              <TouchableOpacity
                className="bg-blue-600 py-4 rounded-lg mt-6 mb-4"
                onPress={handleNext}
              >
                <Text className="text-white text-base font-bold text-center">
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
