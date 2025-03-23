import Screen from "@/components/Screen";
import { useSocket } from "@/components/SocketContext";
import { ThemedText } from "@/components/ThemedText";
import { API_URL, buildAPIURL } from "@/hooks/useBuildAPIURL";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Image, ViewProps, Text, ScrollView } from "react-native";
import { DropinData, ActiveUser } from "@/constants/Types";
import { getDropinCapacityTextColor } from "@/hooks/getDropinCapacityColor";

type DropinCardProps = ViewProps & {
    dropinName: string,
    dropinData: DropinData
};

function DropinCard({ dropinName, dropinData }: DropinCardProps) {
    const { num_active_users, capacity, active_users_list } = dropinData;

    return (
        <TouchableOpacity
            style={ styles.dropinCard }
            onPress={() => {
                router.push({
                    pathname: '/(app)/(tabs)/(dropins)/dropintabularmenu',
                    params: {
                        dropinName: dropinName
                    }
                });
            }}
        >
            <Image
                style={ styles.dropinCardImg }
                source={{
                    uri: buildAPIURL(`/assets/images/${dropinName}.jpg`),
                }}
            />

            <View style={ styles.dropinCardBody }>
                <ThemedText type="subtitle">
                    { dropinName }
                </ThemedText>

                {/* Capacity text */}
                <Text style={{ fontSize: 15 }}>
                    Capacity: <Text style={{ color: getDropinCapacityTextColor(num_active_users, capacity) }}>{ num_active_users }/{ capacity }</Text>
                </Text>

                {/* Active users list (contains only 2 users) */}
                {active_users_list.length > 0 && (
                    <>
                        <Text style={{ fontSize: 14 }}>Active Users</Text>

                        { 
                            active_users_list.slice(0, 2).map((user: ActiveUser) => (
                                <Text key={user.userId}>{ user.displayName }</Text>
                            )) 
                        }
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
}

const api = axios.create({
    baseURL: API_URL
});

export default function DropinsScreen() {
    const [loadingDropins, setLoadingDropins] = useState(true);
    const [dropins, setDropins] = useState({});
    const socket = useSocket();

    useEffect(() => {
        const fetchDropins = async () => {
            try {
                const response = await api.get('/dropins/get');
                
                if(response.data.success) {
                    const dropinsData = response.data.dropins;
                    setDropins(dropinsData);
                } else {
                    throw new Error(response.data.msg);
                }
            } catch(error) {
                console.log(error);
            } finally {
                setLoadingDropins(false);
            }
        };

        fetchDropins();

        socket?.on('dropins_changed', ({ dropins }) => {
            setDropins(dropins);
        });
    }, []);

    return (
        <Screen style={ styles.screen }>
            <View style={ styles.container }>
                <ThemedText type="title" style={ styles.title }>
                    Dropins
                </ThemedText>

                {loadingDropins ? (
                    <View style={styles.loadingContainer}>
                        <ThemedText>Loading dropins...</ThemedText>
                    </View>
                ) : (
                    <ScrollView
                        style={{ width: "100%", marginBottom: 50, marginTop: 20, paddingHorizontal: 10 }}
                    >
                        {Object.keys(dropins).map((dropinKey) => (
                            <DropinCard
                                key={dropinKey}
                                dropinName={dropinKey}
                                dropinData={dropins[dropinKey]}
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "white",
        flex: 1
    },
    container: {
        paddingHorizontal: 10
    },
    title: {
        marginTop: 10
    },
    dropinCard: {
        width: "100%",
        height: 170,
        gap: 10,
        backgroundColor: "#eaeaea",
        marginBottom: 20,
        alignItems: "center",
        borderRadius: 20,
        flexDirection: "row",
        padding: 10,
    },
    dropinCardImg: {
        width: 114,
        height: 138,
        objectFit: 'fill',
        borderRadius: 20
    },
    dropinCardBody: {
        height: 128,
        gap: 5
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})