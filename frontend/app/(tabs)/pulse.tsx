import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
  Text,
} from 'react-native';

import CircularProgressBar from '@/components/CircularProgressBar';
import Svg, { Path, Text as SvgText, Rect, G, Image } from 'react-native-svg';
import { ThemedText } from '@/components/ThemedText';
import Screen from '@/components/Screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// Define SectionType
type SectionType = 'Zone 1' | 'Zone 2';

function SearchBar(): JSX.Element {
  return (
    <View style={styles.searchBar}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AntDesign name="search1" size={21} color="black" />
        <TextInput placeholder="Search" style={{ marginLeft: 5 }} />
      </View>
    </View>
  );
}

function FilterButton(): JSX.Element {
  return (
    <TouchableOpacity style={styles.filterButton}>
      <ThemedText style={{ fontSize: 14, letterSpacing: -1 }}>Filters</ThemedText>
      <AntDesign name="filter" size={14} color="black" style={{ marginLeft: 5 }} />
    </TouchableOpacity>
  );
}

type EquipmentCardProps = ViewProps & {
  equipmentID: number;
  available: boolean;
  equipmentPicture: any;
  setsLeft?: number;
  usedBy?: string;
};

function EquipmentCard({
  equipmentID,
  available,
  equipmentPicture,
  setsLeft,
  usedBy,
}: EquipmentCardProps): JSX.Element {
  return (
    <TouchableOpacity style={styles.equipmentCard}>
      <View style={{ width: 114, height: 138, backgroundColor: 'lightgray', borderRadius: 20 }} />
      <View style={{ height: 128, justifyContent: 'center' }}>
        <ThemedText type="subtitle">Power Rack #{equipmentID}</ThemedText>
        {available ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark" size={24} color="#00a20d" />
            <ThemedText type="green" style={{ marginLeft: 5 }}>
              Available
            </ThemedText>
          </View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="exclamation-triangle" size={17} color="#f4a100" />
              <ThemedText type="yellow" style={{ marginLeft: 5 }}>
                In Use
              </ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="clockcircle" size={17} color="#f4a100" />
              <ThemedText type="yellow" style={{ marginLeft: 5 }}>
                {setsLeft} Sets Left
              </ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="questioncircle" size={17} color="#f4a100" />
              <ThemedText type="yellow" style={{ marginLeft: 5 }}>
                Used by {usedBy}
              </ThemedText>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

function MapView(): JSX.Element {
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);

  const handleSectionPress = (section: SectionType): void => {
    setSelectedSection(section);
  };

  const handleBackPress = (): void => {
    setSelectedSection(null);
  };

  const handleZoneSwitch = (zone: SectionType): void => {
    setSelectedSection(zone);
  };

  return (
    <View style={styles.mapContainer}>
      {!selectedSection ? (
        <GymMap onSectionPress={handleSectionPress} />
      ) : (
        <SelectedSectionView
          selectedSection={selectedSection}
          onBackPress={handleBackPress}
          onZoneSwitch={handleZoneSwitch}
        />
      )}
    </View>
  );
}

type GymMapProps = {
  onSectionPress: (section: SectionType) => void;
};

function GymMap({ onSectionPress }: GymMapProps): JSX.Element {
  const svgWidth = 350;
  const svgHeight = 550;
  const viewBox = '0 0 100 180';

  const zone1Path = `
    M5 105 
    L85 105 
    L95 115 
    L75 135 
    L75 145
    L85 145
    L85 155
    L70 155
    L50 175
    L45 180 
    L5 180 
    Z
  `;

  const zone2Path = `
    M5 5 
    L85 5
    L85 55
    L78 55
    L90 70
    L78 85 
    L90 105
    L75 105
    L65 105
    L35 105
    L5 105
    Z
  `;

  return (
    <View style={{ position: 'relative', width: svgWidth, height: svgHeight }}>
      <Svg height={svgHeight} width={svgWidth} viewBox={viewBox}>
        <ZoneSection
          zone="Zone 2"
          pathData={zone2Path}
          occupancy="75"
          equipmentImages={[
            { x: '30', y: '60', width: '15', height: '15' },
            { x: '55', y: '60', width: '15', height: '15' },
          ]}
          onPress={() => onSectionPress('Zone 2')}
        />
        <ZoneSection
          zone="Zone 1"
          pathData={zone1Path}
          occupancy="50"
          equipmentImages={[
            { x: '30', y: '165', width: '15', height: '15' },
            { x: '55', y: '165', width: '15', height: '15' },
          ]}
          onPress={() => onSectionPress('Zone 1')}
        />
      </Svg>

      {/* Overlay the CircularProgressBars */}
      <View style={{ 
        position: 'absolute', 
        top: 415, 
        left: 115,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
      }}>
        <CircularProgressBar
          strokeWidth={7}
          label="Zone 1 Occupancy"
          progress={50} // Replace with dynamic value
          style={{ width: 60, height: 60 }}
        />
      </View>

      <View style={{ 
        position: 'absolute', 
        top: 155, 
        left: 130, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10, }}>
        <CircularProgressBar
          strokeWidth={7}
          label="Zone 2 Occupancy"
          progress={75} // Replace with dynamic value
          style={{ width: 60, height: 60 }}
        />
      </View>
    </View>
  );
}


type ZoneSectionProps = {
  zone: SectionType;
  pathData: string;
  occupancy: string;
  equipmentImages: { x: string; y: string; width: string; height: string }[];
  onPress: () => void;
};

function ZoneSection({ zone, pathData, occupancy, onPress }: ZoneSectionProps): JSX.Element {
  return (
    <G onPress={onPress}>
      {/* Define zone path and background */}
      <Path d={pathData} fill="white" stroke="black" strokeWidth="0.5" />

      {/* Zone label */}
      <Rect
        x={zone === 'Zone 1' ? '15' : '15'}
        y={zone === 'Zone 1' ? '115' : '30'}
        width="50"
        height={zone === 'Zone 1' ? '40' : '50'}
        fill="#e6e6e6"
        stroke="black"
        strokeWidth="0.5"
      />
      <SvgText
        x={zone === 'Zone 1' ? '40' : '40'}
        y={zone === 'Zone 1' ? '130' : '45'}
        fontSize="8"
        fill="black"
        textAnchor="middle"
      >
        {zone}
      </SvgText>

      {/* Icons for Zone 1 and Zone 2 */}
      {zone === 'Zone 1' && (
        <>
          <View style={{ position: 'absolute', top: 150, left: 80 }}>
            <MaterialCommunityIcons name="dumbbell" size={25} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 218, left: 80 }}>
            <MaterialCommunityIcons name="weight-lifter" size={25} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 218, left: 195 }}>
            <MaterialCommunityIcons name="run" size={25} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 150, left: 195 }}>
            <MaterialCommunityIcons name="human-handsup" size={25} color="black" />
          </View>
          
        </>
      )}
      {zone === 'Zone 2' && (
          <>
          <View style={{ position: 'absolute', top: 400, left: 75 }}>
            <MaterialCommunityIcons name="dumbbell" size={24} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 448, left: 75 }}>
            <MaterialCommunityIcons name="weight-lifter" size={24} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 400, left: 195 }}>
            <MaterialCommunityIcons name="run" size={24} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 448, left: 195 }}>
            <MaterialCommunityIcons name="human-handsup" size={24} color="black" />
          </View>
          
        </>
      )}

      {/* Smaller Press Here Button - Top Left for Zone 2, Bottom Left for Zone 1 */}
      <Rect
        x={zone === 'Zone 1' ? '7' : '7'}
        y={zone === 'Zone 1' ? '168' : '7'}
        width="30"
        height="10"
        fill="#7a003c"
        opacity="1"
        rx="3"
        onPress={onPress}
      />
      <SvgText
        x={zone === 'Zone 1' ? '22' : '22'}
        y={zone === 'Zone 1' ? '174' : '13'}
        fontSize="4"
        fill="white"
        fontWeight="bold"
        textAnchor="middle"
        onPress={onPress}
      >
        Press Here
      </SvgText>
    </G>
  );
}




