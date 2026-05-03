import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './MeScreen.styles';
import user from '../../data/users/User'; // ✅ user data import

const profileSection = [
  { id: 'about', label: 'About me', icon: 'person-outline' },
  { id: 'languages', label: 'Languages', icon: 'translate', value: user.languages.join(', ') },
  { id: 'lived', label: 'I have lived in', icon: 'location-on', value: user.livedIn.join(', ') },
  { id: 'gender', label: user.gender, icon: 'female' },
];

const actionsSection = [
  { id: 'interests', label: 'My interests', icon: 'interests' },
  { id: 'traveller', label: 'Travellers profile', icon: 'luggage' },
  { id: 'wallet', label: 'Bird Coin Wallet', icon: 'account-balance-wallet' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

function MeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Pink Header */}
      <View style={styles.headerBg}>
        <TouchableOpacity style={styles.editBtn}>
          <Icon name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          {/* ✅ user.avatar from data */}
          <Image source={user.avatar} style={styles.avatar} />
        </View>
        {/* ✅ user.name and user.age from data */}
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.age}>{user.age} years old</Text>
      </View>

      {/* About Section */}
      <View style={styles.card}>
        {profileSection.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity style={styles.row}>
              <Icon name={item.icon} size={20} color="#E8445A" style={styles.rowIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowText}>{item.label}</Text>
                {/* ✅ value show karo agar hai toh */}
                {item.value && (
                  <Text style={styles.rowSubText}>{item.value}</Text>
                )}
              </View>
              <Icon name="chevron-right" size={22} color="#ccc" />
            </TouchableOpacity>
            {index < profileSection.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Actions Section */}
      <View style={styles.card}>
        {actionsSection.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity style={styles.row}>
              <Icon name={item.icon} size={20} color="#E8445A" style={styles.rowIcon} />
              <Text style={styles.rowText}>{item.label}</Text>
              <Icon name="chevron-right" size={22} color="#ccc" />
            </TouchableOpacity>
            {index < actionsSection.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Logout */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.row}>
          <Icon name="logout" size={20} color="#E8445A" style={styles.rowIcon} />
          <Text style={styles.rowText}>Logout</Text>
          <Icon name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

export default MeScreen;