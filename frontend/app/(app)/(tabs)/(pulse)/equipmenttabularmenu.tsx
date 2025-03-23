import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ScrollView,
} from "react-native";

import { iconTextGreen, iconTextYellow, maroon, red } from "@/constants/Colors";
import Screen from "@/components/Screen";
import CheckBox from "@/components/CheckBox";
import IconText from "@/components/IconText";
import { useLocalSearchParams } from "expo-router";
import axios from 'axios';
import { API_URL, buildAPIURL } from "@/hooks/useBuildAPIURL";
import { useAuth } from "@/components/AuthContext";
import { useSocket } from "@/components/SocketContext";

// Update the axios baseURL and service methods
const api = axios.create({
  baseURL: API_URL,
});
const MAX_SETS_LEFT = 10;

/**************************************EQUIPMENT TABULAR SCREEN SECTION*************************************/
type EquipmentTabularMenuScreenSectionProps = ViewProps & {
  title: string;
};

function EquipmentTabularMenuScreenSection({
  title,
  style,
  children,
  ...rest
}: EquipmentTabularMenuScreenSectionProps) {
  return (
    <View style={[styles.sectionStyle, style]} {...rest}>
      <Text style={styles.sectionTitleStyle}>{title}</Text>
      {children}
    </View>
  );
}

/**************************************EQUIPMENT TABULAR SCREEN AVAILABILITY MENU*************************************/
type EquipmentAvailabilityMenuProps = ViewProps & {
  isAvailable: boolean;
  setsLeft: number;
  workinAvailable: boolean;
};

function EquipmentAvailabilityMenu({
  isAvailable,
  setsLeft,
  workinAvailable,
  style,
  ...rest
}: EquipmentAvailabilityMenuProps) {
  return (
    <View style={[styles.equipmentAvailabilityMenuViewStyle, style]} {...rest}>
      {isAvailable ? (
        <>
          <IconText text="Available" iconName="check" color={iconTextGreen} />
        </>
      ) : (
        <>
          <IconText
            text="In Use"
            iconName="exclamation-triangle"
            color={iconTextYellow}
          />
          <IconText
            text={`${setsLeft} Sets Left`}
            iconName="exclamation-triangle"
            color={iconTextYellow}
          />

          {workinAvailable ? (
            <>
              <IconText text="Work In" iconName="check" color={iconTextGreen} />
            </>
          ) : (
            <>
              <IconText text="Work In" iconName="times" color={red} />
            </>
          )}
        </>
      )}
    </View>
  );
}

/**************************************EQUIPMENT TABULAR SCREEN USING USERS SECTION*************************************/
type UsingUser = {
  username: string;
  exercise: string;
};

type UsingUserCardProps = ViewProps & {
  user: UsingUser;
};

function UsingUserCard({ user, style, ...rest }: UsingUserCardProps) {
  const { username, exercise } = user;

  return (
    <View style={[styles.userCardStyle, style]} {...rest}>
      <Text style={styles.userCardUsernameTextStyle}>{username}</Text>
      <Text style={styles.userCardExerciseTextStyle}>Exercise: {exercise}</Text>
    </View>
  );
}

type UsedBySectionProps = ViewProps & {
  usingUsers: UsingUser[];
};

function UsedBySection({ usingUsers, style, ...rest }: UsedBySectionProps) {
  return (
    <EquipmentTabularMenuScreenSection title="Used By" {...rest}>
      <View style={[{ gap: 10 }, style]}>
        {usingUsers.map((user) => (
          <UsingUserCard key={user.username} user={user} />
        ))}
      </View>
    </EquipmentTabularMenuScreenSection>
  );
}

/**************************************EQUIPMENT TABULAR SCREEN POSSIBLE EXERSIZES SECTION*************************************/
type Exercise = {
  name: string;
};

type PossibleExerciseCardProps = ViewProps & {
  exercise: Exercise;
};

function PossibleExerciseCard({
  exercise,
  style,
  ...rest
}: PossibleExerciseCardProps) {
  const { name: exerciseName } = exercise;

  return (
    <View style={[styles.possibleExerciseCardStyle, style]} {...rest}>
      <Text style={styles.possibleExerciseNameTextStyle}>{exerciseName}</Text>
    </View>
  );
}

