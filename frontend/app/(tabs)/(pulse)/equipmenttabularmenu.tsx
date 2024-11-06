import React, { useState } from "react";
import { 
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewProps,
    ScrollView
} from "react-native";

import { iconTextGreen, iconTextYellow, maroon, red } from "@/constants/Colors";
import PowerRack from '@/assets/images/powerrack-1.png';

import Screen from "@/components/Screen";
import CheckBox from "@/components/CheckBox";
import IconText from "@/components/IconText";

const MAX_SETS_LEFT = 10;

/**************************************EQUIPMENT TABULAR SCREEN SECTION*************************************/
type EquipmentTabularMenuScreenSectionProps = ViewProps & {
    title: string
}

function EquipmentTabularMenuScreenSection({title, style, children, ...rest} : EquipmentTabularMenuScreenSectionProps) {
    return (
        <View style={[styles.sectionStyle, style]} { ...rest }>
            <Text style={styles.sectionTitleStyle}>{ title }</Text>
            { children }
        </View>
    )
}

/**************************************EQUIPMENT TABULAR SCREEN AVAILABILITY MENU*************************************/
type EquipmentAvailabilityMenuProps = ViewProps & {
    isAvailable: boolean,
    setsLeft: number,
    workinAvailable: boolean
}

function EquipmentAvailabilityMenu({ isAvailable, setsLeft, workinAvailable, style, ...rest } : EquipmentAvailabilityMenuProps) {
    return (
        <View style={[styles.equipmentAvailabilityMenuViewStyle, style]} { ...rest }>
            {
                isAvailable ? (
                    <>
                        <IconText text="Available" iconName="check" color={iconTextGreen} />
                    </>
                ) : (
                    <>
                        <IconText text="In Use" iconName="exclamation-triangle" color={iconTextYellow} />
                        <IconText text={`${setsLeft} Sets Left`} iconName="exclamation-triangle" color={iconTextYellow} />
                        
                        {
                            workinAvailable ? (
                                <>
                                    <IconText text="Work In" iconName="check" color={iconTextGreen} />
                                </>
                            ) : (
                                <>
                                    <IconText text="Work In" iconName="times" color={red} />
                                </>
                            )
                        }
                    </>
                ) 
            }
        </View>
    );
}

/**************************************EQUIPMENT TABULAR SCREEN USING USERS SECTION*************************************/
type UsingUser = {
    username: string,
    exercise: string
}

type UsingUserCardProps = ViewProps & {
    user: UsingUser
}

function UsingUserCard({user, style, ...rest} : UsingUserCardProps) {
    const { username, exercise } = user

    return (
        <View style={[styles.userCardStyle, style]} { ...rest }>
            <Text style={styles.userCardUsernameTextStyle}>{ username }</Text>
            <Text style={styles.userCardExerciseTextStyle}>Exercise: { exercise }</Text>
        </View>
    )
}

type UsedBySectionProps = ViewProps & {
    usingUsers: UsingUser[]
}

function UsedBySection({usingUsers, style, ...rest} : UsedBySectionProps) {
    return (
        <EquipmentTabularMenuScreenSection title='Used By' { ...rest }>
            <View style={[{gap: 10}, style]}>
                {
                    usingUsers.map(user => (
                        <UsingUserCard key={user.username} user={user} />
                    ))
                }
            </View>
        </EquipmentTabularMenuScreenSection>
    );
}

/**************************************EQUIPMENT TABULAR SCREEN POSSIBLE EXERSIZES SECTION*************************************/ 
type Exercise = {
    name: string
}

type PossibleExerciseCardProps = ViewProps & {
    exercise: Exercise
}

function PossibleExerciseCard({ exercise, style, ...rest } : PossibleExerciseCardProps) {
    const { name: exerciseName } = exercise;
    
    return (
        <View style={[styles.possibleExerciseCardStyle, style]} { ...rest }>
            <Text style={styles.possibleExerciseNameTextStyle}>{ exerciseName }</Text>
        </View>
    );
}

type PossibleExercisesSectionProps = ViewProps & {
    exercises: Exercise[]
}

function PossibleExercisesSection({ exercises, style, ...rest } : PossibleExercisesSectionProps) {
    return (
        <EquipmentTabularMenuScreenSection title="Possible Exercises" { ...rest }>
            <View style={[{gap: 10}, style]}>
                {
                    exercises.map(exercise => (
                        <PossibleExerciseCard key={exercise.name} exercise={exercise} />
                    ))
                }
            </View>
        </EquipmentTabularMenuScreenSection>
    );
}

