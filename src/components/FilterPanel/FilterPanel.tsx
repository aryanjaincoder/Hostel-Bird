import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../components/FilterPanel/FilterPanel.styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.78;

export type FilterState = {
  priceRange: [number, number];
  priceType: 'Dorm' | 'Private';  // which price field to filter on
  amenities: string[];
  roomType: 'All' | 'Dorm' | 'Private';
  minRating: number;
  femaleSafe: boolean;
  availabilityStatus: 'All' | 'Available' | 'LastFew' | 'Full';
};

export const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 6000],
  priceType: 'Dorm',
  amenities: [],
  roomType: 'All',
  minRating: 0,
  femaleSafe: false,
  availabilityStatus: 'All',
};

const AMENITY_OPTIONS = ['WiFi', 'AC', 'Breakfast', 'Kitchen', 'Parking', 'Hot Water', 'Locker', 'Laundry'];
const RATING_OPTIONS = [
  { label: 'Any', value: 0 },
  { label: '7+', value: 7 },
  { label: '7.5+', value: 7.5 },
  { label: '8+', value: 8 },
  { label: '9+', value: 9 },
];
const ROOM_TYPES: Array<{ label: string; value: FilterState['roomType']; icon: string }> = [
  { label: 'All', value: 'All', icon: 'hotel' },
  { label: 'Dorm only', value: 'Dorm', icon: 'people' },
  { label: 'Private only', value: 'Private', icon: 'person' },
];
const AVAIL_OPTIONS: Array<{ label: string; value: FilterState['availabilityStatus']; color: string }> = [
  { label: 'All', value: 'All', color: '#555' },
  { label: 'Available', value: 'Available', color: '#34C759' },
  { label: 'Last Few', value: 'LastFew', color: '#FF9500' },
  { label: 'Full', value: 'Full', color: '#FF3B30' },
];

// Price range bounds — covers both dorm (max ~900) and private (max ~5100)
const PRICE_MIN = 0;
const PRICE_MAX = 6000;
const PRICE_STEP = 100;
const THUMB_SIZE = 26;

// ── Dual Range Slider ─────────────────────────────────────────────────────────
type SliderProps = {
  low: number;
  high: number;
  onchange: (low: number, high: number) => void;
};