type PossibleExercisesSectionProps = ViewProps & {
  exercises: Exercise[];
};

function PossibleExercisesSection({
  exercises,
  style,
  ...rest
}: PossibleExercisesSectionProps) {
  return (
    <EquipmentTabularMenuScreenSection title="Possible Exercises" {...rest}>
      <View style={[{ gap: 10 }, style]}>
        {exercises.map((exercise) => (
          <PossibleExerciseCard key={exercise.name} exercise={exercise} />
        ))}
      </View>
    </EquipmentTabularMenuScreenSection>
  );
}

/**************************************EQUIPMENT TABULAR SCREEN WORKOUT CONTROLS SECTION*************************************/
type WorkoutControlsSectionProps = ViewProps & {
  setsLeft: number;
  setSetsLeft: (arg0: number) => void;
  workinAvailable: boolean;
  setWorkinAvailable: (arg0: boolean) => void;
};

function WorkoutControlsSection({
  setsLeft,
  setSetsLeft,
  workinAvailable,
  setWorkinAvailable,
}: WorkoutControlsSectionProps) {
  const workinAvailableToggle = () => setWorkinAvailable(!workinAvailable);
  const decrementSetsLeft = () => setSetsLeft(setsLeft - 1);
  const incrementSetsLeft = () => setSetsLeft(setsLeft + 1);

  return (
    <EquipmentTabularMenuScreenSection title="Workout Controls">
      <View style={styles.workoutControlsSectionViewStyle}>
        <View style={styles.workoutControlsSetsLeftStyle}>
          <TouchableOpacity
            style={[
              styles.workoutControlsIncrementButtonStyle,
              setsLeft == 0 && { backgroundColor: "#ccc" },
            ]}
            onPress={decrementSetsLeft}
            disabled={setsLeft === 0}
          >
            <Text style={styles.workoutControlsIncrementButtonTextStyle}>
              -
            </Text>
          </TouchableOpacity>

          <Text
            style={styles.workoutControlsTextStyle}
          >{`${setsLeft} Sets Left`}</Text>

          <TouchableOpacity
            style={[
              styles.workoutControlsIncrementButtonStyle,
              setsLeft == MAX_SETS_LEFT && { backgroundColor: "#ccc" },
            ]}
            onPress={incrementSetsLeft}
            disabled={setsLeft == MAX_SETS_LEFT}
          >
            <Text style={styles.workoutControlsIncrementButtonTextStyle}>
              +
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity activeOpacity={1} onPress={workinAvailableToggle}>
          <CheckBox
            value={workinAvailable}
            onValueChange={setWorkinAvailable}
            color={workinAvailable ? "#00a20d" : "#FF0000"}
            text="Work In Available?"
            textStyle={styles.workoutControlsTextStyle}
          />
        </TouchableOpacity>
      </View>
    </EquipmentTabularMenuScreenSection>
  );
}

/**************************************EQUIPMENT TABULAR SCREEN BUTTONS*************************************/
type EquipmentTabularMenuButton = TouchableOpacityProps & {
  text: string;
  textColor: string;
  color: string;
  onPress: () => void;
};

