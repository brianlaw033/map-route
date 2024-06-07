import { describe, it, expect, vi, Mock } from "vitest"
import App from "./App"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { getRouteToken, getRoute, getDirection } from "./api"
import "@testing-library/jest-dom"

vi.mock("./api", () => ({
    getRouteToken: vi.fn(),
    getRoute: vi.fn(),
    getDirection: vi.fn(),
}))

describe("App Component", () => {
    it("should render the form and map", () => {
        render(<App />)

        expect(screen.getByPlaceholderText("Origin")).toBeInTheDocument()
        expect(screen.getByPlaceholderText("Destination")).toBeInTheDocument()
        expect(screen.getByText("Submit")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument()
    })

    it("should display loading state and call APIs on form submission", async () => {
        const origin = "New York"
        const destination = "Los Angeles"
        const token = "mockToken"
        const direction = {
            routes: [
                {
                    geometry: {
                        coordinates: [
                            [-73.935242, 40.73061],
                            [-73.949997, 40.650002],
                        ],
                    },
                },
            ],
            waypoints: [{ location: [-73.935242, 40.73061] }, { location: [-73.949997, 40.650002] }],
        }
        const route = {
            path: [
                [40.73061, -73.935242],
                [40.650002, -73.949997],
            ],
        }

        ;(getRouteToken as Mock).mockResolvedValue(token)
        ;(getRoute as Mock).mockResolvedValue(route)
        ;(getDirection as Mock).mockResolvedValue(direction)

        render(<App />)

        fireEvent.change(screen.getByPlaceholderText("Origin"), { target: { value: origin } })
        fireEvent.change(screen.getByPlaceholderText("Destination"), { target: { value: destination } })
        fireEvent.click(screen.getByRole("button", { name: /submit/i }))

        expect(screen.getByRole("button", { name: /loading/i })).toBeInTheDocument()

        await waitFor(() => expect(getRouteToken).toHaveBeenCalledWith(origin, destination))
        await waitFor(() => expect(getRoute).toHaveBeenCalledWith(token))
        await waitFor(() => expect(getDirection).toHaveBeenCalledWith(route.path))

        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument()
    })

    it("should display an error message if API call fails", async () => {
        const origin = "New York"
        const destination = "Los Angeles"
        const errorMessage = "Network Error"

        ;(getRouteToken as Mock).mockRejectedValue(new Error(errorMessage))

        render(<App />)

        fireEvent.change(screen.getByPlaceholderText("Origin"), { target: { value: origin } })
        fireEvent.change(screen.getByPlaceholderText("Destination"), { target: { value: destination } })
        fireEvent.click(screen.getByRole("button", { name: /submit/i }))

        await waitFor(() => expect(getRouteToken).toHaveBeenCalledWith(origin, destination))
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
})
