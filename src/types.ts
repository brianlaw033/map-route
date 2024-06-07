export type Path = [number, number][]
export type RouteResponse = { status: string; path: Path; error?: string }
export type TokenResponse = { token: string }
export type MapboxDirectionsResponse = {
    code: string
    uuid: string
    waypoints: {
        distance: number
        name: string
        location: [number, number]
    }[]
    routes: {
        distance: number
        duration: number
        geometry: {
            coordinates: [number, number][]
            type: string
        }
        legs: {
            via_waypoints: []
            admins: {
                iso_3166_1: string
                iso_3166_1_alpha3: string
            }[]
            distance: number
            duration: number
            steps: []
            summary: string
            weight: number
        }[]
        weight: number
        weight_name: string
    }[]
}
