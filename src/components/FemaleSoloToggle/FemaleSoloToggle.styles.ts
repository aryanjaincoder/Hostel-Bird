import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  femaleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f2',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  femaleIconBox: {
    backgroundColor: '#ffd6dc',
    borderRadius: 20,
    padding: 8,
  },
  femaleTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  knowMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  femaleSubtitle: {
    fontSize: 12,
    color: '#E8445A',
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
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconBox: {
    backgroundColor: '#fff0f2',
    borderRadius: 20,
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  modalButton: {
    backgroundColor: '#E8445A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});