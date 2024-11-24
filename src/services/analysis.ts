import axios from 'axios';

export async function fetchHistoricalPrices(symbol: string) {
  try {
    const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday`, {
      params: {
        fsym: symbol.toUpperCase(),
        tsym: 'USD',
        limit: 30,
        api_key: 'd7019dd9c4be2753e8f196ef673f196992f778b204bfc91aa84e0b6b80d17529'
      }
    });

    if (!response.data?.Data?.Data) {
      throw new Error('Invalid response format');
    }

    return response.data.Data.Data.map((item: any) => ({
      timestamp: item.time * 1000,
      price: item.close
    }));
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    throw error;
  }
}

export async function generateInsights(symbol: string, priceData: any[]) {
  try {
    const changes = calculatePriceChanges(priceData);
    return generateSimulatedInsights(symbol, changes);
  } catch (error) {
    console.error('Error generating insights:', error);
    return getDefaultInsights();
  }
}

function calculatePriceChanges(priceData: any[]) {
  const changes = {
    day: 0,
    week: 0,
    month: 0,
    volatility: 0
  };

  if (priceData.length > 0) {
    const latest = priceData[priceData.length - 1].price;
    const yesterday = priceData[priceData.length - 2]?.price;
    const weekAgo = priceData[priceData.length - 7]?.price;
    const monthAgo = priceData[0].price;

    changes.day = yesterday ? ((latest - yesterday) / yesterday) * 100 : 0;
    changes.week = weekAgo ? ((latest - weekAgo) / weekAgo) * 100 : 0;
    changes.month = monthAgo ? ((latest - monthAgo) / monthAgo) * 100 : 0;

    // Calculate volatility
    const prices = priceData.map(d => d.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    changes.volatility = Math.sqrt(
      prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length
    );
  }

  return changes;
}

function generateSimulatedInsights(symbol: string, changes: any) {
  const insights = [];

  // Price trend insight
  if (changes.month > 5) {
    insights.push({
      type: 'bullish',
      message: `${symbol} shows strong upward momentum with a ${changes.month.toFixed(1)}% gain over the past month, indicating potential continuation of the bullish trend.`
    });
  } else if (changes.month < -5) {
    insights.push({
      type: 'bearish',
      message: `${symbol} has declined ${Math.abs(changes.month).toFixed(1)}% over the past month, suggesting persistent selling pressure.`
    });
  } else {
    insights.push({
      type: 'neutral',
      message: `${symbol} price action remains relatively stable with a ${changes.month.toFixed(1)}% change over the past month.`
    });
  }

  // Volatility insight
  if (changes.volatility > 1000) {
    insights.push({
      type: 'neutral',
      message: `High volatility detected with ${changes.volatility.toFixed(0)} standard deviation, suggesting increased trading opportunities but higher risk.`
    });
  } else {
    insights.push({
      type: 'neutral',
      message: `Market volatility remains within normal ranges, suitable for both short and long-term positions.`
    });
  }

  // Short-term momentum insight
  if (changes.day > 2 && changes.week > 5) {
    insights.push({
      type: 'bullish',
      message: `Strong buying pressure with ${changes.day.toFixed(1)}% daily and ${changes.week.toFixed(1)}% weekly gains, indicating positive momentum.`
    });
  } else if (changes.day < -2 && changes.week < -5) {
    insights.push({
      type: 'bearish',
      message: `Significant selling pressure with ${Math.abs(changes.day).toFixed(1)}% daily and ${Math.abs(changes.week).toFixed(1)}% weekly losses.`
    });
  } else {
    insights.push({
      type: 'neutral',
      message: `Short-term price action shows mixed signals with balanced buying and selling pressure.`
    });
  }

  return insights;
}

function getDefaultInsights() {
  return [
    {
      type: 'neutral',
      message: 'Technical analysis shows mixed signals. Consider monitoring key support and resistance levels.'
    },
    {
      type: 'neutral',
      message: 'Market sentiment appears neutral with balanced buying and selling pressure.'
    },
    {
      type: 'neutral',
      message: 'Volatility remains within normal ranges, suitable for both short and long-term positions.'
    }
  ];
}