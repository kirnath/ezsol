export async function getGraduatedTokens(): Promise<any[]> {
  const response = await fetch(
    "https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=solana&limit=10",
    {
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY!,
      },
    }
  );

  const data = await response.json();
  console.log("Graduated Tokens Data:", data);
  const shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}