type SelectedSectionViewProps = {
  selectedSection: SectionType;
  onBackPress: () => void;
  onZoneSwitch: (zone: SectionType) => void;
};

function SelectedSectionView({
  selectedSection,
  onBackPress,
  onZoneSwitch,
}: SelectedSectionViewProps): JSX.Element {
  const svgWidth = 350;
  const svgHeight = 550;
  const viewBox = '0 0 120 180';

  const zone1Path = `
    M10 100 
    L90 100 
    L100 110 
    L80 130 
    L80 140
    L90 140
    L90 150
    L75 150
    L55 170
    L50 175 
    L10 175 
    Z
  `;

  const zone2Path = `
    M10 10 
    L90 10
    L90 60
    L83 60
    L95 75
    L83 90 
    L95 110
    L80 110
    L70 110
    L40 110
    L10 110
    Z
  `;

  return (
    <View style={styles.selectedSectionContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.svgContainer}>
        <Svg height={svgHeight} width={svgWidth} viewBox={viewBox}>
          {selectedSection === 'Zone 1' ? (
            <ZoneDetail
              zone="Zone 1"
              pathData={zone1Path}
              occupancy="50"
              equipmentImages={[
                { x: '20', y: '160', width: '15', height: '15' },
                { x: '65', y: '160', width: '15', height: '15' },
              ]}
            />
          ) : (
            <ZoneDetail
              zone="Zone 2"
              pathData={zone2Path}
              occupancy="75"
              equipmentImages={[
                { x: '25', y: '60', width: '15', height: '15' },
                { x: '50', y: '60', width: '15', height: '15' },
              ]}
            />
          )}
        </Svg>
      </View>
    </View>
  );
}

