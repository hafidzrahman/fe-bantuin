"use client";

import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { TbX } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatWindow } from "./ChatWindow";

export const ChatFloatingWindow = () => {
  const { isAuthenticated, user } = useAuth();
  const { activeConversation, closeChatWindow } = useChat();

  if (!isAuthenticated || !activeConversation) return null;

  const otherParticipant = activeConversation.participants.find(
    (p) => p.user.id !== user?.id
  )?.user;

  const profilPartisipan = otherParticipant?.profilePicture;
  const namaPartisipan = otherParticipant?.fullName || "Percakapan";

  return (
    <div className="fixed bottom-10 left-6 z-50 flex flex-col items-start space-y-4 rounded-sm">
      <div className="w-[350px] md:w-[400px] h-[500px] bg-white shadow-2xl border border-primary/20 rounded-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
        {/* Header */}
        <div className="p-3 px-4 bg-white border-b text-secondary-foreground flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar */}
            <Avatar className="h-9 w-9 border-2 border-secondary-foreground/20 shrink-0">
              <AvatarImage src={profilPartisipan || ""} />
              <AvatarFallback>{namaPartisipan[0]}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-sm md:text-base line-clamp-1">
                {namaPartisipan}
              </h3>
            </div>
          </div>

          <button
            onClick={closeChatWindow}
            className="hover:bg-primary-foreground/20 p-1 rounded transition-colors shrink-0"
          >
            <TbX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-white relative">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};
