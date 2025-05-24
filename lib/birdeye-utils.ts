import axios from "axios"

export const fetchTrendingTokens = async () => {
    try {
        const response = await axios.get(
            "https://pinata.ezsol.xyz/trending",
            {
                headers: {
                    'accept': 'application/json',
                    'x-chain': 'solana'
                },
            }
        )
        return response.data
    } catch (error) {
        console.error("Error fetching trending tokens:", error)
        return []
    }
}
