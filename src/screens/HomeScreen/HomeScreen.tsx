import { Dimensions, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchCard from '../../components/SearchCard/SearchCard';
import DestinationTabs from '../../components/DestinationTabs/DestinationTabs';
import { styles } from './HomeScreen.styles';
import FeaturedHostels from '../../components/FeaturedHostels/FeaturedHostels';

const { height } = Dimensions.get('window');

function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={{ backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>

      <ImageBackground
        source={require('../../assets/images/hero-av.webp')}
        resizeMode="cover"
        style={[styles.heroBackground, { height: height * 0.75 }]}
      >
        {/* ✅ Bell icon */}
        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="notifications" size={24} color="#fff" />
          {/* ✅ Unread dot */}
          <View style={styles.bellDot} />
        </TouchableOpacity>

        <Text style={styles.heroTitle}>Find your next stay</Text>
        <SearchCard navigation={navigation} />
      </ImageBackground>

      <View style={styles.exploreSection}>
        <Text style={styles.exploreTitle}>
          Stay. <Text style={styles.explorePink}>Explore.</Text> Belong.
        </Text>
        <Text style={styles.exploreSubtitle}>
          Discover hostels across India — from Himalayan escapes to Goa's beaches, find your next travel story here.
        </Text>
        <DestinationTabs />
      </View>

      <FeaturedHostels navigation={navigation} />

    </ScrollView>
  );
}

export default HomeScreen;