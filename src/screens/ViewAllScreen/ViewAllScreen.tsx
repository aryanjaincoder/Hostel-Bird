import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Keyboard,
} from 'react-native';
import { useState, useRef, useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './ViewAllScreen.styles';
import hostels from '../../data/hotels/Hostel';
import AvailabilityModal, { getAvailabilityBadge, Room } from '../../components/Availabilitymodal/Availabilitymodal';
import FilterPanel, { FilterState, DEFAULT_FILTERS } from '../../components/FilterPanel/FilterPanel';
import { GROQ_API_KEY } from '@env';
// ─────────────────────────────────────────────────────────────────────────────
// 🔑  PASTE YOUR GROQ API KEY HERE
// Get it free from: https://console.groq.com
// ─────────────────────────────────────────────────────────────────────────────


const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant'; // Free & fast

const sortFilters = ['Highest Price', 'Cheapest', 'Best Rated', 'Nearest'];

// ── date range helper ─────────────────────────────────────────────────────────
const isAvailableForRange = (hostel: any, checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return true;
  const parseDate = (str: string) => {
    const months: any = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
    };
    const parts = str.split(' ');
    return `${parts[2]}-${months[parts[1]]}-${parts[0].padStart(2, '0')}`;
  };
  const start = new Date(parseDate(checkIn));
  const end = new Date(parseDate(checkOut));
  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    if (!hostel.availableDates.includes(dateStr)) return false;
    current.setDate(current.getDate() + 1);
  }
  return true;
};

// ── availability status helper ────────────────────────────────────────────────
const getHostelAvailStatus = (hostel: any): 'Available' | 'LastFew' | 'Full' => {
  const rooms = hostel.rooms ?? [];
  if (rooms.length === 0) return 'Available';
  let minPct = 100;
  for (const r of rooms) {
    const pct = (r.bookedBeds / r.totalBeds) * 100;
    if (pct < minPct) minPct = pct;
  }
  if (minPct === 100) return 'Full';
  if (minPct >= 70) return 'LastFew';
  return 'Available';
};

// ── count active filters ──────────────────────────────────────────────────────
const countActiveFilters = (f: FilterState): number => {
  let n = 0;
  if (f.priceRange[0] !== DEFAULT_FILTERS.priceRange[0] || f.priceRange[1] !== DEFAULT_FILTERS.priceRange[1]) n++;
  if (f.amenities.length > 0) n++;
  if (f.roomType !== 'All') n++;
  if (f.minRating > 0) n++;
  if (f.femaleSafe) n++;
  if (f.availabilityStatus !== 'All') n++;
  return n;
};

// ── Build a compact hostel summary string for the AI ─────────────────────────
const buildHostelContext = () => {
  return hostels.map(h => (
    `ID:${h.id} | "${h.name}" | ${h.location} | Rating:${h.rating} | ` +
    `DormFrom:₹${h.dormFrom} | PrivateFrom:₹${h.privateFrom} | ` +
    `Amenities:${h.amenities.join(',')} | ` +
    `FemaleSafe:${h.femaleFriendly ? 'yes' : 'no'} | ` +
    `Avail:${getHostelAvailStatus(h)} | Type:${h.type}`
  )).join('\n');
};

