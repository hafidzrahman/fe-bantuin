"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TbSend, TbClock, TbCheck } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const ChatWindow = () => {
  const { messages, sendMessage, activeConversation } = useChat();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messageTemplates = [
    "Assalamualaikum 🙏",
    "Waalaikumsalam 😊",
    "Halo kak 👋",
    "Terima kasih 🙏",
    "Sama-sama 😊",
    "Apakah jasanya ready? 🤔",
    "Oke siap 👍",
    "Mantap kak 👏",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleTemplateClick = (text: string) => {
    setInput(text);
    if (textareaRef.current) {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = `${Math.min(
            textareaRef.current.scrollHeight,
            120
          )}px`;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(input);
    setIsSending(false);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherParticipant = activeConversation?.participants?.find(
    (p) => p.user.id !== user?.id
  )?.user;

  if (!otherParticipant)
    return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 h-0 overflow-hidden bg-gray-50/50">
        <ScrollArea className="h-full px-3 py-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs text-center px-4 min-h-[300px]">
              <Avatar className="h-16 w-16 mb-3 opacity-50">
                <AvatarImage src={otherParticipant.profilePicture || ""} />
                <AvatarFallback className="text-2xl">
                  {otherParticipant.fullName[0]}
                </AvatarFallback>
              </Avatar>
              <p>
                Mulai percakapan dengan <br />{" "}
                <span className="font-semibold">
                  {otherParticipant.fullName}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-2 pb-2">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                const isOptimistic = msg.id.startsWith("temp-");

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex gap-2 w-full ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <Avatar className="h-8 w-8 mt-1 shrink-0">
                        <AvatarImage src={msg.sender.profilePicture || ""} />
                        <AvatarFallback className="text-xs">
                          {msg.sender.fullName[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`relative max-w-[75%] px-4 py-2 text-sm rounded-2xl transition-all duration-200 flex flex-wrap gap-x-2 gap-y-0 items-end ${
                        isMe
                          ? "bg-linear-to-br from-primary to-secondary text-primary-foreground rounded-br-md shadow-md hover:shadow-lg border border-transparent"
                          : "bg-white border border-gray-200 text-foreground rounded-bl-md shadow-sm hover:shadow-md"
                      } ${
                        isOptimistic
                          ? "opacity-60 scale-95"
                          : "opacity-100 scale-100"
                      }`}
                    >
                      <p className="wrap-break-word whitespace-pre-wrap break-all leading-relaxed mb-0.5">
                        {msg.content}
                      </p>

                      <div
                        className={`flex items-center gap-0.5 ml-auto shrink-0 h-fit ${
                          isMe
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="text-[9px] leading-none select-none">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        {isMe && (
                          <span
                            className="ml-0.5"
                            title={isOptimistic ? "Mengirim..." : "Terkirim"}
                          >
                            {isOptimistic ? (
                              <TbClock className="h-2.5 w-2.5 animate-pulse" />
                            ) : (
                              <TbCheck className="h-2.5 w-2.5" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Quick Reply Templates */}
      <div className="px-3 pt-2 bg-white border-t border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-linear-fade">
          {messageTemplates.map((text, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-white active:scale-95 transition-all whitespace-nowrap px-3 py-1.5 font-normal text-xs border-primary/20 text-primary/80 bg-primary/5"
              onClick={() => handleTemplateClick(text)}
            >
              {text}
            </Badge>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white flex items-end gap-2 shrink-0">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan..."
          className="flex-1 min-h-10 max-h-[120px] py-2 resize-none overflow-y-auto"
          disabled={isSending}
          rows={1}
        />
        <Button
          onClick={() => handleSend()}
          size="icon"
          disabled={!input.trim() || isSending}
          className="h-10 w-10 shrink-0 mb-px"
        >
          <TbSend className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
