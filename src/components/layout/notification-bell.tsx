"use client";

import { useMemo } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import {
  collection,
  orderBy,
  limit,
  query,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { Notification } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const notificationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, "clients", user.uid, "notifications"),
      orderBy("createdAt", "desc"),
      limit(10),
    );
  }, [firestore, user]);

  const {
    data: notifications,
    isLoading,
  } = useCollection<Notification>(notificationsQuery);

  const unreadCount = useMemo(
    () => notifications?.filter((n) => !n.read).length ?? 0,
    [notifications],
  );

  const handleNotificationClick = async (notif: Notification) => {
    if (!user) return;

    try {
      const ref = doc(
        firestore,
        "clients",
        user.uid,
        "notifications",
        notif.id,
      );
      await updateDoc(ref, { read: true });
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }

    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user || !notifications || notifications.length === 0) return;
    try {
      const batch = writeBatch(firestore);
      notifications
        .filter((n) => !n.read)
        .forEach((n) => {
          const ref = doc(
            firestore,
            "clients",
            user.uid,
            "notifications",
            n.id,
          );
          batch.update(ref, { read: true });
        });
      await batch.commit();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  const hasNotifications = notifications && notifications.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              className="flex items-center gap-1 text-[11px] text-primary"
              onClick={handleMarkAllRead}
              type="button"
            >
              <CheckCircle2 className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!hasNotifications && !isLoading && (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
            No notifications yet.
          </div>
        )}

        {isLoading && (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
            Loading…
          </div>
        )}

        {hasNotifications &&
          notifications!.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className="flex flex-col items-start gap-0.5 py-2 cursor-pointer"
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    notif.read
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {notif.title}
                </span>
                {!notif.read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {notif.body}
              </span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
