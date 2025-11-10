import { getUserById } from "@/apis/auth.api";
import { UserDetail } from "@/interface/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading };
};

export const useCurrentUser = () => {
  return useQuery<UserDetail>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) throw new Error("No user in storage");
      const id = JSON.parse(userData).id;
      const response = await getUserById(id);
      return response.data;
    },
  });
};
