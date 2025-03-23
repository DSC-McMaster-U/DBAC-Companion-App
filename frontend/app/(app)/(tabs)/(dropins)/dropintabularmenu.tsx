import React, { useEffect, useState } from "react";
import Screen from "@/components/Screen";
import { ScrollView, View, Text, Image, StyleSheet, ImageSourcePropType, ViewProps, TouchableOpacity } from "react-native";
import { maroon } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { API_URL, buildAPIURL } from "@/hooks/useBuildAPIURL";
import { DropinData, ActiveUser } from "@/constants/Types";
import { getDropinCapacityTextColor } from "@/hooks/getDropinCapacityColor";
import ProfilePicture from "@/assets/images/default-pfp.png";
import axios from "axios";
import { useSocket } from "@/components/SocketContext";
import { useAuth } from "@/components/AuthContext";

type ActiveUserBarProps = ViewProps & {
    username: string,
    profilePicture: ImageSourcePropType
}

function ActiveUserBar({ username, profilePicture }: ActiveUserBarProps) {
  return (
    <View style={styles.activeUserBarView}>
      <Image source={profilePicture} style={styles.activeUserProfileImageStyle} />

      <Text numberOfLines={1} ellipsizeMode='tail' style={styles.activeUserTextStyle}>
        {username}
      </Text>
    </View>
  );
}

type JoinLeaveButtonProps = ViewProps & {
    text: string,
    onPress: () => void
}

function JoinLeaveButton({
  text,
  onPress,
  style,
  ...rest
}: JoinLeaveButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, style]}
      onPress={onPress}
      {...rest}
    >
      <Text style={styles.buttonTextStyle}>{text}</Text>
    </TouchableOpacity>
  );
}

const api = axios.create({
    baseURL: API_URL
})

export default function DropinTabularMenu() {
    const { user, loading } = useAuth();
    const { dropinName } = useLocalSearchParams();
    const [loadingDropin, setLoadingDropin] = useState(true);
    const [userInDropin, setUserInDropin] = useState(false);
    const [dropin, setDropin] = useState<DropinData>({
        capacity: 0,
        num_active_users: 0,
        active_users_list: []
    });

    const socket = useSocket();

    const handleJoinDropin = async () => {
        try {
            const response = await api.post('/dropins/join', {
                dropin: dropinName,
                uid: user?.uid
            });

            if(!response.data.success)
                throw new Error(response.data.msg);
        } catch(error) {
            console.log(error);
        }
    }

    const handleLeaveDropin = async () => {
        try {
            const response = await api.post('/dropins/leave', {
                dropin: dropinName,
                uid: user?.uid
            });

            if(!response.data.success)
                throw new Error(response.data.msg);
        } catch(error) {
            console.log(error);
        }
    }

    const checkUserInDropin = (dropinData: DropinData) => {
        const usersList = dropinData.active_users_list; 
        return dropinData.num_active_users > 0 && usersList.map((activeUser: ActiveUser) => activeUser.userId).indexOf(user!.uid) != -1;
    }

    useEffect(() => {
        const fetchDropin = async () => {
            try {
                const response = await api.post('/facility/user_capacity', {
                    facility: dropinName
                });

                if(response.data.success) {
                    const dropinData = response.data;
                    setDropin(dropinData);
                    setUserInDropin(checkUserInDropin(dropinData));
                } else {
                    throw new Error(response.data.msg);
                }
            } catch(error) {
                console.log(error);
            } finally {
                setLoadingDropin(false);
            }
        }

        fetchDropin();

        socket?.on(`dropin_${dropinName}_updated`, ({ dropinData }) => {
            setDropin(dropinData);
            setUserInDropin(checkUserInDropin(dropinData));
        })
    }, [dropinName])

    return (
        <Screen style={ styles.screen }>
            {!loadingDropin ? (
                <>
                    <ScrollView>
                        <View style={ styles.contaier }>
                            <Text style={styles.dropinNameTextStyle}>{dropinName}</Text>

                            <View style={styles.dropinImageContainer}>
                                <Image source={{ uri: buildAPIURL(`/assets/images/${dropinName}.jpg`) }} style={styles.dropinImageStyle} />
                            </View>

                            <Text style={styles.subtitleText}>Capacity</Text>
                            <Text style={[styles.capacityText, { color: getDropinCapacityTextColor(dropin.num_active_users, dropin.capacity) }]}>
                                {dropin.num_active_users}/{dropin.capacity}
                            </Text>

                            <Text style={styles.subtitleText}>Active Users</Text>
                            {dropin.active_users_list?.map((user: ActiveUser) => (
                                <ActiveUserBar
                                    key={user.userId}
                                    username={user.displayName}
                                    profilePicture={ProfilePicture}
                                />
                            ))}
                        </View>
                    </ScrollView>
                    <View style={styles.buttonsViewStyle}>
                        <JoinLeaveButton
                            text={userInDropin ? 'Leave' : 'Join'}
                            onPress={() => {
                                if(userInDropin)
                                    handleLeaveDropin();
                                else
                                    handleJoinDropin();
                            }}
                        />
                    </View>
                </>
            ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <Text>Loading...</Text>
                </View>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
        flex: 1
    },
    contaier: {
        flex: 1,
        paddingBottom: "20%",
        paddingHorizontal: 10
    },
    dropinNameTextStyle: {
        fontFamily: "Poppins",
        fontSize: 34,
        fontWeight: "600",
        color: maroon,
        margin: 10,
    },
    dropinImageContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        marginHorizontal: 10,
    },
    dropinImageStyle: {
        width: "70%",
        height: "70%",
        resizeMode: "cover",
        aspectRatio: 1,
        borderRadius: 20,
        overflow: "hidden",
    },
    subtitleText: {
        fontFamily: 'Source Sans Pro',
        fontSize: 36,
        lineHeight: 56,
        color: maroon
    },
    capacityText: {
        fontSize: 25
    },
    activeUserBarView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    activeUserProfileImageStyle: {
        width: '10%',
        height: '100%',
        aspectRatio: 1,
        resizeMode: 'cover'
    },
    activeUserTextStyle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16
    },
    buttonStyle: {
        borderRadius: 10,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: maroon
    },
    buttonTextStyle: {
        fontFamily: "Poppins",
        fontSize: 18,
        fontWeight: "regular",
        color: 'white'
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
    }
})