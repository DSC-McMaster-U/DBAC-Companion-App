import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { 
  StyleSheet, 
  ViewProps, 
  TouchableOpacity,
  ScrollView,
  View, 
  TextInput,
  Text,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '@/components/ThemedText';
import Screen from '@/components/Screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// Define SectionType
type SectionType = 'Upper Section' | 'Lower Section';

function SearchBar() {
  return (
    <View style={styles.searchBar}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
        <AntDesign name='search1' size={21} color='black' />
        <TextInput placeholder="Search" />
      </View>
    </View>
  );
}

function FilterButton() {
  return (
    <TouchableOpacity style={styles.filterButton}>
      <ThemedText style={{ fontSize: 14, letterSpacing: -1 }}>Filters</ThemedText>
      <AntDesign name='filter' size={14} color='black' />
    </TouchableOpacity>
  );
}

type EquipmentCardProps = ViewProps & {
  equipmentID: number,
  available: boolean,
  equipmentPicture: any,
  setsLeft?: number,
  usedBy?: string
}

function EquipmentCard({ equipmentID, available, equipmentPicture, setsLeft, usedBy }: EquipmentCardProps) {
  return (
    <TouchableOpacity style={styles.equipmentCard}>
      <View style={{ width: 114, height: 138, backgroundColor: 'lightgray', borderRadius: 20 }} />
      <View style={{ height: 128, gap: 5 }}>
        <ThemedText type='subtitle'>Power Rack #{equipmentID}</ThemedText>
        {available ? (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark" size={24} color="#00a20d" />
            <ThemedText type='green'>Available</ThemedText>
          </View>
        ) : (
          <>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <FontAwesome5 name="exclamation-triangle" size={17} color="#f4a100" />
              <ThemedText type='yellow'>In Use</ThemedText>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <AntDesign name="clockcircle" size={17} color="#f4a100" />
              <ThemedText type='yellow'>{setsLeft} Sets Left</ThemedText>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <AntDesign name="questioncircle" size={17} color="#f4a100" />
              <ThemedText type='yellow'>Used by {usedBy}</ThemedText>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

function MapView() {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);

  const handleSectionPress = (section: SectionType) => {
    setSelectedSection(section);
  };

  const handleBackPress = () => {
    setSelectedSection(null);
  };

  return (
    <View style={styles.mapContainer}>
      {/* Conditionally render the full map or the detailed view of a selected section */}
        {!selectedSection ? (
          <Svg height="500" width="350" viewBox="0 0 120 140">
          {/* Upper Section - Adjusted coordinates */}
          <Path
            d="M10 10 
               L100 10 
               L110 30 
               L85 50 
               L85 60 
               L95 60 
               L95 70 
               L75 70 
               L65 90 
               L40 100 
               L10 100 
               Z"
            fill="#eaeaea"
            stroke="black"
            onPress={() => handleSectionPress('Upper Section')}
          />
  
          {/* Lower Section - Adjusted coordinates to connect without overlap */}
          <Path
            d="M15 100 
               H 70 
               L 90 120 
               V 130 
               H 15 
               Z"
            fill="#eaeaea"
            stroke="black"
            onPress={() => handleSectionPress('Lower Section')}
          />
        </Svg>
      ) : selectedSection === 'Upper Section' ? (
        // Detailed view for Upper Section
        <View style={styles.selectedSectionContainer}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Svg height="700" width="600" viewBox="0 0 100 100">
            {/* Replace with more detailed layout of the Upper Section */}
            <Path
               d="M10 10 
               L90 10 
               L100 20 
               L80 40 
               L80 50
               L90 50
               L90 60
               L75 60
               L70 80
               L50 90 
               L10 90 
               Z"
              fill="#eaeaea"
              stroke="black"
            />

            {/* Additional paths for internal layout, if needed */}
            <Path
              d="M20 20 H 40 V 30 H 20 Z"  // Example inner layout within Upper Section
              fill="#ccc"
              stroke="black"
            />
            <Path
              d="M50 20 H 70 V 30 H 50 Z"  // Another inner layout for equipment or area
              fill="#ccc"
              stroke="black"
            />
          </Svg>
        </View>
      ) : (
        // Detailed view for Lower Section
        <View style={styles.selectedSectionContainer}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Svg height="400" width="350" viewBox="0 0 100 100">
            {/* Replace with more detailed layout of the Lower Section */}
            <Path
              d="M10 60 H 60 L 80 80 V 90 H 10 Z" // This represents the detailed layout; replace with actual details
              fill="#eaeaea"
              stroke="black"
            />

            {/* Additional paths for internal layout, if needed */}
            <Path
              d="M20 70 H 40 V 80 H 20 Z"  // Example inner layout within Lower Section
              fill="#ccc"
              stroke="black"
            />
            <Path
              d="M50 70 H 70 V 80 H 50 Z"  // Another inner layout for equipment or area
              fill="#ccc"
              stroke="black"
            />
          </Svg>
        </View>
      )}
    </View>
  );
}


export default function PulseScreen() {
  const [isMapView, setIsMapView] = useState(false);

  return (
    <Screen style={styles.screen}>
      <View style={{ paddingTop: 30, paddingHorizontal: 10 }}>
        <ThemedText type='title' style={{ marginTop: 10 }}>Equipment</ThemedText>

        {/* Conditionally render Search and Filter based on isMapView */}
        {!isMapView && (
          <>
            <SearchBar />
            <FilterButton />
          </>
        )}
      </View>

      {/* Toggle between List View and Map View */}
      {isMapView ? (
        <MapView />
      ) : (
        <ScrollView style={{ width: "100%", marginTop: 20, paddingHorizontal: 10 }}>
          <EquipmentCard equipmentID={1} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
          <EquipmentCard equipmentID={2} available={false} equipmentPicture={require('@/assets/images/powerrack-1.png')} setsLeft={3} usedBy='Jack' />
          <EquipmentCard equipmentID={3} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
          <EquipmentCard equipmentID={4} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
        </ScrollView>
      )}

      <View style={styles.switchView}>
        <TouchableOpacity 
          style={[styles.switchButton, !isMapView && styles.activeSwitchButton]}
          onPress={() => setIsMapView(false)}
        >
          <ThemedText style={!isMapView ? styles.activeText : {}}>List View</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.switchButton, isMapView && styles.activeSwitchButton]}
          onPress={() => setIsMapView(true)}
        >
          <ThemedText style={isMapView ? styles.activeText : {}}>Map View</ThemedText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
    height: "100%"
  },
  searchBar: {
    width: '100%',
    height: 34,
    backgroundColor: '#eaeaea',
    margin: 'auto',
    marginTop: 15,
    borderRadius: 10,
    display: 'flex', 
    justifyContent: 'center',
    paddingLeft: 20,
  },
  filterButton: {
    width: 75,
    height: 25,
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  equipmentCard: {
    width: '100%',
    height: 170,
    backgroundColor: '#eaeaea',
    marginBottom: 20,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  switchView: {
    width: '80%',
    height: 40,
    backgroundColor: '#eaeaea',
    margin: "auto",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  switchButton: {
    width: "50%",
    height: '100%',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSwitchButton: {
    backgroundColor: 'white',
  },
  activeText: {
    color: 'black',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedSectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  sectionContent: {
    alignItems: 'center',
  },
});
