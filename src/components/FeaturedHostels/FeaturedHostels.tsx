import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './FeaturedHostels.styles';
import hostels from '../../data/hotels/Hostel';

// ✅ navigation prop add kiya
function FeaturedHostels({ navigation }: any) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Featured Hostels</Text>
        {/* ✅ View all navigate karta hai ViewAll screen pe */}
        <TouchableOpacity onPress={() => navigation.navigate('ViewAll')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {hostels.map(hostel => (
          <TouchableOpacity key={hostel.id} style={styles.card}>

            {/* Hotel Image */}
            <Image source={hostel.image} style={styles.cardImage} resizeMode="cover" />

            {/* Hotel Info */}
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.hotelName} numberOfLines={1}>{hostel.name}</Text>
                <View style={styles.ratingBadge}>
                  <Icon name="star" size={12} color="#FFA500" />
                  <Text style={styles.ratingText}>{hostel.rating.toFixed(1)}</Text>
                </View>
              </View>

              {/* Pricing Row */}
              <View style={styles.pricingRow}>
                <View style={styles.priceCol}>
                  <Text style={styles.priceLabel}>Privates from</Text>
                  <Text style={styles.priceMain}>₹{hostel.privateFrom}</Text>
                  <Text style={styles.priceOriginal}>₹{hostel.privateOriginal}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.priceCol}>
                  <Text style={styles.priceLabel}>Dorms from</Text>
                  <Text style={styles.priceMain}>₹{hostel.dormFrom}</Text>
                  <Text style={styles.priceOriginal}>₹{hostel.dormOriginal}</Text>
                </View>
              </View>
            </View>

          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default FeaturedHostels;