type ZoneDetailProps = {
  zone: SectionType;
  pathData: string;
  occupancy: string;
  equipmentImages: { x: string; y: string; width: string; height: string }[];
};
function ZoneDetail({ zone, pathData, occupancy, equipmentImages }: ZoneDetailProps): JSX.Element {
  return (
    <G>
      {/* Draw the zone path */}
      <Path d={pathData} fill="white" stroke="black" strokeWidth="0.5" />
      <Rect
        x={zone === 'Zone 1' ? '15' : '20'}
        y={zone === 'Zone 1' ? '115' : '30'}
        width="50"
        height={zone === 'Zone 1' ? '40' : '50'}
        fill="#e6e6e6"
        stroke="black"
        strokeWidth="0.5"
      />
      <SvgText
        x={zone === 'Zone 1' ? '40' : '45'}
        y={zone === 'Zone 1' ? '130' : '45'}
        fontSize="10"
        fill="black"
        textAnchor="middle"
      >
        {zone}
      </SvgText>

      {/* CircularProgressBar for Zone 1 and Zone 2 */}
      {zone === 'Zone 1' ? (
        <View style={{ 
          position: 'absolute', 
          top: 400, 
          left: 90, 
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 10,
         }}>
          <CircularProgressBar
            strokeWidth={7}
            label="Zone 1 Occupancy"
            progress={parseInt(occupancy)}
            style={{ width: 60, height: 60 }}
          />
        </View>
      ) : (
        <View style={{ 
          position: 'absolute', 
          top: 160, 
          left: 103,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 10,
         }}>
          <CircularProgressBar
            strokeWidth={7}
            label="Zone 2 Occupancy"
            progress={parseInt(occupancy)}
            style={{ width: 60, height: 60 }}
          />
        </View>
      )}

      {zone === 'Zone 1' && (
        <>
        <View style={{ position: 'absolute', top: 395, left: 50 }}>
          <MaterialCommunityIcons name="dumbbell" size={24} color="black" />
        </View>
        <View style={{ position: 'absolute', top: 435, left: 50 }}>
          <MaterialCommunityIcons name="weight-lifter" size={24} color="black" />
        </View>
        <View style={{ position: 'absolute', top: 395, left: 165 }}>
          <MaterialCommunityIcons name="run" size={24} color="black" />
        </View>
        <View style={{ position: 'absolute', top: 435, left: 165 }}>
          <MaterialCommunityIcons name="human-handsup" size={24} color="black" />
        </View>
        
      </>

      )}
      {zone === 'Zone 2' && (
        <>
        <View style={{ position: 'absolute', top: 150, left: 65 }}>
          <MaterialCommunityIcons name="dumbbell" size={25} color="black" />
        </View>
        <View style={{ position: 'absolute', top: 218, left: 65 }}>
          <MaterialCommunityIcons name="weight-lifter" size={25} color="black" />
        </View>
        <View style={{ position: 'absolute', top: 218, left: 178 }}>
          <MaterialCommunityIcons name="run" size={25} color="black" />
        </View>
        <View style={{ position: 'absolute', top: 150, left: 178 }}>
          <MaterialCommunityIcons name="human-handsup" size={25} color="black" />
        </View>
      </>
      )}
    </G>
  );
}



