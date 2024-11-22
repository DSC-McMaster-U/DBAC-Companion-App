import { Image, View, ViewProps, StyleSheet} from "react-native";

type EquipmentMapAvailability = ViewProps & {
    equipmentImage: any,
    availabilityColor: string
}

// e.g. <EquipmentMapAvailability equipmentImage={require('@/assets/images/bicepcurl-machine.png')} availabilityColor="red" />
export default function EquipmentMapAvailability({equipmentImage, availabilityColor}: EquipmentMapAvailability) {
    return (
    <View style={styles.icon}>
        <Image style={{width: 25, height: 25, objectFit: 'contain'}} source={equipmentImage} />
        <View style={[styles.availability, {backgroundColor: availabilityColor ?? "red"}]}></View>
    </View>)
}

const styles = StyleSheet.create({
    icon: {
        width: 45,
        height: 24,
        backgroundColor: 'gray',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    availability: {
        width: 13,
        height: 13,
        borderRadius: 25,
    }
})