export const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * 
 * @param path The path of the API request
 * @returns The full API url to a endpoint specified by the path
 */
export function buildAPIURL(path: string) : string {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    
    return apiUrl + (path.charAt(0) != '/' ? '/' : '') + path;
}