import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
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
import { PanGestureHandler, GestureHandlerRootView, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

import bmachine from '@/assets/images/bicepcurl-machine.png';

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
  equipmentType: string;
  equipmentID: number;
  available: boolean;
  equipmentPicture: any;
  setsLeft?: number;
  usedBy?: string;
};

function EquipmentCard({equipmentType, equipmentID, available, equipmentPicture, setsLeft, usedBy}: EquipmentCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.equipmentCard}
      onPress={() => {
        router.push('/(pulse)/equipmenttabularmenu')
      }} >
      <Image style={{width: 114, height: 138, objectFit: 'contain', borderRadius: 20}} source={{uri: `http://localhost:8383/assets/images/${equipmentPicture}`}}  />
      <View style={{height: 128, gap: 5}}>
        <ThemedText type='subtitle'>#{equipmentType} #{equipmentID}</ThemedText>
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

  const handleSelectedSectionViewGesture = (e: PanGestureHandlerGestureEvent) => {
    const { translationX } = e.nativeEvent;

    if(translationX > 10)
      setSelectedSection(null);
  };

  return (
    <View style={styles.mapContainer}>
      {!selectedSection ? (
        <GymMap onSectionPress={handleSectionPress} />
      ) : (
        <GestureHandlerRootView style={{flex: 1}}>
          <PanGestureHandler onGestureEvent={handleSelectedSectionViewGesture}>
            <View style={{flex: 1}}>
              <SelectedSectionView
                selectedSection={selectedSection}
              />
            </View>
          </PanGestureHandler>
        </GestureHandlerRootView>
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
};

function SelectedSectionView({
  selectedSection,
}: SelectedSectionViewProps): JSX.Element {
  const svgWidth = 350;
  const svgHeight = 590;
  const viewBox = '0 0 120 180';

  const zone1Path = `
    M 6 4 
    L 108 4 
    L 117 25 
    L 105 36 
    L 105 50 
    L 116 50 
    L 116 71 
    L 105 71 
    L 98 95 
    L 99 187 
    L 7 187 
    Z
  `;

  const zone2Path = `
    M 6 4 
    L 100 4 
    L 114 61 
    L 89 89 
    L 110 187 
    L 7 187 
    Z
  `;

  const zone3Path = `
    M 7 19 
    L 114 19 
    L 114 170 
    L 7 170 
    Z
  `;

  const imageURI = (name: string) => {
    return `http://localhost:8383/assets/images/${name}`;
  };

  return (
    <View style={styles.selectedSectionContainer}>
      <View style={styles.svgContainer}>
        <Svg height={svgHeight} width={svgWidth} viewBox={viewBox}>
          {selectedSection === 'Zone 1' ? (
            <ZoneDetail
              zone="Zone 1"
              pathData={zone1Path}
              equipmentImages={[
                { id: 'machine1', x: 8, y: 173, src: imageURI('oblique-machine.png') },
                { id: 'machine2', x: 75.5, y: 173, src: imageURI('power-bench-machine.png') },

                { id: 'machine3', x: 8, y: 159, src: imageURI('leg-curl.png') },

                { id: 'machine5', x: 8, y: 145, src: imageURI('leg-extension.png') },
                { id: 'machine6', x: 75.5, y: 145, src: imageURI('leg-extension.png') },

                { id: 'machine7', x: 8, y: 131, src: imageURI('hip-abductor.png') },
                { id: 'machine8', x: 75.5, y: 131, src: imageURI('leg-curl.png') },

                { id: 'machine9', x: 8, y: 117, src: imageURI('pec-fly-machine.png') },
                { id: 'machine10', x: 75.5, y: 117, src: imageURI('incline-curl-machine.png') },

                { id: 'machine11', x: 8, y: 103, src: imageURI('seated-row.png') },
                { id: 'machine12', x: 30.5, y: 103, src: imageURI('nordic.png') },
                { id: 'machine14', x: 75.5, y: 103, src: imageURI('preacher-curl-machine.png') },

                { id: 'machine15', x: 8, y: 89, src: imageURI('lat-pulldown.png') },
                { id: 'machine16', x: 30.5, y: 89, src: imageURI('calf-raise.png') },
                { id: 'machine18', x: 75.5, y: 89, src: imageURI('preacher-tricep-pushdown.png') },

                { id: 'machine19', x: 8, y: 75, src: imageURI('incline-bicep-curl.png') },
                { id: 'machine20', x: 30.5, y: 75, src: imageURI('hack-squat.png') },
                { id: 'machine21', x: 53, y: 75, src: imageURI('belt-squat.png') },
                { id: 'machine22', x: 75.5, y: 75, src: imageURI('tricep-pushdown.png') },

                { id: 'machine23', x: 8, y: 61, src: imageURI('tricep-pushdown.png') },
                { id: 'machine24', x: 30.5, y: 61, src: imageURI('leg-press-45.png') },
                { id: 'machine25', x: 53, y: 61, src: imageURI('moving-leg-press.png') },
                { id: 'machine26', x: 75.5, y: 61, src: imageURI('lateral-raise-machine.png') },

                { id: 'machine27', x: 8, y: 47, src: imageURI('shoulder-press-machine.png') },
                { id: 'machine28', x: 30.5, y: 47, src: imageURI('pendulum-squat-machine.png') },
                { id: 'machine29', x: 53, y: 47, src: imageURI('vertical-squat.png') },
                { id: 'machine30', x: 75.5, y: 47, src: imageURI('shoulder-press-machine.png') },

                { id: 'machine31', x: 8, y: 33, src: imageURI('chest-press-gymleco.png') },
                { id: 'machine34', x: 75.5, y: 33, src: imageURI('chest-press-gymleco.png') },

                { id: 'machine36', x: 30.5, y: 19, src: imageURI('power-squat-machine.png') },
                { id: 'machine37', x: 53, y: 19, src: imageURI('super-squat-machine.png') },
                { id: 'machine38', x: 75.5, y: 19, src: imageURI('moving-leg-press.png') },

                { id: 'machine40', x: 30.5, y: 5, src: imageURI('independent-leg-ex.png') },
                { id: 'machine41', x: 53, y: 5, src: imageURI('independent-leg-curl.png') },
                { id: 'machine42', x: 75.5, y: 5, src: imageURI('lying-leg-curl.png') },
              ]}
            />
          ) : selectedSection === 'Zone 2' ? (
            <ZoneDetail
              zone="Zone 2"
              pathData={zone2Path}
              equipmentImages={[
                { id: 'machine1', x: 8, y: 173, src: imageURI('bench.png') },

                { id: 'machine2', x: 8, y: 159, src: imageURI('incline-bench.png') },

                { id: 'machine3', x: 8, y: 145, src: imageURI('decline-bench.png') },

                { id: 'machine4', x: 8, y: 131, src: imageURI('bench.png') },

                { id: 'machine5', x: 8, y: 117, src: imageURI('ab-bench.png') },
                { id: 'machine6', x: 30.5, y: 117, src: imageURI('assisted-dip.png') },
                { id: 'machine7', x: 53, y: 117, src: imageURI('assisted-dip.png') },

                { id: 'machine8', x: 8, y: 103, src: imageURI('bench.png') },
                { id: 'machine9', x: 30.5, y: 103, src: imageURI('lat-pulldown.png') },
                { id: 'machine10', x: 53, y: 103, src: imageURI('lat-pulldown.png') },

                { id: 'machine11', x: 8, y: 89, src: imageURI('bench.png') },
                { id: 'machine12', x: 30.5, y: 89, src: imageURI('cable-complex.png') },
                { id: 'machine13', x: 53, y: 89, src: imageURI('cable-complex.png') },

                { id: 'machine14', x: 8, y: 75, src: imageURI('bench.png') },
                { id: 'machine15', x: 30.5, y: 75, src: imageURI('cable-complex.png') },
                { id: 'machine16', x: 53, y: 75, src: imageURI('cable-complex.png') },

                { id: 'machine17', x: 8, y: 61, src: imageURI('bench.png') },
                { id: 'machine18', x: 30.5, y: 61, src: imageURI('lat-pulldown.png') },
                { id: 'machine19', x: 53, y: 61, src: imageURI('lat-pulldown.png') },

                { id: 'machine20', x: 8, y: 47, src: imageURI('bench.png') },
                { id: 'machine21', x: 30.5, y: 47, src: imageURI('cable-complex.png') },
                { id: 'machine22', x: 53, y: 47, src: imageURI('cable-complex.png') },

                { id: 'machine23', x: 8, y: 33, src: bmachine },
                { id: 'machine24', x: 30.5, y: 33, src: imageURI('cable-complex.png') },
                { id: 'machine25', x: 53, y: 33, src: imageURI('cable-complex.png') },

                { id: 'machine27', x: 30.5, y: 19, src: imageURI('lat-pulldown.png') },
                { id: 'machine28', x: 53, y: 19, src: imageURI('lat-pulldown.png') },

                { id: 'machine29', x: 8, y: 5, src: imageURI('bench.png') },
                { id: 'machine30', x: 30.5, y: 5, src: imageURI('cable-complex.png') },
                { id: 'machine31', x: 53, y: 5, src: imageURI('cable-complex.png') },
              ]}
            />
          ) : (
            <ZoneDetail
              zone="Zone 3"
              pathData={zone3Path}
              equipmentImages={[
                { id: 'machine1', x: 8, y: 156, src: imageURI('bench.png') },
                { id: 'machine2', x: 30.5, y: 156, src: imageURI('cable-complex.png') },
                { id: 'machine3', x: 53, y: 156, src: imageURI('cable-complex.png') },

                { id: 'machine4', x: 8, y: 142, src: imageURI('incline-bench.png') },
                { id: 'machine5', x: 30.5, y: 142, src: imageURI('lat-pulldown.png') },
                { id: 'machine6', x: 53, y: 142, src: imageURI('lat-pulldown.png') },

                { id: 'machine7', x: 8, y: 128, src: imageURI('bench.png') },
                { id: 'machine8', x: 30.5, y: 128, src: imageURI('pec-fly.png') },
                { id: 'machine9', x: 53, y: 128, src: imageURI('pec-fly.png') },

                { id: 'machine10', x: 8, y: 114, src: imageURI('decline-bench.png') },

                { id: 'machine11', x: 8, y: 100, src: imageURI('bench.png') },
                { id: 'machine12', x: 30.5, y: 100, src: imageURI('incline-chest-press-panatta.png') },
                { id: 'machine13', x: 53, y: 100, src: imageURI('calves-machine.png') },
                { id: 'machine14', x: 75.5, y: 100, src: imageURI('rear-delt-machine.png') },

                { id: 'machine15', x: 8, y: 86, src: imageURI('bench.png') },
                { id: 'machine16', x: 30.5, y: 86, src: imageURI('decline-chest-press-panatta.png') },
                { id: 'machine17', x: 53, y: 86, src: imageURI('shoulder-press-panatta.png') },
                { id: 'machine18', x: 75.5, y: 86, src: imageURI('lateral-raise-standing.png') },

                { id: 'machine19', x: 8, y: 72, src: imageURI('bench.png') },
                { id: 'machine20', x: 30.5, y: 72, src: imageURI('vertical-chest-press-panatta.png') },
                { id: 'machine21', x: 53, y: 72, src: imageURI('super-row.png') },
                { id: 'machine22', x: 75.5, y: 72, src: imageURI('smith-machine.png') },

                { id: 'machine23', x: 8, y: 58, src: imageURI('shoulder-bench-press.png') },
                { id: 'machine24', x: 30.5, y: 58, src: imageURI('chest-press-gymleco.png') },
                { id: 'machine25', x: 53, y: 58, src: imageURI('t-bar-row.png') },
                { id: 'machine26', x: 75.5, y: 58, src: imageURI('cable-complex.png') },

                { id: 'machine27', x: 8, y: 44, src: imageURI('preacher-curl.png') },
                { id: 'machine28', x: 30.5, y: 44, src: imageURI('super-high-row.png') },
                { id: 'machine29', x: 53, y: 44, src: imageURI('super-low-row.png') },
                { id: 'machine30', x: 75.5, y: 44, src: imageURI('cable-complex.png') },

                { id: 'machine31', x: 8, y: 30, src: imageURI('preacher-curl.png') },
                { id: 'machine32', x: 30.5, y: 30, src: imageURI('super-lat-pulldown-panatta-convergent.png') },
                { id: 'machine33', x: 53, y: 30, src: imageURI('circular-lat-pulldown.png') },
                { id: 'machine34', x: 75.5, y: 30, src: imageURI('preacher-curl.png') },
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
  equipmentImages: { id: string, x: number, y: number, src: ImageProps['href'] | string, capacity?: number }[];
};
function ZoneDetail({ zone, pathData, equipmentImages }: ZoneDetailProps): JSX.Element {
  return (
    <G>
      <SvgText
        x={'56.25'}
        y={'-1'}
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
            key={equipment.id}
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
          <EquipmentCard equipmentType="Power Rack" equipmentID={1} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={2} available={false} equipmentPicture='powerrack-1.png' setsLeft={3} usedBy="Jack" />
          <EquipmentCard equipmentType="Power Rack" equipmentID={3} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={4} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={5} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={6} available={false} equipmentPicture='powerrack-1.png' setsLeft={3} usedBy="Jack" />
          <EquipmentCard equipmentType="Power Rack" equipmentID={7} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={8} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={9} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={10} available={false} equipmentPicture='powerrack-1.png' setsLeft={3} usedBy="Jack" />
          <EquipmentCard equipmentType="Power Rack" equipmentID={11} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={12} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={13} available={false} equipmentPicture='powerrack-1.png' setsLeft={3} usedBy="Jack" />
          <EquipmentCard equipmentType="Power Rack" equipmentID={14} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={15} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={16} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={17} available={false} equipmentPicture='powerrack-1.png' setsLeft={3} usedBy="Jack" />
          <EquipmentCard equipmentType="Power Rack" equipmentID={18} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={19} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Power Rack" equipmentID={20} available={true} equipmentPicture='powerrack-1.png' />
          <EquipmentCard equipmentType="Preacher Curl" equipmentID={1} available={true} equipmentPicture='preacher-curl.png' />
          <EquipmentCard equipmentType="Preacher Curl" equipmentID={2} available={true} equipmentPicture='preacher-curl.png' />
          <EquipmentCard equipmentType="Super Lat Pulldown" equipmentID={1} available={true} equipmentPicture='super-lat-pulldown-panatta-convergent.png' />
          <EquipmentCard equipmentType="Super High Row" equipmentID={1} available={true} equipmentPicture='super-high-row.png' />
          <EquipmentCard equipmentType="Chest Press" equipmentID={1} available={true} equipmentPicture='chest-press-gymleco.png' />
          <EquipmentCard equipmentType="Chest Press" equipmentID={2} available={true} equipmentPicture='chest-press-gymleco.png' />
          <EquipmentCard equipmentType="Chest Press" equipmentID={3} available={true} equipmentPicture='chest-press-gymleco.png' />
          <EquipmentCard equipmentType="Vertical Chest Press" equipmentID={1} available={true} equipmentPicture='vertical-chest-press-panatta.png' />
          <EquipmentCard equipmentType="Decline Chest Press" equipmentID={1} available={true} equipmentPicture='decline-chest-press-panatta.png' />
          <EquipmentCard equipmentType="Incline Chest Press" equipmentID={1} available={true} equipmentPicture='incline-chest-press-panatta.png' />
          <EquipmentCard equipmentType="Circular Lat Pulldown" equipmentID={1} available={true} equipmentPicture='circular-lat-pulldown.png' />
          <EquipmentCard equipmentType="Super Low Row" equipmentID={1} available={true} equipmentPicture='super-low-row.png' />
          <EquipmentCard equipmentType="T Bar Row" equipmentID={1} available={true} equipmentPicture='t-bar-row.png' />
          <EquipmentCard equipmentType="Super Row Machine" equipmentID={1} available={true} equipmentPicture='super-row.png' />
          <EquipmentCard equipmentType="Shoulder Press (Panatta)" equipmentID={1} available={true} equipmentPicture='shoulder-press-panatta.png' />
          <EquipmentCard equipmentType="Shoulder Press (Panatta)" equipmentID={2} available={true} equipmentPicture='shoulder-press-panatta.png' />
          <EquipmentCard equipmentType="Shoulder Press Machine" equipmentID={3} available={true} equipmentPicture='shoulder-press-machine.png' />
          <EquipmentCard equipmentType="Calves Machine" equipmentID={1} available={true} equipmentPicture='calves-machine.png' />
          <EquipmentCard equipmentType="Hammer Curl" equipmentID={1} available={true} equipmentPicture='hammer-curl.png' />
          <EquipmentCard equipmentType="Pec Fly Cables" equipmentID={1} available={true} equipmentPicture='pec-fly.png' />
          <EquipmentCard equipmentType="Pec Fly Cables" equipmentID={2} available={true} equipmentPicture='pec-fly.png' />
          <EquipmentCard equipmentType="Pec Fly Cables" equipmentID={3} available={true} equipmentPicture='pec-fly.png' />
          <EquipmentCard equipmentType="Pec Fly Cables" equipmentID={4} available={true} equipmentPicture='pec-fly.png' />
          <EquipmentCard equipmentType="Cable Complex" equipmentID={1} available={true} equipmentPicture='cable-complex.png' />
          <EquipmentCard equipmentType="Cable Complex" equipmentID={2} available={true} equipmentPicture='cable-complex.png' />
          <EquipmentCard equipmentType="Cable Complex" equipmentID={3} available={true} equipmentPicture='cable-complex.png' />
          <EquipmentCard equipmentType="Cable Complex" equipmentID={4} available={true} equipmentPicture='cable-complex.png' />
          <EquipmentCard equipmentType="Cable Complex" equipmentID={5} available={true} equipmentPicture='cable-complex.png' />
          <EquipmentCard equipmentType="Cable Complex" equipmentID={6} available={true} equipmentPicture='cable-complex.png' />
          <EquipmentCard equipmentType="Smith Machine" equipmentID={1} available={true} equipmentPicture='smith-machine.png' />
          <EquipmentCard equipmentType="Lateral Standing Raise" equipmentID={1} available={true} equipmentPicture='lateral-raise-standing.png' />
          <EquipmentCard equipmentType="Rear Delt Machine" equipmentID={1} available={true} equipmentPicture='rear-delt-machine.png' />
          <EquipmentCard equipmentType="Assisted Dip" equipmentID={1} available={true} equipmentPicture='assisted-dip.png' />
          <EquipmentCard equipmentType="Tricep Pushdown" equipmentID={1} available={true} equipmentPicture='tricep-pushdown.png' />
          <EquipmentCard equipmentType="Tricep Pushdown" equipmentID={2} available={true} equipmentPicture='tricep-pushdown.png' />
          <EquipmentCard equipmentType="Incline Bicep Curl" equipmentID={1} available={true} equipmentPicture='incline-bicep-curl.png' />
          <EquipmentCard equipmentType="Lat Pulldown" equipmentID={1} available={true} equipmentPicture='lat-pulldown.png' />
          <EquipmentCard equipmentType="Row Machine" equipmentID={1} available={true} equipmentPicture='seated-row.png' />
          <EquipmentCard equipmentType="Pec Fly Machine" equipmentID={1} available={true} equipmentPicture='pec-fly-machine.png' />
          <EquipmentCard equipmentType="Hip Abductor Machine" equipmentID={1} available={true} equipmentPicture='hip-abductor.png' />
          <EquipmentCard equipmentType="Leg Extension Machine" equipmentID={1} available={true} equipmentPicture='leg-extension.png' />
          <EquipmentCard equipmentType="Leg Extension Machine" equipmentID={2} available={true} equipmentPicture='leg-extension.png' />
          <EquipmentCard equipmentType="Leg Curl Machine" equipmentID={1} available={true} equipmentPicture='leg-curl.png' />
          <EquipmentCard equipmentType="Leg Curl Machine" equipmentID={2} available={true} equipmentPicture='leg-curl.png' />
          <EquipmentCard equipmentType="Oblique Machine" equipmentID={1} available={true} equipmentPicture='oblique-machine.png' />
          <EquipmentCard equipmentType="Independent Leg Extension" equipmentID={1} available={true} equipmentPicture='independent-leg-ex.png' />
          <EquipmentCard equipmentType="Power Squat Machine" equipmentID={1} available={true} equipmentPicture='power-squat-machine.png' />
          <EquipmentCard equipmentType="Pendulum Squat Machine" equipmentID={1} available={true} equipmentPicture='pendulum-squat-machine.png' />
          <EquipmentCard equipmentType="Leg Press Machine (45 degrees)" equipmentID={1} available={true} equipmentPicture='leg-press-45.png' />
          <EquipmentCard equipmentType="Hack Squat Machine" equipmentID={1} available={true} equipmentPicture='hack-squat.png' />
          <EquipmentCard equipmentType="Calf Raise Machine" equipmentID={1} available={true} equipmentPicture='calf-raise.png' />
          <EquipmentCard equipmentType="Nordic Machine" equipmentID={1} available={true} equipmentPicture='nordic.png' />
          <EquipmentCard equipmentType="Independent Leg Curl" equipmentID={1} available={true} equipmentPicture='independent-leg-curl.png' />
          <EquipmentCard equipmentType="Super Squat Machine" equipmentID={1} available={true} equipmentPicture='super-squat-machine.png' />
          <EquipmentCard equipmentType="Vertical Squat Machine" equipmentID={1} available={true} equipmentPicture='vertical-squat.png' />
          <EquipmentCard equipmentType="Leg Press Machine" equipmentID={1} available={true} equipmentPicture='leg-press.png' />
          <EquipmentCard equipmentType="Belt Squat Machine" equipmentID={1} available={true} equipmentPicture='belt-squat.png' />
          <EquipmentCard equipmentType="Lying Leg Curl Machine" equipmentID={1} available={true} equipmentPicture='lying-leg-curl.png' />
          <EquipmentCard equipmentType="Leg Press Machine (Moving Seat)" equipmentID={1} available={true} equipmentPicture='moving-leg-press.png' />
          <EquipmentCard equipmentType="Lateral Raise Machine" equipmentID={1} available={true} equipmentPicture='lateral-raise-machine.png' />
          <EquipmentCard equipmentType="Preacher Tricep Pushdown Machine" equipmentID={1} available={true} equipmentPicture='preacher-tricep-pushdown.png' />
          <EquipmentCard equipmentType="Preacher Curl Machine" equipmentID={1} available={true} equipmentPicture='preacher-curl-machine.png' />
          <EquipmentCard equipmentType="Incline Curl Machine" equipmentID={1} available={true} equipmentPicture='incline-curl-machine.png' />
          <EquipmentCard equipmentType="Power Bench Machine" equipmentID={1} available={true} equipmentPicture='power-bench-machine.png' />
          {/* <EquipmentCard equipmentType="Squat Machine" equipmentID={1} available={true} equipmentPicture='vsquat-machine.png' />
          <EquipmentCard equipmentType="Squat Machine" equipmentID={2} available={true} equipmentPicture='vsquat-machine.png' />
          <EquipmentCard equipmentType="Bicep Curl Machine" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Bicep Curl Machine" equipmentID={2} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Chest Press Machine" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Tricep Pres Machine" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Hip Abductor Machine" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Hamstring Curl Machine" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Leg Extension Machine" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Leg Extension Machine" equipmentID={2} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Leg Extension Machine" equipmentID={3} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Lying Hamstring Curl" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Chest Fly Machine" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' />
          <EquipmentCard equipmentType="Lateral Raise Machine" equipmentID={1} available={true} equipmentPicture='bicepcurl-machine.png' /> */}
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
  navigationButtons: { flexDirection: 'row' },
  zoneButton: { marginHorizontal: 10, padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
  activeZoneButton: { backgroundColor: '#aaa' },
  zoneButtonText: { color: 'black', fontWeight: 'bold' },
  backButton: { backgroundColor: '#ccc', paddingVertical: 8, paddingHorizontal: 13, borderRadius: 5 },
  backButtonText: { color: 'black', fontWeight: 'bold' },
});
