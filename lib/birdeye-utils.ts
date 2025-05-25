import axios from "axios"

export const fetchTrendingTokens = async () => {
    try {
        const response = await axios.get(
            "https://pinata.ezsol.xyz/trending"
        )
        return response.data
    } catch (error) {
        console.error("Error fetching trending tokens:", error)
        return []
    }
}

export const fetchInitialTokens = async () => {
    try {
        const response = await axios.get(
            "https://pinata.ezsol.xyz/newlisting"
        )
        return response.data
    } catch (error) {
        console.error("Error fetching initial tokens:", error)
        return []
    }
}
