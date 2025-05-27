import axios from "axios";


export default async function fetchPortfolioData(walletAddress: string) {
    try {
        const response = await axios.post(
            "https://pinata.ezsol.xyz/wallet",
            {
                address: walletAddress
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}