function EquipmentTabularMenuButton({
  text,
  textColor,
  color,
  onPress,
  style,
  ...rest
}: EquipmentTabularMenuButton) {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, { backgroundColor: color }, style]}
      onPress={onPress}
      {...rest}
    >
      <Text style={[styles.buttonTextStyle, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
}

type EquipmentTabularMenuButtonsProps = ViewProps & {
  machine: any,
  currentUser: any,
  isAvailable: boolean;
  workinAvailable: boolean;
  isUserUsingMachine: boolean;
  handleJoinMachinePress: () => void,
  handleCompleteMachinePress: () => void,

};

function EquipmentTabularMenuButtons({
  machine,
  currentUser,
  isAvailable,
  workinAvailable,
  isUserUsingMachine,
  handleJoinMachinePress,
  handleCompleteMachinePress,
  style,
  ...rest
}: EquipmentTabularMenuButtonsProps) {
  return (
    <View style={[styles.buttonsViewStyle, style]} {...rest}>
      {isAvailable ? (
        <EquipmentTabularMenuButton
          text="Use Machine"
          textColor="#FFFFFF"
          color={maroon}
          onPress={handleJoinMachinePress}
        />
      ) : (
        <>
          {isUserUsingMachine ? (
            <EquipmentTabularMenuButton
              text="Complete Workout"
              textColor="#FFFFFF"
              color={maroon}
              onPress={ handleCompleteMachinePress }
            />
          ) : (
            <>
              {
              (workinAvailable && machine.activeUsers.map((user: any) => user.userId).indexOf(currentUser.uid) == -1) ? (
                <EquipmentTabularMenuButton
                  text="Work In"
                  textColor={maroon}
                  color="#a28c8c"
                  onPress={ handleJoinMachinePress }
                />
              ) : machine.activeUsers.map((user: any) => user.userId).indexOf(currentUser.uid) != -1 && (
                <EquipmentTabularMenuButton
                  text="Leave Workout"
                  textColor="#FFFFFF"
                  color={maroon}
                  onPress={ handleCompleteMachinePress }
                />
              )
            }
            </>
          )}
        </>
      )}
    </View>
  );
}

/**************************************EQUIPMENT TABULAR SCREEN*************************************/
export default function EquipmentTabularMenuScreen() {
  const { user, loading } = useAuth();
  const { image, name } = useLocalSearchParams();
  const [machine, setMachine] = useState<any>(null);
  const [loadingMachine, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [workinAvailable, setWorkinAvailable] = useState(true);
  const [isUserCurrentlyUsing, setIsUserCurrentlyUsing] = useState(false);
  const [setsLeft, setSetsLeft] = useState(3);

  const socket = useSocket();

  // Extract machine ID from name
  const machineId = name?.split('#').pop() || '';

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const response = (await axios.post(buildAPIURL(`/machines/machine`), { "machineId": machineId })).data;

        if(response.success) {
          const machineData = response.machine;

          setMachine(machineData);
          setIsAvailable(machineData.availability === "Free");
          setWorkinAvailable(machineData.workin);
          setSetsLeft(parseInt(machineData.sets_left));
          setIsUserCurrentlyUsing(machineData.activeUsers.length >= 1 ? machineData.activeUsers[0].userId == user?.uid : false);
        } else {
          throw new Error(response.msg);
        }
      } catch (err) {
        console.log(`Failed to fetch machine data: ${err.response ? err.response.data.msg : err.message || 'Failed to fetch machine details'}`);
        setError(err.response ? err.response.data.msg : err.message || 'Failed to fetch machine details');
      } finally {
        setLoading(false);
      }
    };

    if (machineId) fetchMachineData();

    socket?.on(`machine_${machineId}_changed`, ({ machine }) => {
      console.log(machine);
      setMachine(machine);
      setIsAvailable(machine.availability === "Free");
      setWorkinAvailable(machine.workin);
      setSetsLeft(parseInt(machine.sets_left));
      setIsUserCurrentlyUsing(machine.activeUsers.length >= 1 ? machine.activeUsers[0].userId == user?.uid : false);
    });
  }, [machineId]);

  const handleUpdateSets = async (newSets: number) => {
    try {
      const request = await axios.post(buildAPIURL(`/machines/edit`), {
        machineId: machineId,
        userId: user?.uid,
        setsLeft: newSets,
        workin: machine.workin
      });
      const response = request.data;

      if(!response.success)
        throw new Error(response.msg);
    } catch (err) {
      console.error("Failed to update sets left:", err.response.data.msg ? err.response.data.msg : err.message);
    }
  };

  const handleUpdateWorkin = async (newWorkin: boolean) => {
    try {
      const request = await axios.post(buildAPIURL(`/machines/edit`), {
        machineId: machineId,
        userId: user?.uid,
        setsLeft: machine.sets_left,
        workin: newWorkin
      });
      const response = request.data;

      if(!response.success)
        throw new Error(response.msg);
    } catch (err) {
      console.error("Failed to update workin availability:", err.response ? err.response.data.msg : err.message);
    }
  }

  const handleJoinMachine = async () => {
    try {
      const request = await axios.post(buildAPIURL(`/machines/use`), {
        machineId: machineId,
        userId: user?.uid
      });

      const response = request.data;

      if(!response.success)
        throw new Error(response.msg);
    } catch(err) {
      console.log(`Error joining machine: ${err.response ? err.response.data.msg : err.message}`);
    }
  }

  const handleLeaveMachine = async () => {
    try {
      const request = await axios.post(buildAPIURL(`/machines/leave`), {
        machineId: machineId,
        userId: user?.uid
      });

      const response = request.data;

      if(!response.success)
        throw new Error(response.msg);
    } catch(err) {
      console.log(`Error joining machine: ${err.response ? err.response.data.msg : err.message}`);
    }
  }

  return (
    <Screen style={styles.screen}>
        {
          !loadingMachine ? (
            <>
              <ScrollView>
                <View style={styles.contaier}>
                  <Text style={styles.machineNameTextStyle}>{name}</Text>

                  <View style={styles.machineImageContainer}>
                    <Image source={{ uri: image }} style={styles.machineImageStyle} />
                  </View>

                  <EquipmentAvailabilityMenu
                    style={styles.availabilityMenuStyle}
                    isAvailable={isAvailable}
                    setsLeft={setsLeft}
                    workinAvailable={workinAvailable}
                  />

                  {!isAvailable && (
                    <UsedBySection usingUsers={machine.activeUsers.map((user: any) => ({ username: user.displayName, exercise: "" }))} />
                  )}

                  {isUserCurrentlyUsing && (
                    <WorkoutControlsSection
                      setsLeft={setsLeft}
                      setSetsLeft={handleUpdateSets}
                      workinAvailable={workinAvailable}
                      setWorkinAvailable={handleUpdateWorkin}
                    />
                  )}

                  <PossibleExercisesSection exercises={[
                    { name: "Standard Exercise 1" },
                    { name: "Standard Exercise 2" }
                  ]} />
                </View>
              </ScrollView>
              <EquipmentTabularMenuButtons
                machine={machine}
                currentUser={user}
                isAvailable={isAvailable}
                workinAvailable={workinAvailable}
                isUserUsingMachine={isUserCurrentlyUsing}
                handleJoinMachinePress={handleJoinMachine}
                handleCompleteMachinePress={handleLeaveMachine}
              />
            </>
          ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%'}}>
              <Text>Loading...</Text>
            </View>
          )
        }
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contaier: {
    flex: 1,
    paddingBottom: "20%",
  },
  machineNameTextStyle: {
    fontFamily: "Poppins",
    fontSize: 34,
    fontWeight: "600",
    color: maroon,
    margin: 10,
  },
  sectionStyle: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  sectionTitleStyle: {
    fontFamily: "Poppins",
    fontSize: 24,
    fontWeight: "regular",
    color: maroon,
  },
  machineImageContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  machineImageStyle: {
    width: "70%",
    height: "70%",
    resizeMode: "cover",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  equipmentAvailabilityMenuViewStyle: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: "3%",
  },
  availabilityMenuStyle: {
    margin: 10,
  },
  userCardStyle: {
    flexWrap: "wrap",
    flexDirection: "row",
    padding: "3%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  userCardUsernameTextStyle: {
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: "regular",
    color: maroon,
  },
  userCardExerciseTextStyle: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "regular",
    color: maroon,
  },
  possibleExerciseCardStyle: {
    flexWrap: "wrap",
    flexDirection: "row",
    padding: "3%",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  possibleExerciseNameTextStyle: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "regular",
    color: maroon,
  },
  buttonsViewStyle: {
    backgroundColor: "#00000000",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
    marginBottom: 10,
    padding: 10,
    gap: 10,
  },
  buttonStyle: {
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  buttonTextStyle: {
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: "regular",
  },
  workoutControlsSectionViewStyle: {
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    paddingHorizontal: "3%",
    paddingVertical: "5%",
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  workoutControlsTextStyle: {
    fontFamily: "Poppins",
    fontSize: 16,
    fontWeight: "regular",
    color: maroon,
  },
  workoutControlsIncrementButtonStyle: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: maroon,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  workoutControlsIncrementButtonTextStyle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  workoutControlsSetsLeftStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
});
