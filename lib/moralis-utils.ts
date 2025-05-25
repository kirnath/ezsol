import axios from "axios";

export async function getGraduatedTokens(): Promise<any[]> {
  try {
    const response = await axios.get(
        "https://pinata.ezsol.xyz/home/trending"
    )
    const shuffled = response.data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  } catch (error) {
    console.error("Error fetching trending tokens:", error)
    return []
  }
  
}