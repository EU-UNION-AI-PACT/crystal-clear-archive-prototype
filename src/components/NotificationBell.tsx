import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string | null;
  type: string;
  read: boolean;
  created_at: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setNotifications((data as Notification[]) || []);
  };

  useEffect(() => {
    if (!user) return;
    loadNotifications();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = async () => {
    if (!user) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", unreadIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Gerade eben";
    if (mins < 60) return `vor ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `vor ${hrs}h`;
    return `vor ${Math.floor(hrs / 24)}d`;
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unreadCount > 0) markAllRead();
        }}
        className="relative flex items-center justify-center w-8 h-8 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
      >
        <Bell className="w-3.5 h-3.5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground font-mono text-[8px] flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-10 w-80 border border-border bg-card shadow-lg z-50"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                Benachrichtigungen
              </span>
              {notifications.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="font-mono text-[9px] text-primary hover:underline"
                >
                  Alle gelesen
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-muted-foreground font-mono text-[11px] py-8">
                  Keine Benachrichtigungen
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-border/30 transition-colors ${
                      !n.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-xs font-semibold text-foreground truncate">
                          {n.title}
                        </p>
                        {n.message && (
                          <p className="font-mono text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-[8px] text-muted-foreground/50 whitespace-nowrap mt-0.5">
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