/**************************************EQUIPMENT TABULAR SCREEN WORKOUT CONTROLS SECTION*************************************/
type WorkoutControlsSectionProps = ViewProps & {
    setsLeft: number,
    setSetsLeft: (arg0: number) => void,
    workinAvailable: boolean,
    setWorkinAvailable: (arg0: boolean) => void
}

function WorkoutControlsSection({ 
    setsLeft, 
    setSetsLeft, 
    workinAvailable, 
    setWorkinAvailable 
} : WorkoutControlsSectionProps) {
    const workinAvailableToggle = () => setWorkinAvailable(!workinAvailable);
    const decrementSetsLeft = () => setSetsLeft(setsLeft-1);
    const incrementSetsLeft = () => setSetsLeft(setsLeft+1);

    return (
        <EquipmentTabularMenuScreenSection title="Workout Controls">
            <View style={styles.workoutControlsSectionViewStyle}>
                <View style={styles.workoutControlsSetsLeftStyle}>
                    <TouchableOpacity
                        style={[
                            styles.workoutControlsIncrementButtonStyle, 
                            setsLeft == 0 && {backgroundColor: '#ccc'}
                        ]}
                        onPress={decrementSetsLeft}
                        disabled={setsLeft === 0}>
                        <Text style={styles.workoutControlsIncrementButtonTextStyle}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.workoutControlsTextStyle}>{`${setsLeft} Sets Left`}</Text>

                    <TouchableOpacity
                        style={[
                            styles.workoutControlsIncrementButtonStyle, 
                            setsLeft == MAX_SETS_LEFT && {backgroundColor: '#ccc'}
                        ]}
                        onPress={incrementSetsLeft}
                        disabled={setsLeft == MAX_SETS_LEFT}>
                        <Text style={styles.workoutControlsIncrementButtonTextStyle}>+</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={workinAvailableToggle}>
                    <CheckBox 
                        value={workinAvailable}
                        onValueChange={setWorkinAvailable}
                        color={workinAvailable ? '#00a20d' : '#FF0000'}
                        text="Work In Available?"
                        textStyle={styles.workoutControlsTextStyle} />
                </TouchableOpacity>
            </View>
        </EquipmentTabularMenuScreenSection>
    );
}

/**************************************EQUIPMENT TABULAR SCREEN BUTTONS*************************************/
type EquipmentTabularMenuButton = TouchableOpacityProps & {
    text: string,
    textColor: string,
    color: string,
    onPress: () => void
}

function EquipmentTabularMenuButton({ text, textColor, color, onPress, style, ...rest } : EquipmentTabularMenuButton) {
    return (
        <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: color }, style]} onPress={onPress} { ...rest }>
            <Text style={[styles.buttonTextStyle, {color: textColor}]}>{text}</Text>
        </TouchableOpacity>
    );
}

type EquipmentTabularMenuButtonsProps = ViewProps & {
    isAvailable: boolean,
    setAvailability: (arg0: boolean) => void,
    workinAvailable: boolean,
    setWorkinAvailable: (arg0: boolean) => void,
    isUserUsingMachine: boolean, 
    setIsUserUsingMachine: (arg0: boolean) => void
}

function EquipmentTabularMenuButtons({ 
    isAvailable,
    setAvailability,
    workinAvailable,
    setWorkinAvailable,
    isUserUsingMachine,
    setIsUserUsingMachine,
    style,
    ...rest
} : EquipmentTabularMenuButtonsProps) {
    return (
        <View style={[styles.buttonsViewStyle, style]} { ...rest }>
            {
                isAvailable ? (
                    <EquipmentTabularMenuButton 
                        text="Use Machine" 
                        textColor="#FFFFFF" 
                        color={maroon} 
                        onPress={() => setAvailability(false)} />
                ) : (
                    <>
                        {
                            isUserUsingMachine ? (
                                <EquipmentTabularMenuButton 
                                    text="Complete Workout" 
                                    textColor='#FFFFFF' 
                                    color={maroon} 
                                    onPress={() => {
                                        setAvailability(true);
                                        setIsUserUsingMachine(false);
                                    }} />
                            ) : (
                                <>
                                    <EquipmentTabularMenuButton 
                                        text="Join Queue" 
                                        textColor='#FFFFFF' 
                                        color={maroon} 
                                        onPress={() => {setWorkinAvailable(!workinAvailable)}} />
                                        
                                    { 
                                        workinAvailable && 
                                        <EquipmentTabularMenuButton 
                                            text="Work In" 
                                            textColor={maroon} 
                                            color='#a28c8c' 
                                            onPress={() => {
                                                setIsUserUsingMachine(true);
                                            }} /> 
                                    }
                                </>
                            )
                        }
                    </>
                )
            }
        </View>
    );
}

/**************************************EQUIPMENT TABULAR SCREEN*************************************/
export default function EquipmentTabularMenuScreen() {
    let [isAvailable, setIsAvailable] = useState(true);
    let [workinAvailable, setWorkinAvailable] = useState(true);
    let [isUserCurrentlyUsing, setIsUserCurrentlyUsing] = useState(false);
    let [setsLeft, setSetsLeft] = useState(3);

    let [usingUsers, setUsingUsers] = useState([
        {
            username: 'Ryan',
            exercise: 'Incline Bench'
        },
        {
            username: 'Aarav',
            exercise: 'Incline Bench'
        }
    ]);

    let [exercises, setExercises] = useState([
        {name: 'Squat'}, 
        {name: 'Incline Bench'}, 
        {name: 'Barbell Back Squat'}, 
        {name: 'Bench Press'}
    ]);


    return (
        <Screen style={styles.screen}>
            <ScrollView>
                <View style={styles.contaier}>
                    <Text style={styles.machineNameTextStyle}>Power Rack #1</Text>

                    <View style={styles.machineImageContainer}>
                        <Image source={ PowerRack } style={styles.machineImageStyle} />
                    </View>

                    <EquipmentAvailabilityMenu 
                        style={styles.availabilityMenuStyle} 
                        isAvailable={isAvailable} 
                        setsLeft={setsLeft} 
                        workinAvailable={workinAvailable} />
                    
                    { /* Render used by section only if the machine is being used */ }
                    { !isAvailable && <UsedBySection usingUsers={usingUsers} /> }

                    { /* Render the workout controls if the user is currently using this machine */ }
                    { 
                        isUserCurrentlyUsing && 
                        <WorkoutControlsSection
                            setsLeft={setsLeft}
                            setSetsLeft={setSetsLeft}
                            workinAvailable={workinAvailable}
                            setWorkinAvailable={setWorkinAvailable} /> 
                    }

                    <PossibleExercisesSection exercises={exercises} />
                </View>
            </ScrollView>
            <EquipmentTabularMenuButtons 
                isAvailable={isAvailable} 
                setAvailability={setIsAvailable} 
                workinAvailable={workinAvailable}
                setWorkinAvailable={setWorkinAvailable}
                isUserUsingMachine={isUserCurrentlyUsing}
                setIsUserUsingMachine={setIsUserCurrentlyUsing} />
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contaier: {
        flex: 1,
        paddingBottom: '20%'
    },
    machineNameTextStyle: {
        fontFamily: 'Poppins',
        fontSize: 34,
        fontWeight: '600',
        color: maroon,
        margin: 10
    },
    sectionStyle: {
        marginHorizontal: 10,
        marginVertical: 5
    },
    sectionTitleStyle: {
        fontFamily: 'Poppins',
        fontSize: 24,
        fontWeight: 'regular',
        color: maroon
    },
    machineImageContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    machineImageStyle: {
        width: '70%',
        height: '70%',
        resizeMode: 'cover',
        aspectRatio: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    equipmentAvailabilityMenuViewStyle: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: '3%'
    },
    availabilityMenuStyle: {
        margin: 10
    },
    userCardStyle: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: '3%',
        justifyContent: 'space-between',
        backgroundColor: '#f1f1f1',
        borderRadius: 10
    },
    userCardUsernameTextStyle: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: 'regular',
        color: maroon
    },
    userCardExerciseTextStyle: {
        fontFamily: 'Poppins',
        fontSize: 16,
        fontWeight: 'regular',
        color: maroon
    },
    possibleExerciseCardStyle: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding: '3%',
        backgroundColor: '#f1f1f1',
        borderRadius: 10
    },
    possibleExerciseNameTextStyle: {
        fontFamily: 'Poppins',
        fontSize: 16,
        fontWeight: 'regular',
        color: maroon
    },
    buttonsViewStyle: {
        backgroundColor: '#00000000',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        marginBottom: 10,
        padding: 10,
        gap: 10
    },
    buttonStyle: {
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    buttonTextStyle: {
        fontFamily: 'Poppins',
        fontSize: 18,
        fontWeight: 'regular'
    },
    workoutControlsSectionViewStyle: {
        backgroundColor: '#f1f1f1', 
        flexDirection: 'row', 
        padding: 20, 
        borderRadius: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 40
    },
    workoutControlsTextStyle: {
        fontFamily: 'Poppins',
        fontSize: 16,
        fontWeight: 'regular',
        color: maroon
    },
    workoutControlsIncrementButtonStyle: {
        width: 25,
        height: 25,
        borderRadius: 25/2,
        backgroundColor: maroon,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    workoutControlsIncrementButtonTextStyle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold'
    },
    workoutControlsSetsLeftStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    }
});