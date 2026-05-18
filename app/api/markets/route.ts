import { NextResponse } from 'next/server';

export const revalidate = 0; // Disable server-side static cache so prices tick in real-time

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'crypto' | 'equity' | 'forex' | 'commodity';
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
  logo: string;
  lastUpdated: string;
}

// 50 Crypto Assets
const CRYPTO_DEFS = [
  { symbol: "BTC", name: "Bitcoin", basePrice: 64250.00, marketCap: 1260000000000 },
  { symbol: "ETH", name: "Ethereum", basePrice: 3450.00, marketCap: 414000000000 },
  { symbol: "BNB", name: "BNB", basePrice: 580.00, marketCap: 89000000000 },
  { symbol: "SOL", name: "Solana", basePrice: 145.50, marketCap: 67000000000 },
  { symbol: "XRP", name: "Ripple", basePrice: 0.52, marketCap: 29000000000 },
  { symbol: "ADA", name: "Cardano", basePrice: 0.45, marketCap: 16000000000 },
  { symbol: "DOGE", name: "Dogecoin", basePrice: 0.14, marketCap: 20000000000 },
  { symbol: "SHIB", name: "Shiba Inu", basePrice: 0.000022, marketCap: 13000000000 },
  { symbol: "DOT", name: "Polkadot", basePrice: 6.80, marketCap: 9800000000 },
  { symbol: "LINK", name: "Chainlink", basePrice: 15.40, marketCap: 9000000000 },
  { symbol: "AVAX", name: "Avalanche", basePrice: 32.20, marketCap: 12500000000 },
  { symbol: "MATIC", name: "Polygon", basePrice: 0.65, marketCap: 6400000000 },
  { symbol: "TON", name: "Toncoin", basePrice: 7.20, marketCap: 18000000000 },
  { symbol: "TRX", name: "TRON", basePrice: 0.12, marketCap: 10500000000 },
  { symbol: "LTC", name: "Litecoin", basePrice: 82.30, marketCap: 6100000000 },
  { symbol: "NEAR", name: "Near Protocol", basePrice: 5.90, marketCap: 6300000000 },
  { symbol: "UNI", name: "Uniswap", basePrice: 7.80, marketCap: 4600000000 },
  { symbol: "APT", name: "Aptos", basePrice: 8.40, marketCap: 3800000000 },
  { symbol: "ATOM", name: "Cosmos", basePrice: 8.20, marketCap: 3200000000 },
  { symbol: "OP", name: "Optimism", basePrice: 2.45, marketCap: 2600000000 },
  { symbol: "ARB", name: "Arbitrum", basePrice: 0.95, marketCap: 2500000000 },
  { symbol: "SUI", name: "Sui", basePrice: 1.05, marketCap: 2700000000 },
  { symbol: "ICP", name: "Internet Computer", basePrice: 11.80, marketCap: 5400000000 },
  { symbol: "FIL", name: "Filecoin", basePrice: 5.40, marketCap: 2900000000 },
  { symbol: "VET", name: "VeChain", basePrice: 0.03, marketCap: 2100000000 },
  { symbol: "MKR", name: "Maker", basePrice: 2450.00, marketCap: 2200000000 },
  { symbol: "LDO", name: "Lido DAO", basePrice: 1.85, marketCap: 1650000000 },
  { symbol: "RNDR", name: "Render Network", basePrice: 7.90, marketCap: 3000000000 },
  { symbol: "GRT", name: "The Graph", basePrice: 0.28, marketCap: 2600000000 },
  { symbol: "XLM", name: "Stellar", basePrice: 0.09, marketCap: 2750000000 },
  { symbol: "FTM", name: "Fantom", basePrice: 0.72, marketCap: 2000000000 },
  { symbol: "IMX", name: "Immutable", basePrice: 1.95, marketCap: 2800000000 },
  { symbol: "KAS", name: "Kaspa", basePrice: 0.13, marketCap: 3100000000 },
  { symbol: "THETA", name: "Theta Network", basePrice: 2.10, marketCap: 2100000000 },
  { symbol: "RUNE", name: "THORChain", basePrice: 5.15, marketCap: 1700000000 },
  { symbol: "ALGO", name: "Algorand", basePrice: 0.16, marketCap: 1300000000 },
  { symbol: "FLOW", name: "Flow", basePrice: 0.85, marketCap: 1250000000 },
  { symbol: "EGLD", name: "MultiversX", basePrice: 32.50, marketCap: 870000000 },
  { symbol: "SAND", name: "The Sandbox", basePrice: 0.42, marketCap: 950000000 },
  { symbol: "MANA", name: "Decentraland", basePrice: 0.40, marketCap: 760000000 },
  { symbol: "CHZ", name: "Chiliz", basePrice: 0.11, marketCap: 980000000 },
  { symbol: "AAVE", name: "Aave", basePrice: 88.00, marketCap: 1300000000 },
  { symbol: "AXS", name: "Axie Infinity", basePrice: 6.80, marketCap: 950000000 },
  { symbol: "HBAR", name: "Hedera", basePrice: 0.075, marketCap: 2600000000 },
  { symbol: "QNT", name: "Quant", basePrice: 94.00, marketCap: 1100000000 },
  { symbol: "MINA", name: "Mina Protocol", basePrice: 0.68, marketCap: 750000000 },
  { symbol: "INJ", name: "Injective", basePrice: 24.50, marketCap: 2300000000 },
  { symbol: "STX", name: "Stacks", basePrice: 1.85, marketCap: 2700000000 },
  { symbol: "SEI", name: "Sei", basePrice: 0.52, marketCap: 1500000000 },
  { symbol: "WIF", name: "dogwifhat", basePrice: 2.80, marketCap: 2800000000 }
];

