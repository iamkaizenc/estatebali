"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthSafe } from "@/contexts/AuthContext";
import { ProtectedUserRoute } from "@/components/ProtectedUserRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Inbox, Send, Image as ImageIcon, ArrowLeft, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface Conversation {
  id: string;
  property_id: string | null;
  buyer_id: string;
  seller_id: string;
  last_message: string | null;
  last_message_at: string | null;
  buyer_unread_count: number;
  seller_unread_count: number;
  status: string;
  created_at: string;
  property?: {
    id: string;
    title: string;
    images: string[];
    price: number;
    listing_type: string;
  };
  buyer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  seller?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

function MessagesPage() {
  const { user } = useAuthSafe();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversation_id=${conversationId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    try {
      const receiverId = selectedConversation.buyer_id === user.id
        ? selectedConversation.seller_id
        : selectedConversation.buyer_id;

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: selectedConversation.id,
          content: newMessage,
          receiver_id: receiverId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage("");
        scrollToBottom();
        fetchConversations(); // Refresh conversation list
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      // Poll for new messages in active conversation
      const interval = setInterval(() => {
        fetchMessages(selectedConversation.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const otherUser = conv.buyer_id === user?.id ? conv.buyer : conv.seller;
    return (
      otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.property?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getOtherUser = (conversation: Conversation) => {
    return conversation.buyer_id === user?.id ? conversation.seller : conversation.buyer;
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.buyer_id === user?.id
      ? conversation.buyer_unread_count
      : conversation.seller_unread_count;
  };

  if (loading) {
    return (
      <ProtectedUserRoute>
        <div className="min-h-screen bg-black">
          <Header />
          <main className="container mx-auto px-4 pt-24 pb-20">
            <div className="text-center py-20">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading messages...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedUserRoute>
    );
  }

  return (
    <ProtectedUserRoute>
      <div className="min-h-screen bg-black">
        <Header />

        <main className="container mx-auto px-4 pt-24 pb-20">
          <div className="mb-8 lg:hidden">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-primary" />
              Messages
            </h1>
            <p className="text-gray-400">Your conversations with agents and property owners</p>
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-20 card">
              <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Messages Yet</h2>
              <p className="text-gray-400 mb-6">
                Start a conversation by contacting property owners through their listings.
              </p>
              <Link href="/properties" className="btn-primary">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              {/* Conversations List */}
              <div className={`card p-0 overflow-hidden flex flex-col ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-4 border-b border-dark-300">
                  <h2 className="text-xl font-bold mb-4 hidden lg:block">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.map((conversation) => {
                    const otherUser = getOtherUser(conversation);
                    const unreadCount = getUnreadCount(conversation);

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`w-full p-4 border-b border-dark-300 hover:bg-dark-200 transition-colors text-left ${
                          selectedConversation?.id === conversation.id ? 'bg-dark-200' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="relative flex-shrink-0">
                            {otherUser?.avatar ? (
                              <Image
                                src={otherUser.avatar}
                                alt={otherUser.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <span className="text-primary font-bold">
                                  {otherUser?.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            {unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 bg-primary text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold truncate">{otherUser?.name}</h3>
                              {conversation.last_message_at && (
                                <span className="text-xs text-gray-400 ml-2">
                                  {formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                            {conversation.property && (
                              <p className="text-xs text-gray-400 truncate mb-1">{conversation.property.title}</p>
                            )}
                            <p className="text-sm text-gray-400 truncate">{conversation.last_message || "No messages yet"}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Messages Panel */}
              <div className={`lg:col-span-2 card p-0 overflow-hidden flex flex-col ${!selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-dark-300 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="lg:hidden p-2 hover:bg-dark-200 rounded-lg"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>

                      <div className="flex gap-3 flex-1">
                        {getOtherUser(selectedConversation)?.avatar ? (
                          <Image
                            src={getOtherUser(selectedConversation)!.avatar!}
                            alt={getOtherUser(selectedConversation)!.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold">
                              {getOtherUser(selectedConversation)?.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-semibold">{getOtherUser(selectedConversation)?.name}</h3>
                          {selectedConversation.property && (
                            <Link
                              href={`/properties/${selectedConversation.property.id}`}
                              className="text-xs text-primary hover:underline"
                            >
                              {selectedConversation.property.title}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => {
                        const isSender = message.sender_id === user?.id;

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isSender ? 'order-2' : 'order-1'}`}>
                              {!isSender && message.sender && (
                                <p className="text-xs text-gray-400 mb-1 ml-1">{message.sender.name}</p>
                              )}
                              <div
                                className={`p-3 rounded-lg ${
                                  isSender
                                    ? 'bg-primary text-black'
                                    : 'bg-dark-200 text-white'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 ml-1">
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-dark-300">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 bg-dark-200 rounded-lg border border-dark-300 focus:border-primary focus:outline-none"
                          disabled={sending}
                        />
                        <button
                          type="submit"
                          disabled={sending || !newMessage.trim()}
                          className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedUserRoute>
  );
}

export default function MessagesPageWrapper() {
  return (
    <ProtectedUserRoute>
      <MessagesPage />
    </ProtectedUserRoute>
  );
}
