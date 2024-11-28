// Utility function to split text into sentences
function splitIntoSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [];
}

// Score sentences based on importance factors
function scoreSentence(sentence: string, position: number, totalSentences: number): number {
  const words = sentence.split(/\s+/);
  
  // Scoring factors
  const positionScore = position === 0 ? 1.5 : position === totalSentences - 1 ? 1.2 : 1;
  const lengthScore = words.length >= 8 && words.length <= 25 ? 1.2 : 1;
  
  // Important phrases that indicate key information
  const importantPhrases = [
    'announced', 'launched', 'released', 'introduced',
    'partnered', 'developed', 'created', 'revealed',
    'increased', 'decreased', 'grew', 'declined',
    'reached', 'achieved', 'plans to', 'will be',
    'according to', 'reported', 'confirmed'
  ];
  
  const phraseScore = importantPhrases.some(phrase => 
    sentence.toLowerCase().includes(phrase)
  ) ? 1.3 : 1;

  // Cryptocurrency-specific terms
  const cryptoTerms = [
    'bitcoin', 'ethereum', 'blockchain', 'crypto',
    'token', 'defi', 'nft', 'mining', 'wallet',
    'exchange', 'trading', 'market', 'price'
  ];
  
  const cryptoScore = cryptoTerms.some(term => 
    sentence.toLowerCase().includes(term)
  ) ? 1.2 : 1;

  return positionScore * lengthScore * phraseScore * cryptoScore;
}

export function generateArticleSummary(text: string): string {
  // Split text into sentences
  const sentences = splitIntoSentences(text);
  
  if (sentences.length <= 2) {
    return text; // Return original text if it's already short
  }

  // Score each sentence
  const scoredSentences = sentences.map((sentence, index) => ({
    text: sentence,
    score: scoreSentence(sentence, index, sentences.length)
  }));

  // Sort by score and select top sentences (2-3 depending on length)
  const numSentences = sentences.length <= 5 ? 2 : 3;
  const selectedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => sentences.indexOf(a.text) - sentences.indexOf(b.text))
    .map(s => s.text);

  return selectedSentences.join(' ');
}