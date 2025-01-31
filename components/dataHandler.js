// PositionGenerator.js

export class DataHandler {
  constructor(stockData, gridSize, bitCount) {
      this.stockData = stockData;
      this.gridSize = gridSize;
      this.bitCount = bitCount;
  }

  // ✅ Add generateHash() to the class
  async generateHash(seedData) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seedData));
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert hash buffer to byte array
      return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join(''); // Convert to hex string
  }
  async getStocks() {
    try {
      const response = await fetch('/components/stocks.json');
      const data = await response.json();
      const randomStock = data[Math.floor(Math.random() * data.length)];
      console.log("Selected Stock:", randomStock);
      return randomStock;  // ✅ Return the stock
  } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;  // Return null in case of an error
  }
}

  // ✅ Now generatePositions() can call generateHash()
  async generatePositions() {
    const stock = await this.getStocks();  // ✅ Wait for stock data
    if (!stock) {
      const { price_usd, market_cap } = this.stockData
      console.log("default data used for binary") 
    }

    const { price_usd, market_cap } = stock; 
    const seedData = `${price_usd}-${market_cap}`;

    // Hash the seed data once using Web Crypto API
    const hash = await this.generateHash(seedData);

    const positions = new Set();

    let i = 0;
    while (positions.size < this.bitCount * 2) {
        const positionSeed = `${hash}-${i}`;
        const positionHash = await this.generateHash(positionSeed);

        // ✅ Keep the original coordinate system
        let x = parseInt(positionHash.slice(0, 4), 16) % this.gridSize;
        let y = parseInt(positionHash.slice(4, 8), 16) % this.gridSize;

        // ✅ Only add the rule to exclude (0,0) and the 3×3 area around it
        if ((x >= this.gridSize / 2 - 1 && x <= this.gridSize / 2 + 1) && 
            (y >= this.gridSize / 2 - 1 && y <= this.gridSize / 2 + 1)) {
            console.log(`🚫 Skipping (${x}, ${y}) - too close to (0,0)`);
            i++; // Move to next hash
            continue;
        }

        positions.add(`${x},${y}`);
        i++; // Move to next hash
    }

    return Array.from(positions).map((pos, index) => {
        const [x, y] = pos.split(',').map(Number);
        return { x, y, value: index < this.bitCount ? 0 : 1 };
    });
}

}
  
  
  