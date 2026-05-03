import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ── helpers ──────────────────────────────────────────────────────────────────

export type Room = {
  type: string;   // was: 'Dorm' | 'Private'
  totalBeds: number;
  bookedBeds: number;
};

export const getAvailabilityBadge = (rooms: Room[]) => {
  const dorm = rooms.find(r => r.type === 'Dorm');
  if (!dorm) return null;
  const left = dorm.totalBeds - dorm.bookedBeds;
  if (left === 0) return { label: 'Sold Out', color: '#FF3B30', icon: 'block' };
  if (left <= 3) return { label: `Only ${left} left`, color: '#FF9500', icon: 'local-fire-department' };
  return { label: 'Available', color: '#34C759', icon: 'check-circle' };
};

// ── component ────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  onClose: () => void;
  hostelName: string;
  rooms: Room[];
  dormFrom: number;
  privateFrom: number;
};

function AvailabilityModal({ visible, onClose, hostelName, rooms, dormFrom, privateFrom }: Props) {
  const getRoomStatus = (room: Room) => {
    const left = room.totalBeds - room.bookedBeds;
    const pct = Math.round((room.bookedBeds / room.totalBeds) * 100);
    if (left === 0) return { label: 'Sold Out', color: '#FF3B30', icon: 'block', left, pct };
    if (left <= 3) return { label: `Only ${left} beds left`, color: '#FF9500', icon: 'local-fire-department', left, pct };
    return { label: `${left} beds available`, color: '#34C759', icon: 'check-circle', left, pct };
  };

  const prices: Record<string, number> = { Dorm: dormFrom, Private: privateFrom };
  const roomIcons: Record<string, string> = { Dorm: 'bed', Private: 'door-front' };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>

          {/* handle */}
          <View style={styles.handle} />

          {/* header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Availability</Text>
              <Text style={styles.subtitle}>{hostelName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {rooms.map(room => {
              const status = getRoomStatus(room);
              return (
                <View key={room.type} style={styles.roomCard}>

                  {/* room title row */}
                  <View style={styles.roomHeader}>
                    <View style={styles.roomIconBox}>
                      <Icon name={roomIcons[room.type] ?? 'hotel'} size={18} color="#E8445A" />
                    </View>
                    <Text style={styles.roomType}>{room.type === 'Dorm' ? '🛏 Dorm Bed' : '🚪 Private Room'}</Text>
                    <Text style={styles.roomPrice}>₹{prices[room.type]}<Text style={styles.perNight}>/night</Text></Text>
                  </View>

                  {/* progress bar */}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${status.pct}%` as any,
                          backgroundColor:
                            status.pct === 100 ? '#FF3B30' :
                            status.pct >= 70  ? '#FF9500' : '#34C759',
                        },
                      ]}
                    />
                  </View>

                  {/* stats row */}
                  <View style={styles.statsRow}>
                    <Text style={styles.statsText}>
                      {room.bookedBeds}/{room.totalBeds} booked
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.color + '1A' }]}>
                      <Icon name={status.icon} size={13} color={status.color} />
                      <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </View>

                </View>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.bookBtn} onPress={onClose}>
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 6,
  },
  roomCard: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  roomIconBox: {
    backgroundColor: '#fff0f2',
    borderRadius: 8,
    padding: 6,
  },
  roomType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  roomPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E8445A',
  },
  perNight: {
    fontSize: 11,
    color: '#aaa',
    fontWeight: '400',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookBtn: {
    backgroundColor: '#E8445A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AvailabilityModal;