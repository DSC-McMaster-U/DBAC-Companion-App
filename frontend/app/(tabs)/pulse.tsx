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
          <Svg height="450" width="300" viewBox="0 0 120 160">
            {/* Upper Section - New design similar to the provided image */}
            <Path
              d="M10 10 
              L90 10
              L90 40
              L83 40
              L95 55
              L83 70 
              L95 90
              L80 90
              L70 90
              L40 90
              L10 90
              Z"
              fill="white"  
              stroke="black"
              strokeWidth="0.5"
              onPress={() => handleSectionPress('Upper Section')}
            />
            
            {/* Lower Section - Adjusted coordinates to align with upper section */}
            <Path
              d="M10 80 
              L90 80 
              L100 90 
              L80 110 
              L80 120
              L90 120
              L90 130
              L75 130
              L55 150
              L50 155 
              L10 155 
              Z"
              fill="white"  
              stroke="black"
              strokeWidth="0.5"  // Thinner stroke
              onPress={() => handleSectionPress('Lower Section')}
            />
          </Svg>
        ) : selectedSection === 'Lower Section' ? (
          // Detailed view for Lower Section wrapped in ScrollView
          <ScrollView contentContainerStyle={styles.selectedSectionContainer}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
  
            <Svg style={{ height: '100%', width: '100%' }} viewBox="0 0 120 140">
              <Path
                 d="M10 80 
                 L90 80 
                 L100 90 
                 L80 110 
                 L80 120
                 L90 120
                 L90 130
                 L75 130
                 L55 150
                 L50 155 
                 L10 155 
                 Z"
                fill="white"  
                stroke="black"
                strokeWidth="0.5"  // Thinner stroke
              />
            </Svg>
          </ScrollView>
        ) : (
          // Detailed view for Upper Section wrapped in ScrollView
          <ScrollView contentContainerStyle={styles.selectedSectionContainer}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
  
            <Svg height="600" width="400" viewBox="0 0 120 140">
              <Path
                d="M10 10 
                L90 10
                L90 40
                L83 40
                L95 55
                L83 70 
                L95 90
                L80 90
                L70 90
                L40 90
                L10 90
                Z"
                fill="white"  
                stroke="black"
                strokeWidth="0.5"  // Thinner stroke
              />
            </Svg>
          </ScrollView>
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
      padding: 0,
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
