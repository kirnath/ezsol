import axios from "axios";

async function fetchTokenOverview(mintAddress: string): Promise<any> {


  try {
    const response = await axios.get(
      "https://pinata.ezsol.xyz/token-overview/" + mintAddress
    );
    
    return response.data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default fetchTokenOverview;