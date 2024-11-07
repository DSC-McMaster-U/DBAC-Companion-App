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

import Svg, { Path, Text as SvgText, Rect, G, Image, Circle } from 'react-native-svg';

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
    <View style={styles.svgContainer}>
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
    </View>
  );
}

function getOccupancyColor(progress: number): string {
  if (progress <= 33) {
    return 'lime';
  } else if (progress <= 66) {
    return '#f4a100';
  } else {
    return 'red';
  }
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): { x: number, y: number } {
  const angleInRadians = ((angleInDegrees + 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? '0' : '1';
  const sweepFlag = endAngle > startAngle ? '1' : '0';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

type SvgSemiCircularProgressProps = {
  progress: number;
  radius: number;
  strokeWidth: number;
  color: string;
  x: number;
  y: number;
};

function SvgSemiCircularProgress({
  progress,
  radius,
  strokeWidth,
  color,
  x,
  y,
}: SvgSemiCircularProgressProps): JSX.Element {
  const startAngle = 0;
  const endAngle = 180;

  const backgroundPath = describeArc(0, 0, radius, startAngle, endAngle);
  const progressEndAngle = startAngle + (progress / 100) * (endAngle - startAngle);
  const progressPath = describeArc(0, 0, radius, startAngle, progressEndAngle);

  return (
    <G transform={`translate(${x}, ${y})`}>
      <Path d={backgroundPath} stroke="#e6e6e6" strokeWidth={strokeWidth} fill="none" />
      <Path d={progressPath} stroke={color} strokeWidth={strokeWidth} fill="none" />
      <SvgText x={0} y={radius / 2} fontSize={radius / 2.5} fill="black" textAnchor="middle" alignmentBaseline="middle">
        {`${progress}%`}
      </SvgText>
    </G>
  );
}

type ZoneSectionProps = {
  zone: SectionType;
  pathData: string;
  occupancy: string;
  equipmentImages: { x: string; y: string; width: string; height: string }[];
  onPress: () => void;
};

function ZoneSection({ zone, pathData, occupancy, equipmentImages, onPress }: ZoneSectionProps): JSX.Element {
  return (
    <G onPress={onPress}>
      <Path d={pathData} fill="white" stroke="black" strokeWidth="0.5" />
      <Rect x={zone === 'Zone 1' ? '15' : '20'} y={zone === 'Zone 1' ? '115' : '30'} width="50" height={zone === 'Zone 1' ? '40' : '50'} fill="#e6e6e6" stroke="black" strokeWidth="0.5" />
      <SvgText x={zone === 'Zone 1' ? '40' : '45'} y={zone === 'Zone 1' ? '130' : '45'} fontSize="8" fill="black" textAnchor="middle">
        {zone}
      </SvgText>
      {equipmentImages.map((img, index) => (
        <Image key={index} x={img.x} y={img.y} width={img.width} height={img.height} href={require('./../../assets/images/powerrack-1.png')} />
      ))}
      <SvgSemiCircularProgress progress={parseInt(occupancy)} radius={10} strokeWidth={2} color={getOccupancyColor(parseInt(occupancy))} x={zone === 'Zone 1' ? 40 : 45} y={zone === 'Zone 1' ? 145 : 60} />
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
        <View style={styles.navigationButtons}>
          <TouchableOpacity onPress={() => onZoneSwitch('Zone 1')} style={[styles.zoneButton, selectedSection === 'Zone 1' && styles.activeZoneButton]}>
            <Text style={styles.zoneButtonText}>Zone 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onZoneSwitch('Zone 2')} style={[styles.zoneButton, selectedSection === 'Zone 2' && styles.activeZoneButton]}>
            <Text style={styles.zoneButtonText}>Zone 2</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.svgContainer}>
        <Svg height={svgHeight} width={svgWidth} viewBox={viewBox}>
          {selectedSection === 'Zone 1' ? (
            <ZoneDetail zone="Zone 1" pathData={zone1Path} occupancy="50" equipmentImages={[{ x: '20', y: '160', width: '15', height: '15' }, { x: '65', y: '160', width: '15', height: '15' }]} />
          ) : (
            <ZoneDetail zone="Zone 2" pathData={zone2Path} occupancy="75" equipmentImages={[{ x: '25', y: '60', width: '15', height: '15' }, { x: '50', y: '60', width: '15', height: '15' }]} />
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
      <Path d={pathData} fill="white" stroke="black" strokeWidth="0.5" />
      <Rect x={zone === 'Zone 1' ? '15' : '20'} y={zone === 'Zone 1' ? '115' : '30'} width="50" height={zone === 'Zone 1' ? '40' : '50'} fill="#e6e6e6" stroke="black" strokeWidth="0.5" />
      <SvgText x={zone === 'Zone 1' ? '40' : '45'} y={zone === 'Zone 1' ? '130' : '45'} fontSize="10" fill="black" textAnchor="middle">
        {zone}
      </SvgText>
      {equipmentImages.map((img, index) => (
        <Image key={index} x={img.x} y={img.y} width={img.width} height={img.height} href={require('./../../assets/images/powerrack-1.png')} />
      ))}
      <SvgSemiCircularProgress progress={parseInt(occupancy)} radius={15} strokeWidth={3} color={getOccupancyColor(parseInt(occupancy))} x={zone === 'Zone 1' ? 40 : 45} y={zone === 'Zone 1' ? 150 : 65} />
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
  mapContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  selectedSectionContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  svgContainer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20 },
  navigationButtons: { flexDirection: 'row' },
  zoneButton: { marginHorizontal: 10, padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
  activeZoneButton: { backgroundColor: '#aaa' },
  zoneButtonText: { color: 'black', fontWeight: 'bold' },
  backButton: { backgroundColor: '#ccc', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  backButtonText: { color: 'black', fontWeight: 'bold' },
});