// 50 Equity Assets
const EQUITY_DEFS = [
  { symbol: "AAPL", name: "Apple Inc.", basePrice: 189.50, marketCap: 2950000000000 },
  { symbol: "MSFT", name: "Microsoft Corp.", basePrice: 422.00, marketCap: 3130000000000 },
  { symbol: "NVDA", name: "NVIDIA Corp.", basePrice: 890.00, marketCap: 2220000000000 },
  { symbol: "AMZN", name: "Amazon.com Inc.", basePrice: 182.00, marketCap: 1890000000000 },
  { symbol: "GOOGL", name: "Alphabet Inc.", basePrice: 171.00, marketCap: 2150000000000 },
  { symbol: "META", name: "Meta Platforms Inc.", basePrice: 472.00, marketCap: 1200000000000 },
  { symbol: "TSLA", name: "Tesla Inc.", basePrice: 174.50, marketCap: 556000000000 },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc.", basePrice: 405.00, marketCap: 878000000000 },
  { symbol: "LLY", name: "Eli Lilly & Co.", basePrice: 765.00, marketCap: 726000000000 },
  { symbol: "AVGO", name: "Broadcom Inc.", basePrice: 1350.00, marketCap: 627000000000 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", basePrice: 198.50, marketCap: 570000000000 },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", basePrice: 512.00, marketCap: 473000000000 },
  { symbol: "V", name: "Visa Inc.", basePrice: 278.00, marketCap: 580000000000 },
  { symbol: "XOM", name: "Exxon Mobil Corp.", basePrice: 118.00, marketCap: 468000000000 },
  { symbol: "MA", name: "Mastercard Inc.", basePrice: 455.00, marketCap: 421000000000 },
  { symbol: "JNJ", name: "Johnson & Johnson", basePrice: 154.50, marketCap: 372000000000 },
  { symbol: "PG", name: "Procter & Gamble Co.", basePrice: 164.00, marketCap: 395000000000 },
  { symbol: "HD", name: "Home Depot Inc.", basePrice: 345.00, marketCap: 343000000000 },
  { symbol: "COST", name: "Costco Wholesale Corp.", basePrice: 725.00, marketCap: 322000000000 },
  { symbol: "MRK", name: "Merck & Co. Inc.", basePrice: 126.00, marketCap: 319000000000 },
  { symbol: "AMD", name: "Advanced Micro Devices", basePrice: 165.00, marketCap: 266000000000 },
  { symbol: "NFLX", name: "Netflix Inc.", basePrice: 610.00, marketCap: 263000000000 },
  { symbol: "PEP", name: "PepsiCo Inc.", basePrice: 178.00, marketCap: 244000000000 },
  { symbol: "KO", name: "Coca-Cola Co.", basePrice: 62.50, marketCap: 270000000000 },
  { symbol: "CVX", name: "Chevron Corp.", basePrice: 159.00, marketCap: 298000000000 },
  { symbol: "TSM", name: "Taiwan Semiconductor", basePrice: 138.50, marketCap: 718000000000 },
  { symbol: "ADBE", name: "Adobe Inc.", basePrice: 485.00, marketCap: 218000000000 },
  { symbol: "ORCL", name: "Oracle Corp.", basePrice: 122.00, marketCap: 335000000000 },
  { symbol: "WMT", name: "Walmart Inc.", basePrice: 60.20, marketCap: 482000000000 },
  { symbol: "MCD", name: "McDonald's Corp.", basePrice: 272.00, marketCap: 196000000000 },
  { symbol: "CRM", name: "Salesforce Inc.", basePrice: 285.00, marketCap: 276000000000 },
  { symbol: "CSCO", name: "Cisco Systems Inc.", basePrice: 48.50, marketCap: 195000000000 },
  { symbol: "BAC", name: "Bank of America Corp.", basePrice: 38.20, marketCap: 298000000000 },
  { symbol: "ABT", name: "Abbott Laboratories", basePrice: 108.00, marketCap: 187000000000 },
  { symbol: "QCOM", name: "QUALCOMM Inc.", basePrice: 180.50, marketCap: 201000000000 },
  { symbol: "AMGN", name: "Amgen Inc.", basePrice: 284.00, marketCap: 152000000000 },
  { symbol: "GE", name: "General Electric Co.", basePrice: 158.00, marketCap: 172000000000 },
  { symbol: "INTU", name: "Intuit Inc.", basePrice: 622.00, marketCap: 174000000000 },
  { symbol: "ISRG", name: "Intuitive Surgical", basePrice: 388.00, marketCap: 138000000000 },
  { symbol: "CAT", name: "Caterpillar Inc.", basePrice: 342.00, marketCap: 169000000000 },
  { symbol: "DIS", name: "The Walt Disney Co.", basePrice: 112.50, marketCap: 206000000000 },
  { symbol: "TXN", name: "Texas Instruments Inc.", basePrice: 188.00, marketCap: 171000000000 },
  { symbol: "AXP", name: "American Express Co.", basePrice: 232.00, marketCap: 167000000000 },
  { symbol: "IBM", name: "IBM Corp.", basePrice: 168.00, marketCap: 154000000000 },
  { symbol: "PM", name: "Philip Morris Int.", basePrice: 99.50, marketCap: 155000000000 },
  { symbol: "NEE", name: "NextEra Energy Inc.", basePrice: 68.40, marketCap: 140000000000 },
  { symbol: "MS", name: "Morgan Stanley", basePrice: 94.20, marketCap: 153000000000 },
  { symbol: "HON", name: "Honeywell International", basePrice: 196.50, marketCap: 128000000000 },
  { symbol: "SPGI", name: "S&P Global Inc.", basePrice: 428.00, marketCap: 134000000000 },
  { symbol: "NKE", name: "Nike Inc.", basePrice: 92.50, marketCap: 139000000000 }
];