// ── Smart keyword fallback when AI is unavailable ────────────────────────────
const getKeywordFallback = (query: string): {
  filterOverrides: Partial<FilterState>;
  nameKeyword: string;
} => {
  const q = query.toLowerCase();
  const filterOverrides: Partial<FilterState> = {};
  let nameKeyword = '';

  if (q.match(/female|ladies|women|girl|lady/)) {
    filterOverrides.femaleSafe = true;
  }

  if (q.match(/\bavailable\b|free beds?|open/)) {
    filterOverrides.availabilityStatus = 'Available';
  } else if (q.match(/last few|filling|almost full/)) {
    filterOverrides.availabilityStatus = 'LastFew';
  }

  if (q.match(/best|top rated|highly rated|good rating/)) {
    filterOverrides.minRating = 8.0;
  }

  if (q.match(/cheap|budget|affordable|low price|inexpensive/)) {
    filterOverrides.priceRange = [DEFAULT_FILTERS.priceRange[0], 800];
    filterOverrides.priceType = 'Dorm';
  } else if (q.match(/luxury|premium|expensive|high end/)) {
    filterOverrides.priceRange = [2000, DEFAULT_FILTERS.priceRange[1]];
    filterOverrides.priceType = 'Private';
  }

  if (q.match(/\bdorm\b|dormitory|shared room/)) {
    filterOverrides.roomType = 'Dorm';
  } else if (q.match(/\bprivate\b|private room|own room/)) {
    filterOverrides.roomType = 'Private';
  }

  const amenityMap: Record<string, string> = {
    wifi: 'WiFi', 'wi-fi': 'WiFi',
    breakfast: 'Breakfast', food: 'Breakfast',
    ac: 'AC', 'air condition': 'AC',
    parking: 'Parking',
    pool: 'Pool', swimming: 'Pool',
    gym: 'Gym', fitness: 'Gym',
    locker: 'Lockers', lockers: 'Lockers',
  };
  const matchedAmenities: string[] = [];
  for (const [kw, amenity] of Object.entries(amenityMap)) {
    if (q.includes(kw) && !matchedAmenities.includes(amenity)) {
      matchedAmenities.push(amenity);
    }
  }
  if (matchedAmenities.length > 0) {
    filterOverrides.amenities = matchedAmenities;
  }

  const hasSemanticMatch = Object.keys(filterOverrides).length > 0;
  if (!hasSemanticMatch) {
    nameKeyword = query.trim();
  }

  return { filterOverrides, nameKeyword };
};

// ── AI Search using Groq (Llama 3.1 8B - Free) ───────────────────────────────
const searchWithGroq = async (query: string): Promise<number[]> => {
  const hostelContext = buildHostelContext();

  const prompt = `You are a smart hostel search assistant. A user is searching for hostels using natural language.
Based on the query, return ONLY the IDs of matching hostels as a JSON array.

HOSTEL DATA:
${hostelContext}

USER QUERY: "${query}"

RULES:
- Match based on name, location, amenities, price range, rating, female safety, availability, room type
- Price keywords: "cheap/budget" = under ₹800 dorm, "luxury/premium" = over ₹2000 private
- "female safe / ladies / women" → femaleSafe:yes
- "wifi/breakfast/AC/parking" → match amenities
- "best/top rated" → rating > 8.0
- "available" → Avail:Available
- "last few" → Avail:LastFew
- Match partial name spelling too (e.g. "social" matches "The Social Stays")
- If no hostel matches, return []

Respond ONLY with a valid JSON array of IDs like: [1, 3, 5]
No explanation, no markdown, just the array.`;

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a hostel search assistant. Always respond with only a valid JSON array of IDs. No explanation, no markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Groq API error');
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content ?? '[]';

  // Clean and parse
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const ids: number[] = JSON.parse(cleaned);
  return ids;
};

