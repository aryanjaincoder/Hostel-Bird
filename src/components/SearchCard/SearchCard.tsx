import { Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { styles } from './SearchCard.styles';
import FemaleSoloToggle from '../FemaleSoloToggle/FemaleSoloToggle';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import LocationPicker from '../LocationPicker/LocationPicker';
import GuestPicker from '../GuestPicker/GuestPicker';
import user from '../../data/users/User';

function SearchCard({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('Hostel');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [location, setLocation] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showGuests, setShowGuests] = useState(false);
  const [isFemale, setIsFemale] = useState(false);

  const tabs = ['Hostel', 'Co-live', 'Bus'];

  const handleFemaleToggle = (val: boolean) => {
    setIsFemale(val);
    if (val) {
      setAdults(1);
      setChildren(0);
    }
  };

  return (
    <View style={styles.card}>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Location */}
      <Text style={styles.label}>Location</Text>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setShowLocation(true)}
      >
        <Icon name="location-on" size={20} color="#E8445A" style={styles.iconSpacing} />
        <Text style={[styles.placeholderText, location ? { color: '#333' } : {}]}>
          {location || 'Enter Destination'}
        </Text>
      </TouchableOpacity>

      {/* Date Range Picker */}
      <DateRangePicker
        checkIn={checkIn}
        checkOut={checkOut}
        onDatesSelected={(start, end) => {
          setCheckIn(start);
          setCheckOut(end);
        }}
      />

      {/* Travellers */}
      <Text style={styles.label}>Travellers</Text>
      <TouchableOpacity
        style={[styles.inputBox, isFemale && styles.inputBoxDisabled]}
        onPress={() => { if (!isFemale) setShowGuests(true); }}
      >
        <FontAwesome5
          name="user-friends"
          size={16}
          color={isFemale ? '#ccc' : '#555'}
          style={styles.iconSpacing}
        />
        <Text style={[styles.placeholderText, { color: isFemale ? '#ccc' : '#333' }]}>
          {adults + children} Guest{adults + children > 1 ? 's' : ''}
        </Text>
        <Icon name="keyboard-arrow-down" size={22} color={isFemale ? '#bbb' : '#333'} />
      </TouchableOpacity>

      {/* Female Solo Toggle */}
      {user.gender === 'Female' && (
        <FemaleSoloToggle
          isFemale={isFemale}
          onToggle={handleFemaleToggle}
        />
      )}

      {/* ✅ Let's Start — activeTab bhi pass karo */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('ViewAll', {
          location: location || 'Manali',
          checkIn,
          checkOut,
          guests: adults + children,
          isFemaleOnly: isFemale,
          activeTab, // ✅ Hostel / Co-live / Bus
        })}
      >
        <Text style={styles.startButtonText}>Let's Start</Text>
      </TouchableOpacity>

      {/* Location Picker */}
      <LocationPicker
        visible={showLocation}
        onClose={() => setShowLocation(false)}
        onLocationSelect={(loc) => setLocation(loc)}
      />

      {/* Guest Picker */}
      <GuestPicker
        visible={showGuests}
        onClose={() => setShowGuests(false)}
        onGuestsSelected={(a, c) => {
          setAdults(a);
          setChildren(c);
        }}
      />

    </View>
  );
}

export default SearchCard;