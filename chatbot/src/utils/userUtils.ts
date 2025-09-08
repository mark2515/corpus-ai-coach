import Cookies from "js-cookie";
import { User } from "@/types";

export const getCurrentUserId = (): string | null => {
  const storedGoogleUser = Cookies.get("googleUser");
  if (storedGoogleUser) {
    try {
      const parsedUser: User = JSON.parse(storedGoogleUser);
      if (parsedUser && parsedUser._id && parsedUser.email && !parsedUser.isGuest) {
        return parsedUser._id;
      }
    } catch (error) {
      console.error("Failed to parse Google user cookie:", error);
      Cookies.remove("googleUser");
    }
  }

  const storedGuestUser = Cookies.get("guestUser");
  if (storedGuestUser) {
    try {
      const parsedUser: User = JSON.parse(storedGuestUser);
      if (parsedUser && parsedUser.isGuest) {
        return 'guest';
      }
    } catch (error) {
      console.error("Failed to parse guest user cookie:", error);
      Cookies.remove("guestUser");
    }
  }

  return null;
};

export const getCurrentUser = (): User | null => {
  const storedGoogleUser = Cookies.get("googleUser");
  if (storedGoogleUser) {
    try {
      const parsedUser: User = JSON.parse(storedGoogleUser);
      if (parsedUser && parsedUser._id && parsedUser.email) {
        return parsedUser;
      }
    } catch (error) {
      console.error("Failed to parse Google user cookie:", error);
      Cookies.remove("googleUser");
    }
  }

  const storedGuestUser = Cookies.get("guestUser");
  if (storedGuestUser) {
    try {
      const parsedUser: User = JSON.parse(storedGuestUser);
      if (parsedUser) {
        return parsedUser;
      }
    } catch (error) {
      console.error("Failed to parse guest user cookie:", error);
      Cookies.remove("guestUser");
    }
  }

  return null;
};
