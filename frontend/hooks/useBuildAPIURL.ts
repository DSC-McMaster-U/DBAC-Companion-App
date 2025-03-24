import { Platform } from "react-native";

export const API_URL = Platform.OS === "ios" ? process.env.EXPO_PUBLIC_API_URL : process.env.EXPO_PUBLIC_API_URL_ANDROID;

/**
 * 
 * @param path The path of the API request
 * @returns The full API url to a endpoint specified by the path
 */
export function buildAPIURL(path: string) : string {    
    return API_URL + (path.charAt(0) != '/' ? '/' : '') + path;
}