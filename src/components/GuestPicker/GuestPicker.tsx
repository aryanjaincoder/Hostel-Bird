import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './GuestPicker.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onGuestsSelected: (adults: number, children: number) => void;
}

function GuestPicker({ visible, onClose, onGuestsSelected }: Props) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const handleReset = () => {
    setAdults(1);
    setChildren(0);
  };

  const handleDone = () => {
    onGuestsSelected(adults, children);
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

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Number of Guests</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Counter Box */}
          <View style={styles.counterBox}>

            {/* Adults */}
            <View style={styles.counterRow}>
              <View style={styles.counterLeft}>
                <Icon name="person-outline" size={22} color="#333" />
                <Text style={styles.counterLabel}>Adults</Text>
              </View>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setAdults(Math.max(1, adults - 1))}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{adults}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setAdults(adults + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Children */}
            <View style={styles.counterRow}>
              <View style={styles.counterLeft}>
                <Icon name="face" size={22} color="#333" />
                <Text style={styles.counterLabel}>Children</Text>
              </View>
              <View style={styles.counterControls}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setChildren(Math.max(0, children - 1))}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{children}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setChildren(children + 1)}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* Bottom Buttons */}
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

export default GuestPicker;