import React, { useState, useEffect } from 'react';
import { notificationsService } from '../../services/notifications';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Bell, CheckCheck } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadNotifs = () => {
    notificationsService.getMyNotifications().then((data) => {
      setNotifs(data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    await notificationsService.markAsRead(id);
    loadNotifs();
  };

  const handleMarkAllRead = async () => {
    await notificationsService.markAllAsRead();
    showToast('All alerts marked as read.', 'success');
    loadNotifs();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notification Center</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time alerts, leave decisions, and system messages</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
          <CheckCheck className="w-4 h-4" /> Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border transition-all ${
              n.isRead ? 'bg-white border-slate-200 opacity-75' : 'bg-white border-blue-200 border-l-4 border-l-blue-600 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
              <span className="text-[10px] text-slate-400 font-medium">{n.createdAt}</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">{n.message}</p>
            {!n.isRead && (
              <Button variant="ghost" size="sm" onClick={() => handleMarkRead(n.id)}>
                Mark read
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
