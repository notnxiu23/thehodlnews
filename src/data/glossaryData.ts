interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
  seeAlso?: string[];
}

interface GlossaryData {
  basicConcepts: GlossaryTerm[];
  tradingAndInvesting: GlossaryTerm[];
  blockchainAndTechnical: GlossaryTerm[];
  defi: GlossaryTerm[];
  securityAndPrivacy: GlossaryTerm[];
  nftAndMetaverse: GlossaryTerm[];
  miscellaneous: GlossaryTerm[];
  beginnerFriendly: GlossaryTerm[];
  forFun: GlossaryTerm[];
}

export const cryptoGlossary: GlossaryData = {
  basicConcepts: [
    {
      term: "Bitcoin (BTC)",
      definition: "The first cryptocurrency, created by Satoshi Nakamoto, often referred to as digital gold.",
      seeAlso: ["Blockchain", "Cryptocurrency"]
    },
    {
      term: "Blockchain",
      definition: "A decentralized ledger technology that records all transactions across a network.",
      seeAlso: ["Bitcoin (BTC)", "Decentralization"]
    },
    {
      term: "Altcoin",
      definition: "Any cryptocurrency other than Bitcoin.",
      example: "Ethereum, Solana, Cardano",
      seeAlso: ["Bitcoin (BTC)", "Cryptocurrency"]
    },
    {
      term: "Token",
      definition: "A digital asset built on an existing blockchain.",
      example: "ERC-20 tokens on Ethereum",
      seeAlso: ["Smart Contract", "DeFi"]
    },
    {
      term: "Cryptocurrency",
      definition: "A digital or virtual currency secured by cryptography, typically decentralized.",
      seeAlso: ["Bitcoin (BTC)", "Altcoin"]
    }
  ],
  tradingAndInvesting: [
    {
      term: "HODL",
      definition: "A misspelling of 'hold,' meaning to keep your cryptocurrency instead of selling.",
      example: "I'm going to HODL my Bitcoin through this market dip.",
      seeAlso: ["Diamond Hands", "Paper Hands"]
    },
    {
      term: "FOMO",
      definition: "Fear Of Missing Out - The anxiety of missing out on potential profits in the market.",
      seeAlso: ["FUD", "DYOR"]
    },
    {
      term: "FUD",
      definition: "Fear, Uncertainty, and Doubt - Negative news or rumors intended to create panic selling.",
      seeAlso: ["FOMO", "DYOR"]
    },
    {
      term: "Bull Market",
      definition: "A market characterized by rising prices.",
      seeAlso: ["Bear Market", "ATH"]
    },
    {
      term: "Bear Market",
      definition: "A market characterized by falling prices.",
      seeAlso: ["Bull Market", "HODL"]
    }
  ],
  blockchainAndTechnical: [
    {
      term: "Decentralization",
      definition: "The process of distributing control across a network rather than a single authority.",
      seeAlso: ["Blockchain", "Node"]
    },
    {
      term: "Mining",
      definition: "The process of validating transactions and adding them to the blockchain. Miners are rewarded with crypto.",
      seeAlso: ["Proof of Work", "Node"]
    },
    {
      term: "Staking",
      definition: "Locking up your cryptocurrency to support a network and earn rewards.",
      seeAlso: ["Proof of Stake", "Yield Farming"]
    },
    {
      term: "Smart Contract",
      definition: "Self-executing contracts with terms directly written into code.",
      seeAlso: ["DeFi", "Token"]
    },
    {
      term: "Gas Fee",
      definition: "The transaction fee paid to miners or validators for processing transactions on a blockchain.",
      seeAlso: ["Mining", "Transaction"]
    }
  ],
  defi: [
    {
      term: "DeFi",
      definition: "Decentralized Finance - A blockchain-based form of finance that doesn't rely on traditional financial institutions.",
      seeAlso: ["Smart Contract", "Yield Farming"]
    },
    {
      term: "Yield Farming",
      definition: "Earning rewards by lending or staking cryptocurrency in DeFi platforms.",
      seeAlso: ["Staking", "Liquidity Pool"]
    },
    {
      term: "Liquidity Pool",
      definition: "A pool of crypto funds locked in a smart contract to facilitate trading on decentralized exchanges.",
      seeAlso: ["DEX", "DeFi"]
    },
    {
      term: "Stablecoin",
      definition: "Cryptocurrencies pegged to a stable asset like the US dollar.",
      example: "USDT, USDC",
      seeAlso: ["DeFi", "Token"]
    }
  ],
  securityAndPrivacy: [
    {
      term: "Private Key",
      definition: "A secret key used to access your cryptocurrency. It must be kept secure.",
      seeAlso: ["Public Key", "Wallet"]
    },
    {
      term: "Public Key",
      definition: "A cryptographic code that allows users to receive cryptocurrencies.",
      seeAlso: ["Private Key", "Address"]
    },
    {
      term: "Cold Wallet",
      definition: "A crypto wallet not connected to the internet, offering maximum security.",
      seeAlso: ["Hot Wallet", "Hardware Wallet"]
    },
    {
      term: "Hot Wallet",
      definition: "A crypto wallet connected to the internet, suitable for frequent transactions.",
      seeAlso: ["Cold Wallet", "Security"]
    }
  ],
  nftAndMetaverse: [
    {
      term: "NFT",
      definition: "Non-Fungible Token - Unique digital assets stored on a blockchain, often used for art, collectibles, or gaming items.",
      seeAlso: ["Token", "Minting"]
    },
    {
      term: "Minting",
      definition: "The process of creating an NFT on a blockchain.",
      seeAlso: ["NFT", "Smart Contract"]
    },
    {
      term: "Metaverse",
      definition: "A virtual world where users can interact using digital assets like NFTs and cryptocurrencies.",
      seeAlso: ["NFT", "Virtual Reality"]
    }
  ],
  miscellaneous: [
    {
      term: "ICO",
      definition: "Initial Coin Offering - A fundraising method where new cryptocurrencies are sold to investors.",
      seeAlso: ["IDO", "Token"]
    },
    {
      term: "Airdrop",
      definition: "Free tokens distributed to users as a promotional strategy.",
      seeAlso: ["Token", "Marketing"]
    },
    {
      term: "Hard Fork",
      definition: "A permanent divergence in a blockchain resulting in two separate chains.",
      example: "Bitcoin and Bitcoin Cash",
      seeAlso: ["Soft Fork", "Blockchain"]
    }
  ],
  beginnerFriendly: [
    {
      term: "DYOR",
      definition: "Do Your Own Research - A reminder to research thoroughly before investing.",
      seeAlso: ["FOMO", "FUD"]
    },
    {
      term: "Paper Hands",
      definition: "Someone who sells their crypto at the first sign of trouble.",
      seeAlso: ["Diamond Hands", "HODL"]
    },
    {
      term: "Diamond Hands",
      definition: "Someone who holds onto their crypto despite volatility or market drops.",
      seeAlso: ["Paper Hands", "HODL"]
    }
  ],
  forFun: [
    {
      term: "WAGMI",
      definition: "We're All Gonna Make It - A popular phrase in the crypto community indicating optimism.",
      seeAlso: ["NGMI"]
    },
    {
      term: "NGMI",
      definition: "Not Gonna Make It - A term used humorously for bad decisions or skepticism in the market.",
      seeAlso: ["WAGMI", "REKT"]
    },
    {
      term: "REKT",
      definition: "A term for getting wrecked, or suffering significant losses in trading.",
      seeAlso: ["Bag Holder", "Paper Hands"]
    },
    {
      term: "To The Moon",
      definition: "A phrase used when cryptocurrency prices are expected to rise significantly.",
      example: "Bitcoin is going to the moon!",
      seeAlso: ["Bull Market", "ATH"]
    }
  ]
};