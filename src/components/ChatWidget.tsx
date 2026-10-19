"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  ShoppingBag,
  Truck,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { IMessage, IProduct } from "@/types/chat";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const { data: session } = useSession();
  const currentUser = session?.user;

  // 🚀 Guest User-এর জন্য Unique Session ID তৈরি
  const [guestId, setGuestId] = useState<string>("");

  useEffect(() => {
    let existingGuestId = localStorage.getItem("venraz_chat_guest_id");
    if (!existingGuestId) {
      existingGuestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem("venraz_chat_guest_id", existingGuestId);
    }
    setGuestId(existingGuestId);
  }, []);

  const activeUserId = currentUser?.id || guestId;

  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: "1",
      sender: "bot",
      reply:
        "হ্যালো! 👋 আমি VenRaz AI Assistant। আপনাকে কীভাবে সাহায্য করতে পারি?",
      type: "TEXT",
      createdAt: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isLoading]);

  // 🚀 ১. চ্যাট হিস্ট্রি ফেচ
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!isOpen || !activeUserId) return;

      try {
        setIsHistoryLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const response = await fetch(`${baseUrl}/chat/history/${activeUserId}`);
        const resData = await response.json();

        if (
          resData.success &&
          Array.isArray(resData.data) &&
          resData.data.length > 0
        ) {
          const formattedMessages: IMessage[] = resData.data.map(
            (item: any) => ({
              id: item._id || item.id || Date.now().toString(),
              sender: item.sender,
              reply: item.message || item.reply,
              type: item.type || "TEXT",
              data: item.data || null,
              createdAt: new Date(item.createdAt),
            }),
          );
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchChatHistory();
  }, [isOpen, activeUserId]);

  // 🚀 ২. মেসেজ সেন্ড
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: IMessage = {
      id: Date.now().toString(),
      sender: "user",
      reply: textToSend,
      type: "TEXT",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setIsLoading(true);
    const formattedHistory = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.reply,
    }));

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const response = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: formattedHistory,
          userId: currentUser?.id,
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        const botMsg: IMessage = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          reply: resData.data.reply,
          type: resData.data.type,
          data: resData.data.data,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          reply: "দুঃখিত, নেটওয়ার্ক সমস্যা হচ্ছে। একটু পর আবার চেষ্টা করুন।",
          type: "TEXT",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans ">
      {/* 🎯 ৩ টি থ্রি-ডি ট্রিপল মোশন অ্যানিমেশন সমৃদ্ধ বাটন */}
      {!isOpen && (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          {/* বাবল: হালকা বাউন্স মোশন */}
          <div className="relative animate-bounce duration-1000 bg-white text-gray-800 text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-1.5 transition-transform group-hover:scale-105">
            <span>Chat With Us</span>
            <span className="text-base">👋</span>
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-white"></div>
          </div>

          {/* চ্যাট বাটন উইথ ৩টি অ্যানিমেশন মোশন */}
          <div className="relative flex items-center justify-center">
            {/* Motion 1: Soft Continuous Glowing Breathing Effect */}
            <div className="absolute -inset-3 bg-sky-400/30 rounded-full blur-md animate-pulse"></div>

            {/* Motion 2: Expanding Wave Ripple Ping Motion */}
            <div className="absolute -inset-2 bg-blue-500/40 rounded-full animate-ping opacity-75"></div>

            {/* Motion 3: Subtle Rotating Glow Background */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 rounded-full animate-spin opacity-50 blur-[2px]"></div>

            {/* মেইন বাটন */}
            <button
              aria-label="Open Chat"
              className="relative bg-gradient-to-tr from-blue-600 to-sky-400 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center z-10"
            >
              <MessageSquare className="w-6 h-6 fill-white stroke-none" />

              {/* নোটিফিকেশন ব্যাজ */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                1
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 🎯 চ্যাট উইন্ডো */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-4xl shadow-2xl shadow-mist-600  border-gray-100 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* চ্যাট হেডার */}
          <div className="bg-[#7e22ce] p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#261149] rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  VenRaz AI Assistant
                </h3>
                <span className="text-xs text-indigo-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>{" "}
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-indigo-100 hover:text-white p-1 rounded-lg hover:bg-indigo-500/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* মেসেজ লিস্ট */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {isHistoryLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#ff594d]" />
                <span className="text-xs">পুরনো চ্যাট লোড করা হচ্ছে...</span>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-[#6301c6] flex items-center justify-center text-xs mt-1 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[80%] space-y-2`}>
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#6301c6] text-white rounded-tr-none"
                          : "bg-[#303030] text-[#fdf1ff] border border-gray-100 shadow-sm rounded-tl-none"
                      }`}
                    >
                      {msg.reply}
                    </div>

                    {msg.type === "PRODUCT_LIST" && Array.isArray(msg.data) && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {(msg.data as IProduct[]).map((product) => (
                          <div
                            key={product._id}
                            className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                          >
                            <Link href={`/products/${product._id}`}>
                              <Image
                                src={product.images?.[0] || "/placeholder.svg"}
                                alt={product.name || "Product Image"}
                                width={600}
                                height={600}
                                className="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                              />
                              <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                                {product.name}
                              </h4>
                              <p className="text-xs font-bold text-indigo-600 mt-1">
                                ৳{product.price}
                              </p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.type === "ORDER_STATUS" && msg.data && (
                      <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center gap-3">
                        <Truck className="w-8 h-8 text-indigo-600 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">অর্ডার নম্বর:</p>
                          <p className="text-sm font-bold text-gray-800">
                            #{(msg.data as any).orderId}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-200 text-indigo-800 rounded-full">
                            {(msg.data as any).status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs mt-1 shrink-0">
                      {currentUser?.image ? (
                        <Image
                          src={currentUser.image}
                          alt={currentUser.name || "Product Image"}
                          width={600}
                          height={600}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-2 items-center text-gray-400 text-xs pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>AI ভাবছে...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSendMessage("টি শার্ট দেখাও")}
              className="text-xs whitespace-nowrap bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              <ShoppingBag className="w-3 h-3" /> টি-শার্ট
            </button>
            <button
              onClick={() => handleSendMessage("ডেলিভারি চার্জ কত?")}
              className="text-xs whitespace-nowrap bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 px-3 py-1.5 rounded-full transition-colors"
            >
              🚚 ডেলিভারি চার্জ?
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="কী খুঁজতে চান বলুন..."
              className="flex-1 bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white p-2.5 rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
