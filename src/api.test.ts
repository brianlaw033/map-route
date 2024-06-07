import { describe, it, expect, vi } from "vitest"
import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import { poll, getDirection, getRouteToken } from "./api"
import type { MapboxDirectionsResponse, Path } from "./types"

describe("poll function", () => {
    it("should resolve when fn resolves and retryCondition is false", async () => {
        const mockFn = vi.fn().mockResolvedValue("success")
        const retryCondition = (result: string) => result !== "success"

        const result = await poll(mockFn, retryCondition, 100, 3)
        expect(result).toBe("success")
        expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it("should retry until retryCondition is false", async () => {
        let attempt = 0
        const mockFn = vi.fn().mockImplementation(() => {
            attempt++
            return Promise.resolve(attempt === 3 ? "success" : "retry")
        })
        const retryCondition = (result: string) => result !== "success"

        const result = await poll(mockFn, retryCondition, 100, 5)
        expect(result).toBe("success")
        expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it("should reject after maxAttempts are reached", async () => {
        const mockFn = vi.fn().mockResolvedValue("retry")
        const retryCondition = (result: string) => result !== "success"

        await expect(poll(mockFn, retryCondition, 100, 3)).rejects.toThrow("Try again later")
        expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it("should handle immediate success on first attempt", async () => {
        const mockFn = vi.fn().mockResolvedValue("success")
        const retryCondition = (result: string) => result !== "success"

        const result = await poll(mockFn, retryCondition, 100, 3)
        expect(result).toBe("success")
        expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it("should handle different intervals", async () => {
        const start = Date.now()
        let attempt = 0
        const mockFn = vi.fn().mockImplementation(() => {
            attempt++
            return Promise.resolve(attempt === 2 ? "success" : "retry")
        })
        const retryCondition = (result: string) => result !== "success"

        const result = await poll(mockFn, retryCondition, 500, 3)
        const end = Date.now()

        expect(result).toBe("success")
        expect(mockFn).toHaveBeenCalledTimes(2)
        expect(end - start).toBeGreaterThanOrEqual(500) // Ensure there's at least one interval delay
    })
})

const mock = new MockAdapter(axios)
const api = "https://sg-mock-api.lalamove.com"

describe("getRouteToken", () => {
    it("should return a token when the API call is successful", async () => {
        const origin = "New York"
        const destination = "Los Angeles"
        const token = "12345"

        mock.onPost(`${api}/route`, { origin, destination }).reply(200, { token })

        const result = await getRouteToken(origin, destination)
        expect(result).toBe(token)
    })

    it("should throw an error when the API call fails", async () => {
        const origin = "New York"
        const destination = "Los Angeles"

        mock.onPost(`${api}/route`, { origin, destination }).reply(500)

        await expect(getRouteToken(origin, destination)).rejects.toThrow()
    })
})

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

describe("getDirection", () => {
    it("should return directions data when the API call is successful", async () => {
        const path: Path = [
            [40.73061, -73.935242],
            [40.650002, -73.949997],
        ]
        const lngLatPath = path.map((point) => [point[1], point[0]])
        const mockResponse: MapboxDirectionsResponse = {
            routes: [],
            waypoints: [],
            code: "Ok",
            uuid: "mock-uuid",
        }

        mock.onGet(
            `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${lngLatPath.join(
                ";",
            )}?geometries=geojson&access_token=${accessToken}`,
        ).reply(200, mockResponse)

        const result = await getDirection(path)
        expect(result).toEqual(mockResponse)
    })

    it("should throw an error when the API call fails", async () => {
        const path: Path = [
            [40.73061, -73.935242],
            [40.650002, -73.949997],
        ]
        const lngLatPath = path.map((point) => [point[1], point[0]])

        mock.onGet(
            `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${lngLatPath.join(
                ";",
            )}?geometries=geojson&access_token=${accessToken}`,
        ).reply(500)

        await expect(getDirection(path)).rejects.toThrow()
    })
})
