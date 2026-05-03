import { Modal, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './FemaleSoloToggle.styles';

// ✅ Props add kiye
interface Props {
  isFemale: boolean;
  onToggle: (val: boolean) => void;
}

const features = [
  'Shows female-friendly hostels',
  'Highlights safer locations',
  'Prioritizes better-rated stays',
  'Filters options suitable for solo women',
];

function FemaleSoloToggle({ isFemale, onToggle }: Props) {
  const [showModal, setShowModal] = useState(false);

  // ✅ apna state hataya — parent se aata hai ab
  return (
    <>
      <View style={styles.femaleBanner}>
        <View style={styles.femaleIconBox}>
          <Icon name="location-on" size={20} color="#E8445A" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.femaleTitle}>Female Solo Traveller</Text>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.knowMoreRow}
          >
            <Text style={styles.femaleSubtitle}>Know more  </Text>
            <Icon name="info" size={12} color="#E8445A" />
          </TouchableOpacity>
        </View>
        {/* ✅ parent se value aur handler */}
        <Switch
          value={isFemale}
          onValueChange={onToggle}
          trackColor={{ false: '#e0e0e0', true: '#ffb3bc' }}
          thumbColor={isFemale ? '#E8445A' : '#fff'}
        />
      </View>

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>

            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}>
                <Icon name="female" size={24} color="#E8445A" />
              </View>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="close" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalTitle}>Female Solo Traveller</Text>
            <Text style={styles.modalDesc}>
              Traveling solo? This feature helps you find safer and more suitable stays designed for women travelling alone.
            </Text>

            <View style={styles.modalDivider} />

            <Text style={styles.modalSectionTitle}>What this does</Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Icon name="check-circle" size={16} color="#E8445A" style={{ marginRight: 8 }} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default FemaleSoloToggle;