interface NetworkGasFee {
  network: string;
  baseFee: number;
  priorityFee: number;
  totalFee: number;
  timeEstimate: string;
}

// Simulated gas fee data for multiple networks
export async function fetchGasFees(): Promise<NetworkGasFee[]> {
  try {
    const response = await fetch('https://api.etherscan.io/api', {
      params: {
        module: 'gastracker',
        action: 'gasoracle',
        apikey: 'YourApiKey'
      }
    });

    // For demo purposes, return simulated data
    // In production, parse the actual API response
    return [
      {
        network: 'Ethereum',
        baseFee: Math.floor(20 + Math.random() * 30),
        priorityFee: Math.floor(1 + Math.random() * 5),
        totalFee: Math.floor(25 + Math.random() * 35),
        timeEstimate: '< 30 seconds'
      },
      {
        network: 'Polygon',
        baseFee: Math.floor(50 + Math.random() * 100),
        priorityFee: Math.floor(30 + Math.random() * 50),
        totalFee: Math.floor(80 + Math.random() * 150),
        timeEstimate: '< 15 seconds'
      },
      {
        network: 'Arbitrum',
        baseFee: Math.floor(0.1 * 100) / 100,
        priorityFee: Math.floor(0.05 * 100) / 100,
        totalFee: Math.floor(0.15 * 100) / 100,
        timeEstimate: '< 1 second'
      }
    ];
  } catch (error) {
    console.error('Error fetching gas fees:', error);
    throw error;
  }
}