function DualSlider({ low, high, onchange }: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const lowPx = trackWidth > 0 ? ((low - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * trackWidth : 0;
  const highPx = trackWidth > 0 ? ((high - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * trackWidth : 0;

  const lowRef = useRef(low);
  const highRef = useRef(high);
  const trackWidthRef = useRef(0);
  const lowStartPx = useRef(0);
  const highStartPx = useRef(0);

  useEffect(() => { lowRef.current = low; }, [low]);
  useEffect(() => { highRef.current = high; }, [high]);
  useEffect(() => { trackWidthRef.current = trackWidth; }, [trackWidth]);

  const snapValue = (px: number) => {
    const raw = (px / trackWidthRef.current) * (PRICE_MAX - PRICE_MIN) + PRICE_MIN;
    const stepped = Math.round(raw / PRICE_STEP) * PRICE_STEP;
    return Math.max(PRICE_MIN, Math.min(PRICE_MAX, stepped));
  };

  const lowPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const tw = trackWidthRef.current;
        lowStartPx.current = ((lowRef.current - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * tw;
      },
      onPanResponderMove: (_, g) => {
        const tw = trackWidthRef.current;
        if (tw === 0) return;
        const minGap = (PRICE_STEP / (PRICE_MAX - PRICE_MIN)) * tw;
        const highPxNow = ((highRef.current - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * tw;
        const newPx = Math.max(0, Math.min(highPxNow - minGap, lowStartPx.current + g.dx));
        const clamped = Math.max(PRICE_MIN, Math.min(highRef.current - PRICE_STEP, snapValue(newPx)));
        if (clamped !== lowRef.current) onchange(clamped, highRef.current);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const highPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const tw = trackWidthRef.current;
        highStartPx.current = ((highRef.current - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * tw;
      },
      onPanResponderMove: (_, g) => {
        const tw = trackWidthRef.current;
        if (tw === 0) return;
        const minGap = (PRICE_STEP / (PRICE_MAX - PRICE_MIN)) * tw;
        const lowPxNow = ((lowRef.current - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * tw;
        const newPx = Math.max(lowPxNow + minGap, Math.min(tw, highStartPx.current + g.dx));
        const clamped = Math.max(lowRef.current + PRICE_STEP, Math.min(PRICE_MAX, snapValue(newPx)));
        if (clamped !== highRef.current) onchange(lowRef.current, clamped);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.priceSliderWrapper}>
      <View style={styles.priceLabels}>
        <Text style={styles.priceLabel}>₹{low.toLocaleString()}</Text>
        <Text style={styles.priceLabel}>₹{high.toLocaleString()}</Text>
      </View>

      <View style={styles.priceTrackContainer} onLayout={onLayout}>
        <View style={styles.priceTrack} />

        {trackWidth > 0 && (
          <View
            style={[styles.priceTrackFill, { left: lowPx, width: Math.max(0, highPx - lowPx) }]}
          />
        )}

        {trackWidth > 0 && (
          <View
            style={[styles.priceThumb, { left: lowPx - THUMB_SIZE / 2 }]}
            {...lowPanResponder.panHandlers}
          >
            <View style={styles.priceThumbInner} />
          </View>
        )}

        {trackWidth > 0 && (
          <View
            style={[styles.priceThumb, { left: highPx - THUMB_SIZE / 2 }]}
            {...highPanResponder.panHandlers}
          >
            <View style={styles.priceThumbInner} />
          </View>
        )}
      </View>

      <View style={styles.priceHints}>
        <Text style={styles.priceHint}>₹{PRICE_MIN}</Text>
        <Text style={styles.priceHint}>₹{PRICE_MAX.toLocaleString()}</Text>
      </View>
    </View>
  );
}

// ── Main FilterPanel ──────────────────────────────────────────────────────────
type Props = {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onApply: (f: FilterState) => void;
  activeCount: number;
};

export default function FilterPanel({ visible, onClose, filters, onChange, onApply, activeCount }: Props) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const local = useRef<FilterState>(filters);

  useEffect(() => { local.current = filters; }, [filters]);

  useEffect(() => {
    if (visible) {
      local.current = filters;
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 180 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SHEET_HEIGHT, duration: 260, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const sheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20 }).start();
        }
      },
    })
  ).current;

  const update = useCallback((patch: Partial<FilterState>) => {
    const next = { ...local.current, ...patch };
    local.current = next;
    onChange(next);
  }, [onChange]);

  const handleReset = () => {
    local.current = { ...DEFAULT_FILTERS };
    onChange({ ...DEFAULT_FILTERS });
  };

  const handleApply = () => {
    onApply(local.current);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>

        {/* Drag handle */}
        <View style={styles.dragArea} {...sheetPanResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>

        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Filters</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Reset all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
        >

          {/* ── Price Range ─────────────────────────────────────────────── */}
          <View style={styles.section}>
            {/* Section header with inline Dorm/Private toggle */}
            <View style={styles.priceSectionHeader}>
              <Text style={styles.sectionTitle}>
                <Icon name="sell" size={14} color="#E8445A" />{'  '}Price Range
              </Text>
              {/* Toggle: which price type to filter */}
              <View style={styles.priceTypeToggle}>
                <TouchableOpacity
                  style={[styles.priceTypeBtn, filters.priceType === 'Dorm' && styles.priceTypeBtnActive]}
                  onPress={() => update({ priceType: 'Dorm', priceRange: [0, 6000] })}
                >
                  <Icon name="people" size={12} color={filters.priceType === 'Dorm' ? '#fff' : '#777'} style={{ marginRight: 3 }} />
                  <Text style={[styles.priceTypeBtnText, filters.priceType === 'Dorm' && styles.priceTypeBtnTextActive]}>
                    Dorm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.priceTypeBtn, filters.priceType === 'Private' && styles.priceTypeBtnActive]}
                  onPress={() => update({ priceType: 'Private', priceRange: [0, 6000] })}
                >
                  <Icon name="person" size={12} color={filters.priceType === 'Private' ? '#fff' : '#777'} style={{ marginRight: 3 }} />
                  <Text style={[styles.priceTypeBtnText, filters.priceType === 'Private' && styles.priceTypeBtnTextActive]}>
                    Private
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Hint below */}
            <Text style={styles.priceTypeHint}>
              Filtering by {filters.priceType === 'Dorm' ? 'dorm bed' : 'private room'} price
            </Text>

            <DualSlider
              low={filters.priceRange[0]}
              high={filters.priceRange[1]}
              onchange={(l, h) => update({ priceRange: [l, h] })}
            />
          </View>

          <View style={styles.divider} />

          {/* ── Room Type ────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Icon name="bed" size={14} color="#E8445A" />{'  '}Room Type
            </Text>
            <Text style={styles.filterSubHint}>Show hostels that have available beds in:</Text>
            <View style={styles.chipRow}>
              {ROOM_TYPES.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.segChip, filters.roomType === opt.value && styles.segChipActive]}
                  onPress={() => update({ roomType: opt.value })}
                >
                  <Icon
                    name={opt.icon}
                    size={13}
                    color={filters.roomType === opt.value ? '#E8445A' : '#888'}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[styles.segChipText, filters.roomType === opt.value && styles.segChipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── Min Rating ───────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Icon name="star" size={14} color="#E8445A" />{'  '}Minimum Rating
            </Text>
            <View style={styles.chipRow}>
              {RATING_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.segChip, filters.minRating === opt.value && styles.segChipActive]}
                  onPress={() => update({ minRating: opt.value })}
                >
                  {opt.value > 0 && (
                    <Icon
                      name="star"
                      size={12}
                      color={filters.minRating === opt.value ? '#E8445A' : '#bbb'}
                      style={{ marginRight: 3 }}
                    />
                  )}
                  <Text style={[styles.segChipText, filters.minRating === opt.value && styles.segChipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── Availability ─────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Icon name="event-available" size={14} color="#E8445A" />{'  '}Availability Status
            </Text>
            <Text style={styles.filterSubHint}>Based on dorm bed availability</Text>
            <View style={styles.chipRow}>
              {AVAIL_OPTIONS.map(opt => {
                const isActive = filters.availabilityStatus === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.availChip,
                      isActive && { backgroundColor: opt.color, borderColor: opt.color },
                    ]}
                    onPress={() => update({ availabilityStatus: opt.value })}
                  >
                    {opt.value !== 'All' && (
                      <View style={[styles.availDot, { backgroundColor: isActive ? '#fff' : opt.color }]} />
                    )}
                    <Text style={[styles.availChipText, isActive && styles.availChipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── Amenities ────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Icon name="local-offer" size={14} color="#E8445A" />{'  '}Amenities
            </Text>
            <Text style={styles.filterSubHint}>Show hostels that include all selected</Text>
            <View style={styles.amenityGrid}>
              {AMENITY_OPTIONS.map(a => {
                const isActive = filters.amenities.includes(a);
                return (
                  <TouchableOpacity
                    key={a}
                    style={[styles.amenityChip, isActive && styles.amenityChipActive]}
                    onPress={() => {
                      const next = isActive
                        ? filters.amenities.filter(x => x !== a)
                        : [...filters.amenities, a];
                      update({ amenities: next });
                    }}
                  >
                    {isActive && <Icon name="check" size={12} color="#E8445A" style={{ marginRight: 4 }} />}
                    <Text style={[styles.amenityChipText, isActive && styles.amenityChipTextActive]}>{a}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── Female Safe ──────────────────────────────────────────────── */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => update({ femaleSafe: !filters.femaleSafe })}
              activeOpacity={0.7}
            >
              <View style={styles.toggleLeft}>
                <View style={[styles.toggleIconWrap, filters.femaleSafe && styles.toggleIconWrapActive]}>
                  <Icon name="female" size={16} color={filters.femaleSafe ? '#fff' : '#E8445A'} />
                </View>
                <View>
                  <Text style={styles.toggleLabel}>Female Safe Only</Text>
                  <Text style={styles.toggleSub}>Show female-friendly hostels</Text>
                </View>
              </View>
              <View style={[styles.toggleSwitch, filters.femaleSafe && styles.toggleSwitchActive]}>
                <View style={[styles.toggleKnob, filters.femaleSafe && styles.toggleKnobActive]} />
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Apply button */}
        <View style={styles.applyWrapper}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
            <Text style={styles.applyBtnText}>Show Results</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Modal>
  );
}