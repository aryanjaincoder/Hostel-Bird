import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './NotificationScreen.styles';
import notificationsData from '../../data/notifications/Notifications';

const filterTabs = ['All', 'Bookings', 'Offers', 'Safety'];

function NotificationScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState(notificationsData);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Bookings') return n.type === 'booking';
    if (activeFilter === 'Offers') return n.type === 'offer';
    if (activeFilter === 'Safety') return n.type === 'safety';
    return true;
  });

  const sections = ['Today', 'Offers', 'Earlier'];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filterTabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off" size={64} color="#ddd" />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={s => s}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item: section }) => {
            const sectionNotifs = filtered.filter(n => n.section === section);
            if (sectionNotifs.length === 0) return null;
            return (
              <View>
                <Text style={styles.sectionLabel}>{section}</Text>
                {sectionNotifs.map(notif => (
                  <TouchableOpacity
                    key={notif.id}
                    style={[styles.notifCard, !notif.isRead && styles.notifCardUnread]}
                    onPress={() => markRead(notif.id)}
                    activeOpacity={0.85}
                  >
                    {/* Icon */}
                    <View style={[styles.iconBox, { backgroundColor: notif.color + '20' }]}>
                      <Icon name={notif.icon} size={22} color={notif.color} />
                    </View>

                    {/* Content */}
                    <View style={styles.notifContent}>
                      <View style={styles.notifTitleRow}>
                        <Text style={styles.notifTitle}>{notif.title}</Text>
                        {!notif.isRead && <View style={styles.unreadDot} />}
                      </View>
                      <Text style={styles.notifMessage} numberOfLines={2}>
                        {notif.message}
                      </Text>
                      <Text style={styles.notifTime}>{notif.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

export default NotificationScreen;