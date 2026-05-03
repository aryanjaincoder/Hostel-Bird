import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { styles } from './DestinationTabs.styles';

const destinations = ['Manali', 'Rishikesh', 'Goa', 'Kasauli', 'Mussorie','Delhi' , 'Mumbai', 'Bangalore', 'Udaipur', 'Jaipur', 'Shimla' , 'Darjeeling'];

function DestinationTabs() {
  const [active, setActive] = useState('Rishikesh');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {destinations.map(dest => (
        <TouchableOpacity
          key={dest}
          style={[styles.chip, active === dest && styles.activeChip]}
          onPress={() => setActive(dest)}
        >
          <Text style={[styles.chipText, active === dest && styles.activeChipText]}>
            {dest}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default DestinationTabs;