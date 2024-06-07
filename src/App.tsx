import { FormEvent, useState } from "react"
import Map, { Layer, Source } from "react-map-gl"
import Mapboxgl from "mapbox-gl"
import { getRouteToken, getRoute, getDirection } from "./api"
import type { AxiosError } from "axios"
import type { MapboxDirectionsResponse } from "./types"
import "./App.css"

Mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

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

    const onRetreiveDirection = (direction: MapboxDirectionsResponse) => {
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