// ─────────────────────────────────────────────────────────────────────────────
// ── component ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ViewAllScreen({ navigation, route }: any) {
  const [search, setSearch] = useState('');
  const [activeSortFilter, setActiveSortFilter] = useState('');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<any>(null);
  const [filterPanelVisible, setFilterPanelVisible] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });

  // ── AI Search state ──────────────────────────────────────────────────────
  const [aiMode, setAiMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiResultIds, setAiResultIds] = useState<number[]>([]);
  const [aiQuery, setAiQuery] = useState('');

  // ── Fallback state (used when Groq fails) ────────────────────────────────
  const [fallbackMode, setFallbackMode] = useState(false);
  const [fallbackFilterOverrides, setFallbackFilterOverrides] = useState<Partial<FilterState>>({});
  const [fallbackNameKeyword, setFallbackNameKeyword] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    location = 'Manali',
    checkIn = '',
    checkOut = '',
    guests = 0,
    isFemaleOnly = false,
    activeTab = 'All',
  } = route.params || {};

  // ── Trigger AI search (debounced) ────────────────────────────────────────
  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    setAiError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length === 0) {
      setAiMode(false);
      setAiResultIds([]);
      setAiQuery('');
      setFallbackMode(false);
      setFallbackFilterOverrides({});
      setFallbackNameKeyword('');
      return;
    }

    if (text.trim().length < 3) {
      setAiMode(false);
      setFallbackMode(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setAiLoading(true);
      setAiMode(false);
      setFallbackMode(false);
      try {
        const ids = await searchWithGroq(text.trim());
        setAiResultIds(ids);
        setAiQuery(text.trim());
        setAiMode(true);
        setFallbackMode(false);
      } catch (err: any) {
        // ── Smart keyword fallback ──────────────────────────────────────────
        const { filterOverrides, nameKeyword } = getKeywordFallback(text.trim());
        setFallbackFilterOverrides(filterOverrides);
        setFallbackNameKeyword(nameKeyword);
        setFallbackMode(true);
        setAiMode(false);
        // Only show error banner if fallback also found nothing meaningful
        if (Object.keys(filterOverrides).length === 0 && nameKeyword === '') {
          setAiError(err.message || 'AI search failed');
        }
      } finally {
        setAiLoading(false);
      }
    }, 700);
  }, []);

  // ── Clear AI search ───────────────────────────────────────────────────────
  const clearSearch = () => {
    setSearch('');
    setAiMode(false);
    setAiResultIds([]);
    setAiQuery('');
    setAiError('');
    setFallbackMode(false);
    setFallbackFilterOverrides({});
    setFallbackNameKeyword('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    Keyboard.dismiss();
  };

  // ── Effective filters: merge applied + fallback overrides ─────────────────
  const effectiveFilters: FilterState = fallbackMode
    ? { ...appliedFilters, ...fallbackFilterOverrides }
    : appliedFilters;

  // ── filter pipeline ──────────────────────────────────────────────────────
  let basePool = aiMode
    ? hostels.filter(h => aiResultIds.includes(h.id))
    : hostels;

  let filtered = basePool
    .filter(h => (isFemaleOnly || effectiveFilters.femaleSafe) ? h.femaleFriendly === true : true)
    .filter(h => guests === 0 ? true : h.maxGuests >= guests)
    .filter(h => isAvailableForRange(h, checkIn, checkOut))
    .filter(h => activeTab === 'Bus' || activeTab === 'All' ? true : h.type === activeTab)
    .filter(h => {
      const price = effectiveFilters.priceType === 'Dorm' ? h.dormFrom : h.privateFrom;
      return price >= effectiveFilters.priceRange[0] && price <= effectiveFilters.priceRange[1];
    })
    .filter(h => effectiveFilters.minRating === 0 ? true : h.rating >= effectiveFilters.minRating)
    .filter(h => {
      if (effectiveFilters.roomType === 'All') return true;
      const targetRoom = h.rooms?.find((r: any) => r.type === effectiveFilters.roomType);
      if (!targetRoom) return false;
      const pct = (targetRoom.bookedBeds / targetRoom.totalBeds) * 100;
      return pct < 100;
    })
    .filter(h => {
      if (effectiveFilters.amenities.length === 0) return true;
      return effectiveFilters.amenities.every((a: string) => h.amenities.includes(a));
    })
    .filter(h => {
      if (effectiveFilters.availabilityStatus === 'All') return true;
      return getHostelAvailStatus(h) === effectiveFilters.availabilityStatus;
    });

  // Normal text search — only when NOT in AI mode and NOT in fallback mode with semantic filters
  if (!aiMode && search.trim().length > 0) {
    const keyword = fallbackMode ? fallbackNameKeyword : search.trim();
    if (keyword.length > 0) {
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(keyword.toLowerCase()) ||
        h.location.toLowerCase().includes(keyword.toLowerCase())
      );
    }
  }

  // ── Sort ─────────────────────────────────────────────────────────────────
  if (activeSortFilter === 'Highest Price') {
    filtered = [...filtered].sort((a, b) =>
      effectiveFilters.priceType === 'Private'
        ? b.privateFrom - a.privateFrom
        : b.dormFrom - a.dormFrom
    );
  } else if (activeSortFilter === 'Cheapest') {
    filtered = [...filtered].sort((a, b) =>
      effectiveFilters.priceType === 'Private'
        ? a.privateFrom - b.privateFrom
        : a.dormFrom - b.dormFrom
    );
  } else if (activeSortFilter === 'Best Rated') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const activeFilterCount = countActiveFilters(appliedFilters);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{location}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        {checkIn && checkOut && (
          <View style={styles.summaryChip}>
            <Icon name="calendar-today" size={13} color="#E8445A" />
            <Text style={styles.summaryText}>{checkIn} → {checkOut}</Text>
          </View>
        )}
        {guests > 0 && (
          <View style={styles.summaryChip}>
            <Icon name="people" size={13} color="#E8445A" />
            <Text style={styles.summaryText}>{guests} Guests</Text>
          </View>
        )}
        {isFemaleOnly && (
          <View style={styles.summaryChip}>
            <Icon name="female" size={13} color="#E8445A" />
            <Text style={styles.summaryText}>Female Only</Text>
          </View>
        )}
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        {aiLoading ? (
          <ActivityIndicator size="small" color="#E8445A" style={styles.searchIcon} />
        ) : (
          <Icon
            name={aiMode ? 'auto-awesome' : 'search'}
            size={20}
            color={aiMode ? '#E8445A' : '#aaa'}
            style={styles.searchIcon}
          />
        )}
        <TextInput
          style={styles.searchInput}
          placeholder={aiMode ? `AI: "${aiQuery}"` : 'Search by name, amenity, vibe...'}
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Icon name="close" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* AI Error Banner */}
      {aiError !== '' && (
        <View style={{
          marginHorizontal: 16,
          marginBottom: 4,
          padding: 8,
          backgroundColor: '#fff3f3',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ffd0d0',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}>
          <Icon name="warning" size={14} color="#E8445A" />
          <Text style={{ fontSize: 12, color: '#E8445A', flex: 1 }}>
            AI search unavailable. Using smart keyword search instead.
          </Text>
        </View>
      )}

      {/* Groq AI Badge — shown when AI is active */}
      {aiMode && (
        <View style={{
          marginHorizontal: 16,
          marginBottom: 4,
          padding: 8,
          backgroundColor: '#f0f8ff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#d0e8ff',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}>
          <Icon name="auto-awesome" size={14} color="#4A90D9" />
          <Text style={{ fontSize: 12, color: '#4A90D9', flex: 1 }}>
            Powered by Groq AI · Llama 3.1
          </Text>
        </View>
      )}

      {/* Filter Row */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {/* Filter button */}
          <TouchableOpacity
            style={[styles.filterChip, activeFilterCount > 0 && styles.filterChipActive]}
            onPress={() => setFilterPanelVisible(true)}
          >
            <Icon
              name="tune"
              size={14}
              color={activeFilterCount > 0 ? '#fff' : '#333'}
            />
            <Text style={[styles.filterText, activeFilterCount > 0 && styles.filterTextActive]}>
              {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
            </Text>
          </TouchableOpacity>

          {/* Sort chips */}
          {sortFilters.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeSortFilter === f && styles.filterChipActive]}
              onPress={() => setActiveSortFilter(prev => prev === f ? '' : f)}
            >
              <Text style={[styles.filterText, activeSortFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Count */}
      <Text style={styles.countText}>
        Showing <Text style={styles.countHighlight}>{filtered.length} Properties</Text>
        {(isFemaleOnly || effectiveFilters.femaleSafe) && <Text style={styles.countHighlight}> • Female Safe</Text>}
        {effectiveFilters.roomType !== 'All' && (
          <Text style={styles.countHighlight}> • {effectiveFilters.roomType} rooms</Text>
        )}
        {aiMode && <Text style={styles.countHighlight}> • AI Search</Text>}
        {fallbackMode && !aiMode && <Text style={styles.countHighlight}> • Smart Search</Text>}
      </Text>

      {/* No results */}
      {filtered.length === 0 && !aiLoading && (
        <View style={styles.emptyContainer}>
          <Icon name={aiMode ? 'auto-awesome' : 'search-off'} size={48} color="#ddd" />
          <Text style={styles.emptyTitle}>
            {aiMode ? 'No AI matches' : 'No hostels found'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {aiMode ? 'Try rephrasing your search' : 'Try adjusting your filters'}
          </Text>
          {(aiMode || fallbackMode || activeFilterCount > 0) && (
            <TouchableOpacity
              onPress={() => {
                clearSearch();
                const reset = { ...DEFAULT_FILTERS };
                setPendingFilters(reset);
                setAppliedFilters(reset);
              }}
              style={{ marginTop: 12, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#E8445A', borderRadius: 10 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Clear Search & Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Hostel list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const badge = item.rooms ? getAvailabilityBadge(item.rooms as Room[]) : null;
          const dormRoom = item.rooms?.find((r: any) => r.type === 'Dorm') as Room | undefined;
          const dormPct = dormRoom ? Math.round((dormRoom.bookedBeds / dormRoom.totalBeds) * 100) : null;

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.95}
              onPress={() => navigation.navigate('HostelDetail', { hostel: item })}
            >
              <Image source={item.image} style={styles.cardImage} resizeMode="cover" />

              {item.femaleFriendly && (
                <View style={styles.femaleSafeBadge}>
                  <Icon name="female" size={12} color="#fff" />
                  <Text style={styles.femaleSafeBadgeText}>Female Safe</Text>
                </View>
              )}

              {badge && (
                <View style={[styles.availBadge, { backgroundColor: badge.color }]}>
                  <Icon name={badge.icon} size={11} color="#fff" />
                  <Text style={styles.availBadgeText}>{badge.label}</Text>
                </View>
              )}

              <TouchableOpacity style={styles.wishlistBtn} onPress={() => toggleWishlist(item.id)}>
                <Icon
                  name={wishlist.includes(item.id) ? 'favorite' : 'favorite-border'}
                  size={20}
                  color="#E8445A"
                />
              </TouchableOpacity>

              <View style={styles.cardInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.hotelName} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Icon name="star" size={12} color="#fff" />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </View>
                </View>

                <View style={styles.locationRow}>
                  <Icon name="location-on" size={13} color="#aaa" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {item.amenities.map((a: string) => (
                      <View key={a} style={styles.amenityChip}>
                        <Text style={styles.amenityText}>{a}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {dormRoom && (
                  <View style={styles.availBarWrapper}>
                    <View style={styles.availBarRow}>
                      <Text style={styles.availBarLabel}>Dorms</Text>
                      <Text style={[
                        styles.availBarPct,
                        { color: dormPct === 100 ? '#FF3B30' : dormPct! >= 70 ? '#FF9500' : '#34C759' },
                      ]}>
                        {dormPct}% booked
                      </Text>
                    </View>
                    <View style={styles.availBarTrack}>
                      <View style={[
                        styles.availBarFill,
                        {
                          width: `${dormPct}%` as any,
                          backgroundColor: dormPct === 100 ? '#FF3B30' : dormPct! >= 70 ? '#FF9500' : '#34C759',
                        },
                      ]} />
                    </View>
                  </View>
                )}

                <View style={styles.divider} />

                <View style={styles.bottomRow}>
                  <View style={styles.priceSection}>
                    <View style={styles.priceCol}>
                      <Text style={styles.priceLabel}>Dorms from</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.priceMain}>₹{item.dormFrom}</Text>
                        <Text style={styles.priceOriginal}>₹{item.dormOriginal}</Text>
                      </View>
                      <Text style={styles.discountText}>
                        {Math.round((1 - item.dormFrom / item.dormOriginal) * 100)}% off
                      </Text>
                    </View>
                    <View style={styles.priceDivider} />
                    <View style={styles.priceCol}>
                      <Text style={styles.priceLabel}>Privates from</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.priceMain}>₹{item.privateFrom}</Text>
                        <Text style={styles.priceOriginal}>₹{item.privateOriginal}</Text>
                      </View>
                      <Text style={styles.discountText}>
                        {Math.round((1 - item.privateFrom / item.privateOriginal) * 100)}% off
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() => setSelectedHostel(item)}
                  >
                    <Text style={styles.selectBtnText}>See Avail.</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Availability Modal */}
      {selectedHostel && (
        <AvailabilityModal
          visible={!!selectedHostel}
          onClose={() => setSelectedHostel(null)}
          hostelName={selectedHostel.name}
          rooms={selectedHostel.rooms}
          dormFrom={selectedHostel.dormFrom}
          privateFrom={selectedHostel.privateFrom}
        />
      )}

      {/* Filter Panel */}
      <FilterPanel
        visible={filterPanelVisible}
        onClose={() => setFilterPanelVisible(false)}
        filters={pendingFilters}
        onChange={setPendingFilters}
        onApply={(f) => {
          setAppliedFilters(f);
          setPendingFilters(f);
        }}
        activeCount={activeFilterCount}
      />

    </View>
  );
}

export default ViewAllScreen;