// 50 Forex Assets
const FOREX_DEFS = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", basePrice: 1.0850 },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", basePrice: 1.2580 },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", basePrice: 155.40 },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", basePrice: 0.6650 },
  { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", basePrice: 1.3620 },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", basePrice: 0.9080 },
  { symbol: "NZD/USD", name: "New Zealand Dollar / US Dollar", basePrice: 0.6080 },
  { symbol: "EUR/GBP", name: "Euro / British Pound", basePrice: 0.8620 },
  { symbol: "EUR/JPY", name: "Euro / Japanese Yen", basePrice: 168.60 },
  { symbol: "GBP/JPY", name: "British Pound / Japanese Yen", basePrice: 195.50 },
  { symbol: "AUD/JPY", name: "Australian Dollar / Japanese Yen", basePrice: 103.40 },
  { symbol: "CAD/JPY", name: "Canadian Dollar / Japanese Yen", basePrice: 114.10 },
  { symbol: "CHF/JPY", name: "Swiss Franc / Japanese Yen", basePrice: 171.20 },
  { symbol: "EUR/AUD", name: "Euro / Australian Dollar", basePrice: 1.6320 },
  { symbol: "EUR/CAD", name: "Euro / Canadian Dollar", basePrice: 1.4780 },
  { symbol: "EUR/CHF", name: "Euro / Swiss Franc", basePrice: 0.9850 },
  { symbol: "EUR/NZD", name: "Euro / New Zealand Dollar", basePrice: 1.7840 },
  { symbol: "GBP/AUD", name: "British Pound / Australian Dollar", basePrice: 1.8920 },
  { symbol: "GBP/CAD", name: "British Pound / Canadian Dollar", basePrice: 1.7140 },
  { symbol: "GBP/CHF", name: "British Pound / Swiss Franc", basePrice: 1.1420 },
  { symbol: "GBP/NZD", name: "British Pound / New Zealand Dollar", basePrice: 2.0680 },
  { symbol: "AUD/CAD", name: "Australian Dollar / Canadian Dollar", basePrice: 0.9060 },
  { symbol: "AUD/CHF", name: "Australian Dollar / Swiss Franc", basePrice: 0.6040 },
  { symbol: "AUD/NZD", name: "Australian Dollar / New Zealand Dollar", basePrice: 1.0930 },
  { symbol: "CAD/CHF", name: "Canadian Dollar / Swiss Franc", basePrice: 0.6670 },
  { symbol: "NZD/CAD", name: "New Zealand Dollar / Canadian Dollar", basePrice: 0.8280 },
  { symbol: "NZD/CHF", name: "New Zealand Dollar / Swiss Franc", basePrice: 0.5520 },
  { symbol: "USD/HKD", name: "US Dollar / Hong Kong Dollar", basePrice: 7.8120 },
  { symbol: "USD/SGD", name: "US Dollar / Singapore Dollar", basePrice: 1.3480 },
  { symbol: "USD/TRY", name: "US Dollar / Turkish Lira", basePrice: 32.25 },
  { symbol: "USD/MXN", name: "US Dollar / Mexican Peso", basePrice: 16.78 },
  { symbol: "USD/ZAR", name: "US Dollar / South African Rand", basePrice: 18.25 },
  { symbol: "USD/SEK", name: "US Dollar / Swedish Krona", basePrice: 10.65 },
  { symbol: "USD/NOK", name: "US Dollar / Norwegian Krone", basePrice: 10.72 },
  { symbol: "USD/DKK", name: "US Dollar / Danish Krone", basePrice: 6.89 },
  { symbol: "USD/CNH", name: "US Dollar / Chinese Renminbi", basePrice: 7.24 },
  { symbol: "EUR/TRY", name: "Euro / Turkish Lira", basePrice: 35.02 },
  { symbol: "EUR/SEK", name: "Euro / Swedish Krona", basePrice: 11.55 },
  { symbol: "EUR/NOK", name: "Euro / Norwegian Krone", basePrice: 11.63 },
  { symbol: "EUR/ZAR", name: "Euro / South African Rand", basePrice: 19.82 },
  { symbol: "EUR/SGD", name: "Euro / Singapore Dollar", basePrice: 1.4620 },
  { symbol: "GBP/SGD", name: "British Pound / Singapore Dollar", basePrice: 1.6960 },
  { symbol: "GBP/TRY", name: "British Pound / Turkish Lira", basePrice: 40.58 },
  { symbol: "AUD/SGD", name: "Australian Dollar / Singapore Dollar", basePrice: 0.8970 },
  { symbol: "NZD/SGD", name: "New Zealand Dollar / Singapore Dollar", basePrice: 0.8200 },
  { symbol: "EUR/CNH", name: "Euro / Chinese Renminbi", basePrice: 7.86 },
  { symbol: "GBP/CNH", name: "British Pound / Chinese Renminbi", basePrice: 9.12 },
  { symbol: "USD/INR", name: "US Dollar / Indian Rupee", basePrice: 83.35 },
  { symbol: "EUR/INR", name: "Euro / Indian Rupee", basePrice: 90.45 },
  { symbol: "USD/KRW", name: "US Dollar / South Korean Won", basePrice: 1358.00 }
];

