import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  dateBox: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
  },
  inputBoxActive: {
    borderWidth: 1.5,
    borderColor: '#E8445A',
    backgroundColor: '#fff5f6',
  },
  iconSpacing: {
    marginRight: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#aaa',
    flex: 1,
  },
  dateTextActive: {
    color: '#333',
    fontWeight: '500',
  },
  hint: {
    fontSize: 13,
    color: '#E8445A',
    marginBottom: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  // ✅ Same pattern as GuestPicker
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    width: '100%',
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
  doneBtnDisabled: {
    backgroundColor: '#f0b0b8',
  },
  doneText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});