import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  currentLocationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  currentLocationText: {
    flex: 1,
    marginLeft: 12,
  },
  currentLocationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  currentLocationSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  refreshBtn: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 6,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    fontWeight: '500',
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  // ✅ Selected state highlight
  destRowSelected: {
    backgroundColor: '#fff5f6',
    borderRadius: 10,
    paddingHorizontal: 8,
    borderBottomColor: 'transparent',
  },
  destIcon: {
    marginRight: 14,
  },
  destText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    flex: 1,
  },
  destTextSelected: {
    color: '#E8445A',
    fontWeight: '600',
  },
  // ✅ Same pattern as GuestPicker
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#fff0f2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  doneBtn: {
    flex: 2,
    backgroundColor: '#E8445A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});