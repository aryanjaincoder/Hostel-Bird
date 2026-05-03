import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  heroBackground: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 60,
  },
  bellBtn: {
    position: 'absolute',
    top: 48,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8445A',
    borderWidth: 1,
    borderColor: '#fff',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  exploreSection: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
  },
  exploreTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  explorePink: {
    color: '#E8445A',
  },
  exploreSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
});