import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useConversation = (otherUserName: string) => {
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  
  // Get the other user's ID based on their username
  const user = useQuery(api.users.getUserByUserName, { userName: otherUserName });
  
  useEffect(() => {
    if (user) {
      setOtherUserId(user._id);
    }
  }, [user]);

  // Get or create conversation with the other user
  const conversation = useQuery(api.messages.getOrCreateConversation, 
    otherUserId ? { otherUserId } : "skip"
  );

  return {
    otherUser: user,
    conversation,
    isLoading: !user || !conversation
  };
};
