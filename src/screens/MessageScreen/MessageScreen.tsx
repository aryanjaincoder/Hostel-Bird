import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './MessageScreen.styles';
import {
  predefinedQuestions,
  autoReplies,
  hostelMessages,
  hostelQuickReplies,
  hostelAutoReplies,
} from '../../data/messages/MessageData';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  time: string;
}

const getTime = () => {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const supportInitialMessages: Message[] = [
  {
    id: '1',
    text: 'Hi there! 👋 Welcome to HostelBird Support. How can we help you today?',
    isUser: false,
    time: getTime(),
  },
  {
    id: '2',
    text: 'Please select a question below or type your own query.',
    isUser: false,
    time: getTime(),
  },
];

function MessageScreen({ navigation, route }: any) {
  const { chat } = route.params;
  const isHostel = chat.type === 'hostel';

  // ✅ Load existing hostel messages or support initial messages
  const getInitialMessages = (): Message[] => {
    if (isHostel && chat.hostelId && hostelMessages[chat.hostelId as keyof typeof hostelMessages]) {
      return hostelMessages[chat.hostelId as keyof typeof hostelMessages];
    }
    return supportInitialMessages;
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [inputText, setInputText] = useState('');
  const [showQuestions, setShowQuestions] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const quickReplies = isHostel ? hostelQuickReplies : predefinedQuestions;
  const replies = isHostel ? hostelAutoReplies : autoReplies;

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      time: getTime(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setShowQuestions(false);

    setTimeout(() => {
      const replyText =
        replies[text as keyof typeof replies] ||
        (isHostel
          ? 'Thanks for your message! Our hostel team will respond shortly. For urgent queries, call us directly 📞'
          : 'Thanks for reaching out! Our support team will get back to you within 24 hours. For urgent issues, call: 1800-XXX-XXXX 📞');

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isUser: false,
        time: getTime(),
      };
      setMessages(prev => [...prev, botMsg]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 800);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, isHostel && styles.headerHostel]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={[styles.headerAvatar, isHostel && styles.headerAvatarHostel]}>
            <Icon
              name={isHostel ? 'home' : 'support-agent'}
              size={22}
              color={isHostel ? '#007AFF' : '#E8445A'}
            />
          </View>
          <View>
            <Text style={styles.headerName}>{chat.name}</Text>
            <View style={styles.onlineRow}>
              {chat.isOnline && <View style={styles.onlineDot} />}
              <Text style={styles.onlineText}>
                {chat.isOnline ? 'Online' : isHostel ? chat.hostelLocation : 'Support'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Hostel info strip */}
      {isHostel && (
        <View style={styles.hostelStrip}>
          <Icon name="star" size={14} color="#FFA500" />
          <Text style={styles.hostelStripText}>
            {chat.hostelRating} • {chat.hostelLocation}
          </Text>
          <Icon name="verified" size={14} color="#34C759" />
          <Text style={[styles.hostelStripText, { color: '#34C759' }]}>Verified</Text>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubbleWrapper,
            item.isUser ? styles.userWrapper : styles.botWrapper,
          ]}>
            {!item.isUser && (
              <View style={[styles.botAvatar, isHostel && styles.botAvatarHostel]}>
                <Icon
                  name={isHostel ? 'home' : 'support-agent'}
                  size={16}
                  color={isHostel ? '#007AFF' : '#E8445A'}
                />
              </View>
            )}
            <View style={[
              styles.messageBubble,
              item.isUser ? styles.userBubble : styles.botBubble,
              item.isUser && isHostel && styles.userBubbleHostel,
            ]}>
              <Text style={[
                styles.messageText,
                item.isUser ? styles.userText : styles.botText,
              ]}>
                {item.text}
              </Text>
              <Text style={[
                styles.messageTime,
                item.isUser ? styles.userTime : styles.botTime,
              ]}>
                {item.time}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Quick Replies */}
      {showQuestions && (
        <View style={styles.questionsContainer}>
          <Text style={styles.questionsLabel}>
            {isHostel ? 'Quick Questions' : 'How can we help?'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.questionsScroll}
          >
            {quickReplies.map(q => (
              <TouchableOpacity
                key={q.id}
                style={[styles.questionChip, isHostel && styles.questionChipHostel]}
                onPress={() => sendMessage(q.text)}
              >
                <Icon name={q.icon} size={14} color={isHostel ? '#007AFF' : '#E8445A'} />
                <Text style={[styles.questionChipText, isHostel && styles.questionChipTextHostel]}>
                  {q.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.questionsToggle}
          onPress={() => setShowQuestions(p => !p)}
        >
          <Icon name="help-outline" size={22} color={isHostel ? '#007AFF' : '#E8445A'} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            isHostel && styles.sendBtnHostel,
            !inputText.trim() && styles.sendBtnDisabled,
          ]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim()}
        >
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default MessageScreen;