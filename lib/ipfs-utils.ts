/**
 * Utility functions for IPFS operations
 */

// Pinata API credentials
const PINATA_API_KEY = "b2f0f48b104cd0f6bfc6"
const PINATA_API_SECRET = "8e6dcbcd43ebfafbe27461399ccaab54f24b9f7a48a5be3931dea96be1d4b024"
const PINATA_API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"
const PINATA_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

/**
 * Convert a data URL to a File object
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(",")
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

/**
 * Upload a file to IPFS using Pinata
 */
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(PINATA_API_URL, {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload to IPFS: ${response.statusText}`)
    }

    const data = await response.json()
    return data.IpfsHash
  } catch (error) {
    console.error("Error uploading to IPFS:", error)
    throw error
  }
}

/**
 * Create and upload token metadata to IPFS
 */
export async function createTokenMetadata(
  metadata: {
    name: string
    symbol: string
    description?: string
  },
  logoCID?: string,
): Promise<string> {
  try {
    const tokenMetadata = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description || `${metadata.name} token on Solana`,
      image: logoCID ? `ipfs://${logoCID}` : undefined,
      attributes: [
        {
          trait_type: "Token Type",
          value: "Fungible",
        },
      ],
    }

    const response = await fetch(PINATA_JSON_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
      body: JSON.stringify(tokenMetadata),
    })

    if (!response.ok) {
      throw new Error(`Failed to upload metadata to IPFS: ${response.statusText}`)
    }

    const data = await response.json()
    return data.IpfsHash
  } catch (error) {
    console.error("Error creating token metadata:", error)
    throw error
  }
}

/**
 * Get IPFS gateway URL for a CID
 */
export function getIPFSGatewayURL(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`
}

export const getIPFSUrl = getIPFSGatewayURL
