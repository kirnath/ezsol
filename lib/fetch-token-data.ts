import axios from "axios";

async function fetchTokenOverview(mintAddress: string): Promise<any> {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-chain": "solana",
      "X-API-KEY": "01665a81894141f49611cebffc1e5505",
    },
  };

  try {
    const response = await axios.get(
      "https://public-api.birdeye.so/defi/token_overview?address=" + mintAddress,
      options
    );
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default fetchTokenOverview;