import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  viewAll: {
    fontSize: 14,
    color: '#E8445A',
    fontWeight: '500',
  },
  scrollContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 14,
  },
  card: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardInfo: {
    padding: 10,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceCol: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  priceLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  priceMain: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  priceOriginal: {
    fontSize: 11,
    color: '#aaa',
    textDecorationLine: 'line-through',
  },
});