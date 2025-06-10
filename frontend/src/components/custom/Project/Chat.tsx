import { MessageCircleDashed, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSocket } from "@/hooks/useSokect";

interface ChatMessage {
  _id: string;
  projectId: string;
  message: string;
  timestamp: string;
  sender: {
    _id: string;
    name: string;
    profilePic?: string;
  };
}

interface User {
  id: string;
  name: string;
  profilePic?: string;
}

interface Props {
  user: User;
  id: string;
  title: string;
}

const Chat = ({ user, id, title }: Props) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl);

  const [showChat, setShowChat] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const socket = useSocket();

  const getMessage = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/chat/${id}`, {
        withCredentials: true,
      });
      setMessages(response.data.messages);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error(error);
      toast.error("Error in fetching messages");
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.post(
        `${apiUrl}/api/chat/${id}`,
        { message },
        { withCredentials: true }
      );
      setMessage("");
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error(error);
      toast.error("Error in sending message");
    }
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  useEffect(() => {
    getMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (showChat) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    if (showChat) {
      // Wait for modal and messages to render
      setTimeout(() => {
        scrollToBottom();
      }, 200); // 100ms delay works well
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showChat]);

  useEffect(() => {
    if (!socket) return;

    function handleNewMessage({ populated }: { populated: ChatMessage }) {
      setMessages((prev) => {
        console.log({ prev });
        return [...prev, populated];
      });
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  return (
    <div>
      {/* Chat Toggle Button - Floating */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed right-6 bottom-6 bg-blue-600 hover:bg-blue-700 text-white p-4 z-50 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Open chat"
        >
          <MessageCircleDashed size={24} />
        </button>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h2 className="text-slate-800 font-semibold text-lg truncate">
                  {title}
                </h2>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
                aria-label="Close chat"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Chat Messages Container */}
            <div
              className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/50"
              style={{ maxHeight: "calc(85vh - 140px)" }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <MessageCircleDashed size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((chat, index) => {
                  const isCurrentUser = chat.sender._id === user?.id;
                  const showDate =
                    index === 0 ||
                    formatDate(chat.timestamp) !==
                      formatDate(messages[index - 1].timestamp);

                  return (
                    <div key={chat._id || index}>
                      {/* Date Separator */}
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="bg-white px-3 py-1 rounded-full text-xs text-slate-500 border border-slate-200 shadow-sm">
                            {formatDate(chat.timestamp)}
                          </span>
                        </div>
                      )}

                      {/* Message */}
                      <div
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isCurrentUser ? "order-2" : "order-1"
                          }`}
                        >
                          {/* Sender name for non-current users */}
                          {!isCurrentUser && (
                            <p className="text-xs text-slate-500 mb-1 ml-3 font-medium">
                              {chat.sender.name}
                            </p>
                          )}

                          {/* Message bubble */}
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              isCurrentUser
                                ? "bg-[#93deff] text-[#323643] rounded-br-md"
                                : "bg-white text-[#323643] border border-slate-200 rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">
                              {chat.message}
                            </p>
                          </div>

                          {/* Timestamp */}
                          <p
                            className={`text-xs text-slate-400 mt-1 ${
                              isCurrentUser ? "text-right mr-3" : "ml-3"
                            }`}
                          >
                            {formatTime(chat.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    value={message}
                    type="text"
                    placeholder="Type your message..."
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm"
                    maxLength={1000}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-sm hover:shadow-md"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>

              {/* Character count */}
              <div className="flex justify-between items-center mt-2 px-1">
                <div className="text-xs text-slate-400">
                  Press Enter to send, Shift+Enter for new line
                </div>
                <div className="text-xs text-slate-400">
                  {message.length}/1000
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
