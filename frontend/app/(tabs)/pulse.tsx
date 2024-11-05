import { 
  StyleSheet, 
  ViewProps, 
  TouchableOpacity,
  ScrollView,
  View, 
  Image, 
  ImageSourcePropType,
  TextInput,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import Screen from '@/components/Screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import IconText from '@/components/IconText';
import { iconTextGreen, iconTextYellow } from '@/constants/Colors';

function SearchBar() {
  return (
    <View style={styles.searchBar}>
      <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
        <AntDesign name='search1' size={21} color='black' />
        <TextInput placeholder="Search"></TextInput>
      </View>
    </View>
  )
}

function FilterButton() {
  return (
    <TouchableOpacity style={styles.filterButton}>
      <ThemedText style={{fontSize: 14, letterSpacing: -1}}>Filters</ThemedText>
      <AntDesign name='filter' size={14} color='black' />
    </TouchableOpacity>
  )
}

type EquipmentCardProps = ViewProps & {
  equipmentID: number,
  available: boolean,
  equipmentPicture: ImageSourcePropType
  setsLeft?: number,
  usedBy?: string
}

function EquipmentCard({equipmentID, available, equipmentPicture, setsLeft, usedBy}: EquipmentCardProps) {
  return (
    <TouchableOpacity style={styles.equipmentCard}>
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
  )
}

export default function PulseScreen() {
  return (
    <Screen style={styles.screen}>
      <View style={{paddingHorizontal: 10}}>
        <ThemedText type='title' style={{marginTop: 10}}>Equipment</ThemedText>
        <SearchBar />
        <FilterButton />
      </View>
      <ScrollView style={{width: "100%", marginTop: 20, paddingHorizontal: 10}}>
        <EquipmentCard equipmentID={1} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
        <EquipmentCard equipmentID={2} available={false} equipmentPicture={require('@/assets/images/powerrack-1.png')} setsLeft={3} usedBy='Jack' />
        <EquipmentCard equipmentID={3} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
        <EquipmentCard equipmentID={4} available={true} equipmentPicture={require('@/assets/images/powerrack-1.png')} />
      </ScrollView>
      <View style={styles.switchView}>
        <TouchableOpacity  style={{width: "50%", height: '100%', backgroundColor: 'white', borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <ThemedText>List View</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={{width: "50%", height: '100%', borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <ThemedText style={{color: "#5F5F5F"}}>Map View</ThemedText>
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
  }
});
