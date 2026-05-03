import { StyleSheet, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const THUMB_SIZE = 26;

export const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.78,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  dragArea: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8445A',
  },
  resetBtnText: {
    fontSize: 13,
    color: '#E8445A',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
  },

  // ── Sub-hint text under section titles ────────────────────────────────────
  filterSubHint: {
    fontSize: 11,
    color: '#aaa',
    marginBottom: 12,
    marginTop: 2,
  },

  // ── Price section header row ──────────────────────────────────────────────
  priceSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },

  // ── Price type toggle (Dorm / Private pill) ───────────────────────────────
  priceTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 3,
    gap: 2,
  },
  priceTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  priceTypeBtnActive: {
    backgroundColor: '#E8445A',
  },
  priceTypeBtnText: {
    fontSize: 12,
    color: '#777',
    fontWeight: '600',
  },
  priceTypeBtnTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  priceTypeHint: {
    fontSize: 11,
    color: '#aaa',
    marginBottom: 14,
    marginTop: 2,
  },

  // ── Price Slider ──────────────────────────────────────────────────────────
  priceSliderWrapper: {
    marginTop: 4,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E8445A',
  },
  priceTrackContainer: {
    height: THUMB_SIZE,
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: THUMB_SIZE / 2,
  },
  priceTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  priceTrackFill: {
    position: 'absolute',
    height: 5,
    borderRadius: 4,
    backgroundColor: '#E8445A',
  },
  priceThumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#E8445A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#E8445A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  priceThumbInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  priceHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceHint: {
    fontSize: 11,
    color: '#bbb',
    fontWeight: '500',
  },

  // ── Segment chips ─────────────────────────────────────────────────────────
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  segChipActive: {
    borderColor: '#E8445A',
    backgroundColor: '#fff0f2',
  },
  segChipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  segChipTextActive: {
    color: '#E8445A',
    fontWeight: '700',
  },

  // ── Availability chips ───────────────────────────────────────────────────
  availChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    gap: 5,
  },
  availDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  availChipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  availChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // ── Amenity grid ─────────────────────────────────────────────────────────
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  amenityChipActive: {
    borderColor: '#E8445A',
    backgroundColor: '#fff0f2',
  },
  amenityChipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  amenityChipTextActive: {
    color: '#E8445A',
    fontWeight: '700',
  },

  // ── Female safe toggle ───────────────────────────────────────────────────
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff0f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffd6db',
  },
  toggleIconWrapActive: {
    backgroundColor: '#E8445A',
    borderColor: '#E8445A',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  toggleSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    padding: 3,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: '#E8445A',
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },

  // ── Apply button ─────────────────────────────────────────────────────────
  applyWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  applyBtn: {
    backgroundColor: '#E8445A',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#E8445A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.3,
  },
});