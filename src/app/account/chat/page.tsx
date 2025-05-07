// src/app/account/chat/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Search, ArrowLeft } from 'lucide-react';

// Mock data - replace with actual data fetching
const mockConversations = [
  { id: 'conv1', userName: 'Alice Smith (Toyota Camry)', lastMessage: 'Is the car available next weekend?', unreadCount: 2, avatarUrl: 'https://picsum.photos/seed/alice_chat/50/50', lastMessageTime: '10:30 AM' },
  { id: 'conv2', userName: 'Bob Johnson (BMW X5 Agency)', lastMessage: 'Yes, it is. Would you like to proceed?', unreadCount: 0, avatarUrl: 'https://picsum.photos/seed/bob_chat/50/50', lastMessageTime: 'Yesterday' },
  { id: 'conv3', userName: 'Charlie Brown (Ford Mustang Renter)', lastMessage: 'Perfect, thanks!', unreadCount: 0, avatarUrl: 'https://picsum.photos/seed/charlie_chat/50/50', lastMessageTime: 'Mon' },
];

const mockMessages = {
  conv1: [
    { id: 'msg1', sender: 'Alice Smith', text: 'Hi, is the Toyota Camry available next weekend, from Sat to Sun?', time: '10:25 AM', isMe: false },
    { id: 'msg2', sender: 'You (Agency)', text: 'Hi Alice, let me check the availability for you.', time: '10:27 AM', isMe: true },
    { id: 'msg3', sender: 'Alice Smith', text: 'Okay, thank you!', time: '10:28 AM', isMe: false },
    { id: 'msg4', sender: 'Alice Smith', text: 'Is the car available next weekend?', time: '10:30 AM', isMe: false },

  ],
  conv2: [
    { id: 'msg5', sender: 'You (Renter)', text: 'Hello, I am interested in the BMW X5. Is it available for a 3-day rental starting next Friday?', time: 'Yesterday', isMe: true },
    { id: 'msg6', sender: 'Bob Johnson (BMW X5 Agency)', text: 'Yes, it is. Would you like to proceed?', time: 'Yesterday', isMe: false },
  ],
};

// For now, this is a placeholder. Actual implementation would use useState for selected conversation, messages, etc.
// and fetch data dynamically.
export default function ChatPage() {
  const selectedConversationId = mockConversations[0].id; // Default to first conversation for demo
  const currentMessages = (mockMessages as any)[selectedConversationId] || [];

  return (
    <div className="container mx-auto px-0 sm:px-4 py-8 h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center mb-6 px-4 sm:px-0">
        <Button variant="outline" size="icon" className="mr-4 sm:hidden" asChild>
          <Link href="/account/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <MessageSquare className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 border rounded-lg shadow-lg overflow-hidden">
        {/* Conversations List */}
        <div className="md:col-span-1 lg:col-span-1 border-r bg-muted/20 flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {mockConversations.map(conv => (
              <div key={conv.id} className={`p-4 border-b hover:bg-background cursor-pointer ${selectedConversationId === conv.id ? 'bg-primary/10' : ''}`}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conv.avatarUrl} alt={conv.userName} data-ai-hint="person avatar" />
                    <AvatarFallback>{conv.userName.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate text-sm">{conv.userName}</h3>
                      <span className="text-xs text-muted-foreground">{conv.lastMessageTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <Badge variant="default" className="h-5 px-1.5 text-xs">{conv.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full bg-background">
          {selectedConversationId ? (
            <>
              <div className="p-4 border-b flex items-center gap-3 bg-muted/50">
                <Avatar className="h-10 w-10">
                   <AvatarImage src={mockConversations.find(c=>c.id === selectedConversationId)?.avatarUrl} data-ai-hint="person avatar" />
                   <AvatarFallback>{mockConversations.find(c=>c.id === selectedConversationId)?.userName.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-semibold text-lg">{mockConversations.find(c => c.id === selectedConversationId)?.userName}</h2>
                    <p className="text-xs text-green-600">Online</p> {/* Placeholder status */}
                </div>
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {currentMessages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isMe ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t bg-muted/50">
                <form className="flex items-center gap-2">
                  <Input placeholder="Type your message..." className="flex-grow bg-background" />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground">Select a conversation</h2>
              <p className="text-muted-foreground">Choose a conversation from the list to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
