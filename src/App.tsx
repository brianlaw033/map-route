import { FormEvent, useState } from "react"
import Map, { Layer, Source } from "react-map-gl"
import Mapboxgl from "mapbox-gl"
import type { AxiosError } from "axios"
import { Button, TextField } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { getRouteToken, getRoute, getDirection } from "./api"
import type { MapboxDirectionsResponse } from "./types"
import "mapbox-gl/dist/mapbox-gl.css"

Mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
})

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
        <ThemeProvider theme={darkTheme}>
            <form onSubmit={onSubmitAddresses} style={{ display: "flex", justifyContent: "center" }}>
                <TextField
                    id="outlined-basic"
                    label="Origin"
                    variant="outlined"
                    name="origin"
                    autoComplete="address-line1"
                    sx={{ height: "42px" }}
                    onChange={(e) => setOrigin(e.target.value)}
                />
                <TextField
                    id="outlined-basic"
                    label="Destination"
                    variant="outlined"
                    name="destination"
                    autoComplete="address-line1"
                    onChange={(e) => setDestination(e.target.value)}
                />
                <Button variant="contained" type="submit" disabled={isLoading} size="large">
                    {isLoading ? "Loading..." : "Submit"}
                </Button>
            </form>
            <div>{error}</div>
            <Map
                initialViewState={{
                    longitude: 114.16,
                    latitude: 22.31,
                    zoom: 10,
                }}
                style={{ width: "95vw", height: "80vh" }}
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
        </ThemeProvider>
    )
}

export default App
