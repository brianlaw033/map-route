import axios from "axios"
import { TokenResponse, RouteResponse, Path, MapboxDirectionsResponse } from "./types"
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

const api = "https://sg-mock-api.lalamove.com"

const STATUS = {
    IN_PROGRESS: "in progress",
    SUCCESS: "success",
    FAILURE: "failure",
}

export const getRouteToken = async (origin: string, destination: string) => {
    try {
        const response = await axios.post<TokenResponse>(`${api}/route`, {
            origin,
            destination,
        })
        return response.data.token
    } catch (err) {
        throw err
    }
}

export function poll<T>(fn: () => Promise<T>, retryCondition: (result: T) => boolean, interval: number, maxAttempts: number): Promise<T> {
    let attempts = 0

    const executePoll = async (resolve: (result: T) => void, reject: (error: any) => void) => {
        const result = await fn()
        attempts++
        if (!retryCondition(result)) {
            resolve(result)
        } else if (attempts === maxAttempts) {
            reject(new Error("Try again later"))
        } else {
            setTimeout(executePoll, interval, resolve, reject)
        }
    }

    return new Promise(executePoll)
}

export const getRoute = async (token: string): Promise<RouteResponse> =>
    poll(
        async () => {
            const response = await axios.get<RouteResponse>(`${api}/route/${token}`)
            return response.data
        },
        (data) => data.status === STATUS.IN_PROGRESS,
        500,
        20,
    )

export const getDirection = async (path: Path) => {
    try {
        const lngLatPath = path.map((point) => [point[1], point[0]])
        const response = await axios.get<MapboxDirectionsResponse>(
            `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${lngLatPath.join(
                ";",
            )}?geometries=geojson&access_token=${accessToken}`,
        )
        return response.data
    } catch (err) {
        throw err
    }
}