export default function PulseScreen(): JSX.Element {
  const [isMapView, setIsMapView] = useState(false);

  return (
    <Screen style={styles.screen}>
      <View style={{ paddingTop: 30, paddingHorizontal: 10 }}>
        <ThemedText type="title" style={{ marginTop: 10 }}>
          Equipment
        </ThemedText>

        {!isMapView && (
          <>
            <SearchBar />
            <FilterButton />
          </>
        )}
      </View>

      {isMapView ? (
        <MapView />
      ) : (
        <ScrollView style={{ width: '100%', marginTop: 20, paddingHorizontal: 10 }}>
          <EquipmentCard equipmentID={1} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
          <EquipmentCard equipmentID={2} available={false} equipmentPicture={require('@/assets/images/powerrack-1.png')} setsLeft={3} usedBy="Jack" />
          <EquipmentCard equipmentID={3} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
          <EquipmentCard equipmentID={4} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
        </ScrollView>
      )}

      <View style={styles.switchView}>
        <TouchableOpacity style={[styles.switchButton, !isMapView && styles.activeSwitchButton]} onPress={() => setIsMapView(false)}>
          <ThemedText style={!isMapView ? styles.activeText : {}}>List View</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.switchButton, isMapView && styles.activeSwitchButton]} onPress={() => setIsMapView(true)}>
          <ThemedText style={isMapView ? styles.activeText : {}}>Map View</ThemedText>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: 'white', flex: 1 },
  searchBar: { width: '100%', height: 34, backgroundColor: '#eaeaea', marginTop: 15, borderRadius: 10, justifyContent: 'center', paddingLeft: 20 },
  filterButton: { width: 75, height: 25, backgroundColor: '#eaeaea', borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  equipmentCard: { width: '100%', height: 170, backgroundColor: '#eaeaea', marginBottom: 20, borderRadius: 20, flexDirection: 'row', padding: 10 },
  switchView: { width: '80%', height: 40, backgroundColor: '#eaeaea', alignSelf: 'center', marginTop: 10, marginBottom: 10, borderRadius: 10, flexDirection: 'row', padding: 2 },
  switchButton: { width: '50%', height: '100%', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  activeSwitchButton: { backgroundColor: 'white' },
  activeText: { color: 'black' },
  mapContainer: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  selectedSectionContainer: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  svgContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { 
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center',  // Centers the "Back" button horizontally
    paddingTop: 20,
    paddingBottom: 10,  // Optional: Adds some spacing below the button
  },
  navigationButtons: { flexDirection: 'row' },
  zoneButton: { marginHorizontal: 10, padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
  activeZoneButton: { backgroundColor: '#aaa' },
  zoneButtonText: { color: 'black', fontWeight: 'bold' },
  backButton: { backgroundColor: '#ccc', paddingVertical: 8, paddingHorizontal: 13, borderRadius: 5 },
  backButtonText: { color: 'black', fontWeight: 'bold' },
});
