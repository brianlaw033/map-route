import { FormEvent, useState } from "react"
import Map, { Layer, Source } from "react-map-gl"
import "./App.css"
import Mapboxgl from "mapbox-gl"
import axios, { AxiosError } from "axios"

const api = "https://sg-mock-api.lalamove.com"

Mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

type Path = [number, number][]

type MapboxDirections = {
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

const STATUS = {
    IN_PROGRESS: "in progress",
    SUCCESS: "success",
    FAILURE: "failure",
}

const getRouteToken = async (origin: string, destination: string) => {
    try {
        const response = await axios.post(`${api}/route`, {
            origin,
            destination,
        })
        return response.data.token
    } catch (err) {
        throw err
    }
}

const getRoute = async (token: string) =>
    new Promise<any>(async (resolve, reject) => {
        try {
            //const response = await axios.get(`${api}/route/${token}`);
            const response = await axios.get(`${api}/mock/route/success`)
            if (response.data.status === STATUS.IN_PROGRESS) {
                setTimeout(() => getRoute(token), 500)
                return
            }
            if (response.data.status === STATUS.FAILURE) {
                reject({ message: response.data.error })
            }
            resolve(response.data)
        } catch (err) {
            reject(err)
        }
    })

const getDirection = async (path: Path) => {
    try {
        const lngLatPath = path.map((point) => [point[1], point[0]])
        const response = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${lngLatPath.join(
                ";",
            )}?geometries=geojson&access_token=${Mapboxgl.accessToken}`,
        )
        return response.data
    } catch (err) {
        throw err
    }
}

function App() {
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [routeGeojson, setRouteGeojson] = useState<any>(null)
    const [waypoints, setWaypoints] = useState<any>(null)

    const onSubmitAddresses = async (event: FormEvent<HTMLFormElement>) => {
        try {
            setIsLoading(true)
            setError("")
            event.preventDefault()
            const token = await getRouteToken(origin, destination)
            const route = await getRoute(token)
            const direction = await getDirection(route.path)
            onRetreiveDirection(direction)
        } catch (err) {
            setError((err as AxiosError).message)
        } finally {
            setIsLoading(false)
        }
    }

    const onRetreiveDirection = (direction: MapboxDirections) => {
        const data = direction.routes[0]
        const coordinates = data.geometry.coordinates
        const routeGeojson = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates: coordinates,
            },
        }
        setRouteGeojson(routeGeojson)
        const waypointsGeoJson = {
            type: "FeatureCollection",
            features: direction.waypoints.map((waypoint: any, i: number) => ({
                type: "Feature",
                properties: { order: i + 1 },
                geometry: {
                    type: "Point",
                    coordinates: waypoint.location,
                },
            })),
        }
        setWaypoints(waypointsGeoJson)
    }

    return (
        <div>
            <form onSubmit={onSubmitAddresses}>
                <input name="origin" placeholder="Origin" autoComplete="address-line1" onChange={(e) => setOrigin(e.target.value)} />
                <input
                    name="destination"
                    placeholder="Destination"
                    autoComplete="address-line1"
                    onChange={(e) => setDestination(e.target.value)}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Submit"}
                </button>
            </form>
            <div>{error}</div>
            <Map
                initialViewState={{
                    longitude: 114.16,
                    latitude: 22.31,
                    zoom: 10,
                }}
                style={{ width: 600, height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            >
                {routeGeojson && (
                    <Source id="route" type="geojson" data={routeGeojson}>
                        <Layer
                            id="route"
                            type="line"
                            source="route"
                            layout={{
                                "line-join": "round",
                                "line-cap": "round",
                            }}
                            paint={{
                                "line-color": "#3887be",
                                "line-width": 5,
                                "line-opacity": 0.75,
                            }}
                        />
                    </Source>
                )}

                {waypoints && (
                    <Source id="waypoints" type="geojson" data={waypoints}>
                        <Layer
                            id="waypoints"
                            type="symbol"
                            source="waypoints"
                            layout={{
                                "text-field": ["get", "order"],
                            }}
                            paint={{
                                "text-color": "#3887be",
                                "text-halo-color": "#fff",
                                "text-halo-width": 2,
                            }}
                        />
                    </Source>
                )}
            </Map>
        </div>
    )
}

export default App
