import { Rect, Image, ImageProps, RectProps } from "react-native-svg";

type EquipmentMapAvailability = RectProps & {
    equipmentImage: ImageProps['href'] | string,
    availabilityColor: string
}

// e.g. <EquipmentMapAvailability equipmentImage={require('@/assets/images/bicepcurl-machine.png')} availabilityColor="red" />
export default function EquipmentMapAvailability({
    x,
    y,
    equipmentImage, 
    availabilityColor,
    ...rest
}: EquipmentMapAvailability) {
    return (
        <>
            <Rect x={x} y={y} width={22} height={13} fill={'grey'} rx={5} ry={5} {...rest} />
            <Image x={x+1} y={y+1} width={11} height={11} rx={11} ry={11} href={equipmentImage} />
            <Rect x={x+13} y={y+3} width={7} height={7} rx={12} ry={12} fill={availabilityColor ?? "red"} />
        </>
    );
}