import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './ChatScreen.styles';
import { chatList } from '../../data/messages/MessageData';

const tabs = ['All chats', 'Group chats', 'Direct messages'];

function ChatScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All chats');
  const [search, setSearch] = useState('');

  const filtered = chatList.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'Direct messages') return matchSearch && c.type === 'hostel';
    if (activeTab === 'Group chats') return matchSearch && c.type === 'support';
    return matchSearch;
  });

  return (
    <View style={styles.container}>

      {/* Pink Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Icon name="search" size={20} color="#fff" style={styles.searchIcon} />
            <TextInput
              placeholder="Search chat"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
            <Icon name="arrow-forward" size={20} color="#fff" />
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Icon name="add" size={24} color="#E8445A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsRow}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab}
                style={styles.tab}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="tune" size={22} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Icon name="chat-bubble-outline" size={40} color="#E8445A" />
          </View>
          <Text style={styles.emptyTitle}>No chats for now</Text>
          <Text style={styles.emptySubtitle}>
            Start a conversation and connect with fellow travelers
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
          {filtered.map(chat => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() => navigation.navigate('MessageScreen', { chat })}
              activeOpacity={0.85}
            >
              {/* Avatar */}
              <View style={styles.avatarWrapper}>
                <View style={[
                  styles.avatarBox,
                  chat.type === 'hostel' && styles.avatarBoxHostel,
                ]}>
                  <Icon
                    name={chat.type === 'support' ? 'support-agent' : 'home'}
                    size={26}
                    color="#E8445A"
                  />
                </View>
                {chat.isOnline && <View style={styles.onlineDot} />}
              </View>

              {/* Chat Info */}
              <View style={styles.chatInfo}>
                <View style={styles.chatTopRow}>
                  <View style={styles.chatNameRow}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    {/* ✅ Type badge */}
                    <View style={[
                      styles.typeBadge,
                      chat.type === 'support' ? styles.typeBadgeSupport : styles.typeBadgeHostel,
                    ]}>
                      <Text style={styles.typeBadgeText}>
                        {chat.type === 'support' ? 'Support' : 'Hostel'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>
                <View style={styles.chatBottomRow}>
                  <Text style={styles.chatLastMsg} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default ChatScreen;