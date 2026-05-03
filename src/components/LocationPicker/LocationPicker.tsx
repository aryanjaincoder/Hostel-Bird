import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './LocationPicker.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
}

const recentDestinations = ['Mumbai', 'Goa', 'Hyderabad', 'Manali', 'Rishikesh'];

function LocationPicker({ visible, onClose, onLocationSelect }: Props) {
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleSelect = (location: string) => {
    setSelectedLocation(location);
  };

 const handleReset = () => {
  setSearchText('');
  setSelectedLocation(null);
  onLocationSelect(''); // ✅ parent ka location bhi clear karo
  onClose();           // ✅ modal band karo
};

  const handleDone = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>

          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Destination</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchBox}>
            <Icon name="location-on" size={22} color="#333" style={styles.searchIcon} />
            <TextInput
              placeholder="Enter Destination"
              placeholderTextColor="#aaa"
              style={styles.searchInput}
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                setSelectedLocation(null); // clear selection on new search
              }}
              autoFocus
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Icon name="cancel" size={18} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>

          {/* Current Location */}
          <TouchableOpacity style={styles.currentLocationBox}>
            <Icon name="my-location" size={20} color="#888" />
            <View style={styles.currentLocationText}>
              <Text style={styles.currentLocationTitle}>Current Location</Text>
              <Text style={styles.currentLocationSub}>Tap to select</Text>
            </View>
            <TouchableOpacity style={styles.refreshBtn}>
              <Icon name="refresh" size={18} color="#888" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Recent Destinations */}
          <Text style={styles.sectionTitle}>Recent Destination</Text>
          {recentDestinations
            .filter(d =>
              searchText === '' ||
              d.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((dest, index) => {
              const isSelected = selectedLocation === dest;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.destRow, isSelected && styles.destRowSelected]}
                  onPress={() => handleSelect(dest)}
                >
                  <Icon
                    name="luggage"
                    size={20}
                    color={isSelected ? '#E8445A' : '#333'}
                    style={styles.destIcon}
                  />
                  <Text style={[styles.destText, isSelected && styles.destTextSelected]}>
                    {dest}
                  </Text>
                  {isSelected && (
                    <Icon name="check-circle" size={18} color="#E8445A" />
                  )}
                </TouchableOpacity>
              );
            })}

          {/* Reset + Done bottom row */}
          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export default LocationPicker;