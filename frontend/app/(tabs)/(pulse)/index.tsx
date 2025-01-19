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
  Image
} from 'react-native';

import CircularProgressBar from '@/components/CircularProgressBar';
import Svg, { Path, Text as SvgText, ImageProps, Rect, G } from 'react-native-svg';
import { ThemedText } from '@/components/ThemedText';
import Screen from '@/components/Screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import IconText from '@/components/IconText';
import { iconTextGreen, iconTextYellow } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import EquipmentMapAvailability from '@/components/EquipmentMapAvailability';

// Define SectionType
type SectionType = 'Zone 1' | 'Zone 2' | 'Zone 3';

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

function EquipmentCard({equipmentID, available, equipmentPicture, setsLeft, usedBy}: EquipmentCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.equipmentCard}
      onPress={() => {
        router.push('/(pulse)/equipmenttabularmenu')
      }} >
      <Image style={{width: 114, height: 138, objectFit: 'contain', borderRadius: 20}} source={equipmentPicture} />
      <View style={{height: 128, gap: 5}}>
        <ThemedText type='subtitle'>Power Rack #{equipmentID}</ThemedText>
        {available ?
        <>
          <IconText text="Available" iconName="check" color={iconTextGreen} />
        </>
        :
        <>
          <IconText text="In Use" iconName="exclamation-triangle" color={iconTextYellow} />
          <IconText text={`${setsLeft} Sets Left`} iconName="clock" color={iconTextYellow}  />
          <IconText text={`Used by ${usedBy}`} iconName="question-circle" color={iconTextYellow} />
        </>
        }
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
    M5 55
    L78 55
    L90 70
    L78 85 
    L90 105
    L5 105
    Z
  `;

  const zone3Path = `
    M5 5
    L85 5
    L85 55
    L5 55
    Z
  `;

  return (
    <View style={{ position: 'relative', width: svgWidth, height: svgHeight }}>
      <Svg height={svgHeight} width={svgWidth} viewBox={viewBox}>
        <ZoneSection
          zone="Zone 3"
          pathData={zone3Path}
          occupancy="75"
          equipmentImages={[
            { x: '30', y: '30', width: '15', height: '15' },
            { x: '55', y: '30', width: '15', height: '15' },
          ]}
          onPress={() => onSectionPress('Zone 3')}
        />
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
        top: 230, 
        left: 115, 
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

      <View style={{ 
        position: 'absolute', 
        top: 70, 
        left: 115, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10, }}>
        <CircularProgressBar
          strokeWidth={7}
          label="Zone 3 Occupancy"
          progress={40} // Replace with dynamic value
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
        x={'15'}
        y={zone === 'Zone 1' ? '115' : zone === 'Zone 2' ? '70' : '20'}
        width="50"
        height={zone === 'Zone 1' ? '40' : '30'}
        fill="#e6e6e6"
        stroke="black"
        strokeWidth="0.5"
      />
      <SvgText
        x={'40'}
        y={zone === 'Zone 1' ? '130' : zone === 'Zone 2' ? '97' : '45'}
        fontSize="8"
        fill="black"
        textAnchor="middle"
      >
        {zone}
      </SvgText>

      {/* Icons for Zone 1, Zone 2, and Zone 3 */}
      {zone === 'Zone 1' && (
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

      {zone === 'Zone 2' && (
        <>
          <View style={{ position: 'absolute', top: 215, left: 75 }}>
            <MaterialCommunityIcons name="dumbbell" size={25} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 275, left: 75 }}>
            <MaterialCommunityIcons name="weight-lifter" size={25} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 275, left: 195 }}>
            <MaterialCommunityIcons name="run" size={25} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 215, left: 195 }}>
            <MaterialCommunityIcons name="human-handsup" size={25} color="black" />
          </View>
          
        </>
      )}

      {zone === 'Zone 3' && (
          <>
          <View style={{ position: 'absolute', top: 65, left: 75 }}>
            <MaterialCommunityIcons name="dumbbell" size={24} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 125, left: 75 }}>
            <MaterialCommunityIcons name="weight-lifter" size={24} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 65, left: 195 }}>
            <MaterialCommunityIcons name="run" size={24} color="black" />
          </View>
          <View style={{ position: 'absolute', top: 125, left: 195 }}>
            <MaterialCommunityIcons name="human-handsup" size={24} color="black" />
          </View>
          
        </>
      )}

      {/* Smaller Press Here Button - Top Left for Zone 2, Bottom Left for Zone 1 */}
      <Rect
        x={'7'}
        y={zone === 'Zone 1' ? '168' : zone === 'Zone 2' ? '57' : '7'}
        width="30"
        height="10"
        fill="#7a003c"
        opacity="1"
        rx="3"
        onPress={onPress}
      />
      <SvgText
        x={'22'}
        y={zone === 'Zone 1' ? '174' : zone === 'Zone 2' ? '63' : '13'}
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
    M 6.25 36.25 
    L 106.25 36.25 
    L 118.75 48.75 
    L 93.75 73.75 
    L 93.75 86.25 
    L 106.25 86.25 
    L 106.25 98.75 
    L 87.5 98.75 
    L 62.5 123.75 
    L 56.25 130 
    L 6.25 130 
    Z
  `;

  const zone2Path = `
    M 6 48 
    L 93.6 48 
    L 108 66 
    L 93.6 84 
    L 108 108 
    L 6 108 
    Z
  `;

  const zone3Path = `
    M 6.75 50.75 L 114.75 50.75 L 114.75 118.25 L 6.75 118.25 Z
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
              equipmentImages={[]}
            />
          ) : selectedSection === 'Zone 2' ? (
            <ZoneDetail
              zone="Zone 2"
              pathData={zone2Path}
              equipmentImages={[]}
            />
          ) : (
            <ZoneDetail
              zone="Zone 3"
              pathData={zone3Path}
              equipmentImages={[]}
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
  equipmentImages: { x: number, y: number, src: ImageProps['href'] | string, capacity?: Number }[];
};
function ZoneDetail({ zone, pathData, equipmentImages }: ZoneDetailProps): JSX.Element {
  return (
    <G>
      <SvgText
        x={'56.25'}
        y={'10'}
        fontSize="14"
        fill="black"
        fontWeight="bold"
        textAnchor="middle"
      >
        { zone }
      </SvgText>

      {/* Draw the zone path */}
      <Path d={pathData} fill="white" stroke="black" strokeWidth="0.5" />

      {
        equipmentImages.map(equipment => (
          <EquipmentMapAvailability
            x={equipment.x}
            y={equipment.y}
            equipmentImage={equipment.src}
            availabilityColor="green"
          />
        ))
      }
    </G>
  );
}



export default function PulseScreen(): JSX.Element {
  const [isMapView, setIsMapView] = useState(false);

  return (
    <Screen style={styles.screen}>
      <View style={{ paddingHorizontal: 10 }}>
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
  equipmentCard: { width: '100%', height: 170, gap: 10, backgroundColor: '#eaeaea', marginBottom: 20, alignItems: 'center', borderRadius: 20, flexDirection: 'row', padding: 10 },
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
    justifyContent: 'center',  
    paddingTop: 20,
    paddingBottom: 10,
  },
  navigationButtons: { flexDirection: 'row' },
  zoneButton: { marginHorizontal: 10, padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
  activeZoneButton: { backgroundColor: '#aaa' },
  zoneButtonText: { color: 'black', fontWeight: 'bold' },
  backButton: { backgroundColor: '#ccc', paddingVertical: 8, paddingHorizontal: 13, borderRadius: 5 },
  backButtonText: { color: 'black', fontWeight: 'bold' },
});