export async function GET() {
  try {
    const timestamp = new Date().toISOString();
    
    // Time-based factor to oscillate prices dynamically over time.
    // Changes smoothly every 10 seconds.
    const timeFactor = Date.now() / 10000;
    
    const assets: Asset[] = [];

    // 1. Generate Crypto
    CRYPTO_DEFS.forEach((c, index) => {
      const uniqueOffset = index * 1.5;
      const wave = Math.sin(timeFactor + uniqueOffset) * 0.006 + (Math.random() * 0.001 - 0.0005);
      
      const price = c.basePrice * (1 + wave);
      const changePercent24h = Math.sin(timeFactor * 0.1 + uniqueOffset) * 4.5 + Math.cos(timeFactor * 0.05) * 1.5;
      const change24h = price * (changePercent24h / 100);
      const volume24h = (c.marketCap * 0.035) * (1 + Math.sin(timeFactor * 0.02) * 0.2);

      // Generate a simulated sparkline for 7 days (24 points)
      const sparkline = Array.from({ length: 24 }).map((_, step) => {
        return c.basePrice * (1 + Math.sin(step * 0.3 + uniqueOffset) * 0.02 + Math.cos(step * 0.1) * 0.01);
      });
      // Set the last point exactly to the current price
      sparkline[sparkline.length - 1] = price;

      // Stable CDNs for logos
      let logo = "";
      if (["BTC", "ETH", "SOL", "ADA", "XRP", "DOT", "LINK", "AVAX", "MATIC", "TON", "TRX", "LTC", "NEAR", "UNI", "APT", "ATOM", "OP", "ARB", "SUI", "ICP", "FIL", "VET", "MKR", "LDO", "RNDR", "GRT", "XLM", "FTM", "IMX", "AAVE"].includes(c.symbol)) {
        logo = `https://assets.coincap.io/assets/icons/${c.symbol.toLowerCase()}@2x.png`;
      }

      assets.push({
        id: c.symbol.toLowerCase(),
        symbol: c.symbol,
        name: c.name,
        type: 'crypto',
        price,
        change24h,
        changePercent24h,
        volume24h,
        marketCap: c.marketCap,
        sparkline,
        logo,
        lastUpdated: timestamp,
      });
    });

    // 2. Generate Equities
    EQUITY_DEFS.forEach((e, index) => {
      const uniqueOffset = index * 2.3;
      const wave = Math.sin(timeFactor * 0.8 + uniqueOffset) * 0.003 + (Math.random() * 0.0005 - 0.00025);
      
      const price = e.basePrice * (1 + wave);
      const changePercent24h = Math.sin(timeFactor * 0.08 + uniqueOffset) * 2.2 + Math.cos(timeFactor * 0.03) * 0.8;
      const change24h = price * (changePercent24h / 100);
      const volume24h = (e.marketCap * 0.008) * (1 + Math.sin(timeFactor * 0.01) * 0.15);

      const sparkline = Array.from({ length: 24 }).map((_, step) => {
        return e.basePrice * (1 + Math.sin(step * 0.25 + uniqueOffset) * 0.015 + Math.cos(step * 0.08) * 0.005);
      });
      sparkline[sparkline.length - 1] = price;

      // Stable Clearbit logo fallbacks for highly recognizable equities
      let logo = "";
      if (["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA", "NFLX", "KO", "PEP", "WMT", "MCD", "DIS", "NKE", "IBM"].includes(e.symbol)) {
        const domain = e.symbol === "AAPL" ? "apple.com" :
                       e.symbol === "MSFT" ? "microsoft.com" :
                       e.symbol === "NVDA" ? "nvidia.com" :
                       e.symbol === "AMZN" ? "amazon.com" :
                       e.symbol === "GOOGL" ? "google.com" :
                       e.symbol === "META" ? "meta.com" :
                       e.symbol === "TSLA" ? "tesla.com" :
                       e.symbol === "NFLX" ? "netflix.com" :
                       e.symbol === "KO" ? "cocacola.com" :
                       e.symbol === "PEP" ? "pepsico.com" :
                       e.symbol === "WMT" ? "walmart.com" :
                       e.symbol === "MCD" ? "mcdonalds.com" :
                       e.symbol === "DIS" ? "disney.com" :
                       e.symbol === "NKE" ? "nike.com" : "ibm.com";
        logo = `https://logo.clearbit.com/${domain}`;
      }

      assets.push({
        id: e.symbol.toLowerCase(),
        symbol: e.symbol,
        name: e.name,
        type: 'equity',
        price,
        change24h,
        changePercent24h,
        volume24h,
        marketCap: e.marketCap,
        sparkline,
        logo,
        lastUpdated: timestamp,
      });
    });

    // 3. Generate Forex
    FOREX_DEFS.forEach((f, index) => {
      const uniqueOffset = index * 3.7;
      const wave = Math.sin(timeFactor * 0.5 + uniqueOffset) * 0.0015 + (Math.random() * 0.0002 - 0.0001);
      
      const price = f.basePrice * (1 + wave);
      const changePercent24h = Math.sin(timeFactor * 0.05 + uniqueOffset) * 0.8 + Math.cos(timeFactor * 0.02) * 0.2;
      const change24h = price * (changePercent24h / 100);
      
      // Simulated metrics for Forex (typically has huge volume but no true market cap)
      const volume24h = 8500000000 + Math.abs(Math.sin(timeFactor * 0.01 + uniqueOffset)) * 12000000000;
      const marketCap = 0; // Forex pairs do not have market cap in a standard table

      const sparkline = Array.from({ length: 24 }).map((_, step) => {
        return f.basePrice * (1 + Math.sin(step * 0.2 + uniqueOffset) * 0.005 + Math.cos(step * 0.05) * 0.002);
      });
      sparkline[sparkline.length - 1] = price;

      assets.push({
        id: f.symbol.replace("/", "-").toLowerCase(),
        symbol: f.symbol,
        name: f.name,
        type: 'forex',
        price,
        change24h,
        changePercent24h,
        volume24h,
        marketCap,
        sparkline,
        logo: "", // Forex works beautifully with fallback initials badges
        lastUpdated: timestamp,
      });
    });

    return NextResponse.json(assets);

  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json({ error: 'Failed to generate market data' }, { status: 500 });
  }
}
