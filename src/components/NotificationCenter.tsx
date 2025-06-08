
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, Clock, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationCenter = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'high') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (type === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (type === 'error') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-gray-100 text-gray-800'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading notifications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="health-card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
              className="flex items-center space-x-1"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`border rounded-lg p-4 transition-colors ${
                  notification.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      {getNotificationIcon(notification.type, notification.priority)}
                      <h4 className={`font-medium ${notification.is_read ? 'text-gray-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </h4>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className={`text-sm ${notification.is_read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notification.created_at).toLocaleString()}</span>
                      </span>
                      {notification.related_table && (
                        <Badge variant="outline" className="text-xs">
                          {notification.related_table}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!notification.is_read && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="ml-4"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet.</p>
              <p className="text-sm">You'll see important updates here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
