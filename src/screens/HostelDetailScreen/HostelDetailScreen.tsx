import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './HostelDetailScreen.styles.ts';

const { width } = Dimensions.get('window');

const accordionSections = ['Cancellation Policy', 'Things to note', 'Minimum and maximum nights'];

function HostelDetailScreen({ navigation, route }: any) {
  const { hostel } = route.params;
  const [currentImage, setCurrentImage] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('Cancellation Policy');
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState(0);

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImage(index);
            }}
          >
            {hostel.images.map((img: any, i: number) => (
              <Image key={i} source={img} style={[styles.carouselImage, { width }]} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Image counter */}
          <View style={styles.imageCounter}>
            <Icon name="photo-library" size={14} color="#fff" />
            <Text style={styles.imageCounterText}>{currentImage + 1}/{hostel.images.length}</Text>
          </View>

          {/* Dots */}
          <View style={styles.dotsRow}>
            {hostel.images.map((_: any, i: number) => (
              <View key={i} style={[styles.dot, currentImage === i && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTo}>Welcome To</Text>
          <Text style={styles.hostelName}>{hostel.name}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.ratingText}>{hostel.averageReview} ({hostel.reviewCount} Reviews)</Text>
          </View>
        </View>

        {/* Located In */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Located In</Text>
          <View style={styles.locationRow}>
            <Icon name="location-on" size={18} color="#E8445A" />
            <Text style={styles.locationText}>{hostel.city}, {hostel.country}</Text>
          </View>
          <View style={styles.locationRow}>
            <Icon name="radio-button-checked" size={18} color="#E8445A" />
            <Text style={styles.locationText}>{hostel.distanceFromCenter}</Text>
          </View>

          {/* Map placeholder */}
          <View style={styles.mapPlaceholder}>
            <Icon name="map" size={40} color="#E8445A" />
            <Text style={styles.mapText}>Map View</Text>
            <TouchableOpacity style={styles.directionsBtn}>
              <Icon name="navigation" size={14} color="#E8445A" />
              <Text style={styles.directionsBtnText}>Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {hostel.fullAmenities.map((amenity: string, i: number) => (
              <View key={i} style={styles.amenityItem}>
                <Icon name="wifi" size={18} color="#E8445A" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* House Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>House rules</Text>
          <View style={styles.rulesGrid}>
            <View style={styles.ruleBox}>
              <Icon name="login" size={20} color="#E8445A" />
              <Text style={styles.ruleLabel}>Check in</Text>
              <Text style={styles.ruleValue}>{hostel.houseRules.checkIn}</Text>
            </View>
            <View style={styles.ruleBox}>
              <Icon name="logout" size={20} color="#E8445A" />
              <Text style={styles.ruleLabel}>Check out</Text>
              <Text style={styles.ruleValue}>{hostel.houseRules.checkOut}</Text>
            </View>
            <View style={styles.ruleBox}>
              <Icon name="people" size={20} color="#E8445A" />
              <Text style={styles.ruleLabel}>Guest Visit</Text>
              <Text style={styles.ruleValue}>{hostel.houseRules.guestVisit}</Text>
            </View>
            <View style={styles.ruleBox}>
              <Icon name="restaurant" size={20} color="#E8445A" />
              <Text style={styles.ruleLabel}>Reception</Text>
              <Text style={styles.ruleValue}>{hostel.houseRules.reception}</Text>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <Text style={styles.aboutText} numberOfLines={showFullAbout ? undefined : 4}>
            {hostel.about}
          </Text>
          <TouchableOpacity onPress={() => setShowFullAbout(p => !p)}>
            <Text style={styles.viewDetailsBtn}>
              {showFullAbout ? 'View Less' : 'View Details'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Property Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property highlights</Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
              setCurrentHighlight(index);
            }}
          >
            {hostel.highlights.map((h: any, i: number) => (
              <View key={i} style={[styles.highlightCard, { width: width - 32 }]}>
                <Text style={styles.highlightLabel}>{h.label}:</Text>
                <View style={styles.highlightRow}>
                  <Icon name={h.icon} size={20} color="#1a1a1a" />
                  <Text style={styles.highlightValue}>{h.value}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.dotsRow}>
            {hostel.highlights.map((_: any, i: number) => (
              <View key={i} style={[styles.dot, currentHighlight === i && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Average Reviews */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#E8445A' }]}>Average reviews</Text>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewEmoji}>⭐⭐⭐</Text>
            <Text style={styles.reviewScore}>{hostel.averageReview}</Text>
            <Text style={styles.reviewEmoji}>⭐⭐⭐</Text>
            <Text style={styles.reviewDesc}>One of the most loved hostel on HostelBird based on ratings, reviews and reliability</Text>
          </View>
        </View>

        {/* Accordion Sections */}
        {accordionSections.map(section => (
          <View key={section} style={styles.accordionSection}>
            <TouchableOpacity
              style={[styles.accordionHeader, { backgroundColor: expandedSection === section ? '#E8445A' : '#6B4FAD' }]}
              onPress={() => toggleSection(section)}
            >
              <Text style={styles.accordionTitle}>{section}</Text>
              <Icon name={expandedSection === section ? 'expand-less' : 'expand-more'} size={22} color="#fff" />
            </TouchableOpacity>

            {expandedSection === section && (
              <View style={styles.accordionContent}>
                {section === 'Cancellation Policy' && hostel.cancellationPolicy.map((p: string, i: number) => (
                  <View key={i} style={styles.policyRow}>
                    <Icon name="radio-button-checked" size={16} color="#E8445A" />
                    <Text style={styles.policyText}>{p}</Text>
                  </View>
                ))}
                {section === 'Things to note' && hostel.thingsToNote.map((p: string, i: number) => (
                  <View key={i} style={styles.policyRow}>
                    <Icon name="radio-button-checked" size={16} color="#E8445A" />
                    <Text style={styles.policyText}>{p}</Text>
                  </View>
                ))}
                {section === 'Minimum and maximum nights' && (
                  <>
                    <View style={styles.policyRow}>
                      <Icon name="radio-button-checked" size={16} color="#E8445A" />
                      <Text style={styles.policyText}>Minimum Nights: {hostel.nightsPolicy.min}</Text>
                    </View>
                    <View style={styles.policyRow}>
                      <Icon name="radio-button-checked" size={16} color="#E8445A" />
                      <Text style={styles.policyText}>Maximum Nights: {hostel.nightsPolicy.max}</Text>
                    </View>
                    <View style={styles.policyRow}>
                      <Icon name="radio-button-checked" size={16} color="#E8445A" />
                      <Text style={styles.policyText}>Weekend Minimum Nights: {hostel.nightsPolicy.weekendMin}</Text>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarLabel}>One night starting from</Text>
          <Text style={styles.bottomBarPrice}>₹ {hostel.dormFrom}</Text>
          <Text style={styles.bottomBarTax}>Taxes not included</Text>
        </View>
        <TouchableOpacity style={styles.chooseRoomBtn}>
          <Text style={styles.chooseRoomText}>Choose a room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HostelDetailScreen;