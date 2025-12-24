import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

import { RootState, AppDispatch } from '../store';
import {
  fetchEvents,
  setSelectedCity,
  setSelectedGenre,
  setSearchQuery,
  toggleEventLike,
} from '../store/eventsSlice';

const { width } = Dimensions.get('window');

const cities = [
  { id: 'all', name: 'All Cities', emoji: '🇲🇪' },
  { id: 'podgorica', name: 'Podgorica', emoji: '🏛️' },
  { id: 'bar', name: 'Bar', emoji: '🏖️' },
  { id: 'niksic', name: 'Nikšić', emoji: '🏔️' },
  { id: 'cetinje', name: 'Cetinje', emoji: '👑' },
  { id: 'berane', name: 'Berane', emoji: '🌲' },
  { id: 'bijelo-polje', name: 'Bijelo Polje', emoji: '🌊' },
  { id: 'kolasin', name: 'Kolašin', emoji: '⛷️' },
];

const genres = [
  'All',
  'Live Music',
  'DJ Set',
  'Festival',
  'Club Night',
  'Concert',
  'Party',
];

interface EventCardProps {
  event: any;
  onPress: () => void;
  onLike: () => void;
  isLiked: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress, onLike, isLiked }) => {
  const handleLike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLike();
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.eventCard}>
      <Image
        source={{ uri: event.image }}
        style={styles.eventImage}
        contentFit="cover"
        transition={300}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.eventGradient}
      >
        <View style={styles.eventDateBadge}>
          <Text style={styles.eventDateDay}>{format(new Date(event.date), 'd')}</Text>
          <Text style={styles.eventDateMonth}>{format(new Date(event.date), 'MMM').toUpperCase()}</Text>
        </View>

        <TouchableOpacity onPress={handleLike} style={styles.eventLikeButton}>
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#EC4899' : '#fff'}
          />
        </TouchableOpacity>

        <View style={styles.eventInfo}>
          <View style={styles.eventGenreTags}>
            {event.genres?.map((genre: string, index: number) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreTagText}>{genre}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
          <Text style={styles.eventVenue} numberOfLines={1}>{event.venue}</Text>
          
          <View style={styles.eventDetails}>
            <View style={styles.eventDetailItem}>
              <Icon name="time-outline" size={14} color="#999" />
              <Text style={styles.eventDetailText}>{event.time}</Text>
            </View>
            <View style={styles.eventDetailItem}>
              <Icon name="location-outline" size={14} color="#999" />
              <Text style={styles.eventDetailText}>{event.location}</Text>
            </View>
          </View>

          {event.djs && event.djs.length > 0 && (
            <Text style={styles.eventDJs} numberOfLines={1}>
              🎧 {event.djs.join(' • ')}
            </Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function EventsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  
  const {
    filteredEvents,
    loading,
    selectedCity,
    selectedGenre,
    searchQuery,
    likedEvents,
  } = useSelector((state: RootState) => state.events);

  const [refreshing, setRefreshing] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchEvents());
    setRefreshing(false);
  }, [dispatch]);

  const handleCitySelect = (cityId: string) => {
    dispatch(setSelectedCity(cityId));
    setShowCityPicker(false);
  };

  const handleGenreSelect = (genre: string) => {
    dispatch(setSelectedGenre(genre === 'All' ? null : genre));
  };

  const handleEventPress = (event: any) => {
    navigation.navigate('EventDetails' as never, { eventId: event.id } as never);
  };

  const handleEventLike = (eventId: string) => {
    dispatch(toggleEventLike(eventId));
  };

  const featuredEvents = filteredEvents.filter(e => e.featured).slice(0, 5);
  const upcomingEvents = filteredEvents.filter(e => !e.featured);

  const selectedCityData = cities.find(c => c.id === selectedCity) || cities[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Discover Events</Text>
            <TouchableOpacity
              onPress={() => setShowCityPicker(true)}
              style={styles.locationButton}
            >
              <Icon name="location" size={16} color="#8B5CF6" />
              <Text style={styles.locationText}>
                {selectedCityData.emoji} {selectedCityData.name}
              </Text>
              <Icon name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events, artists, venues..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={(text) => dispatch(setSearchQuery(text))}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => dispatch(setSearchQuery(''))}>
              <Icon name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Genre Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreFilters}
          contentContainerStyle={styles.genreFiltersContent}
        >
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre}
              onPress={() => handleGenreSelect(genre)}
              style={[
                styles.genreChip,
                (selectedGenre === genre || (genre === 'All' && !selectedGenre)) && styles.genreChipActive
              ]}
            >
              <Text style={[
                styles.genreChipText,
                (selectedGenre === genre || (genre === 'All' && !selectedGenre)) && styles.genreChipTextActive
              ]}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
        ) : (
          <>
            {/* Featured Events */}
            {featuredEvents.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>🔥 Featured Tonight</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={featuredEvents}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.featuredCardWrapper}>
                      <EventCard
                        event={item}
                        onPress={() => handleEventPress(item)}
                        onLike={() => handleEventLike(item.id)}
                        isLiked={likedEvents.includes(item.id)}
                      />
                    </View>
                  )}
                  contentContainerStyle={styles.featuredList}
                />
              </View>
            )}

            {/* Upcoming Events */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📅 Upcoming Events</Text>
                <Text style={styles.eventCount}>{upcomingEvents.length} events</Text>
              </View>
              
              {upcomingEvents.length === 0 ? (
                <View style={styles.emptyState}>
                  <Icon name="calendar-outline" size={48} color="#666" />
                  <Text style={styles.emptyTitle}>No events found</Text>
                  <Text style={styles.emptyText}>
                    Try adjusting your filters or check back later
                  </Text>
                  <TouchableOpacity
                    style={styles.clearFiltersButton}
                    onPress={() => {
                      dispatch(setSelectedCity('all'));
                      dispatch(setSelectedGenre(null));
                      dispatch(setSearchQuery(''));
                    }}
                  >
                    <Text style={styles.clearFiltersText}>Clear Filters</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.eventsList}>
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onPress={() => handleEventPress(event)}
                      onLike={() => handleEventLike(event.id)}
                      isLiked={likedEvents.includes(event.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* City Picker Modal */}
      {showCityPicker && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCityPicker(false)}
        >
          <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />
          <TouchableOpacity activeOpacity={1} style={styles.cityPickerModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select City</Text>
            
            {cities.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={[
                  styles.cityOption,
                  selectedCity === city.id && styles.cityOptionActive
                ]}
                onPress={() => handleCitySelect(city.id)}
              >
                <Text style={styles.cityEmoji}>{city.emoji}</Text>
                <Text style={[
                  styles.cityName,
                  selectedCity === city.id && styles.cityNameActive
                ]}>
                  {city.name}
                </Text>
                {selectedCity === city.id && (
                  <Icon name="checkmark" size={20} color="#8B5CF6" />
                )}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
  },
  genreFilters: {
    maxHeight: 50,
    marginBottom: 20,
  },
  genreFiltersContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  genreChipActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  genreChipText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  genreChipTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
  },
  eventCount: {
    color: '#666',
    fontSize: 14,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredCardWrapper: {
    marginRight: 15,
    width: width * 0.8,
  },
  eventsList: {
    paddingHorizontal: 20,
    gap: 20,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    height: 280,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  eventGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  eventDateBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  eventDateDay: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDateMonth: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  eventLikeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 20,
  },
  eventInfo: {
    gap: 6,
  },
  eventGenreTags: {
    flexDirection: 'row',
    gap: 6,
  },
  genreTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  genreTagText: {
    color: '#8B5CF6',
    fontSize: 11,
    fontWeight: '500',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventVenue: {
    color: '#EC4899',
    fontSize: 14,
    fontWeight: '500',
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 15,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailText: {
    color: '#999',
    fontSize: 12,
  },
  eventDJs: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  clearFiltersButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  cityPickerModal: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cityOptionActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  cityEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  cityName: {
    color: '#999',
    fontSize: 16,
    flex: 1,
  },
  cityNameActive: {
    color: '#fff',
    fontWeight: '500',
  },
});
