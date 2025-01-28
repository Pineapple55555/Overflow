// PositionGenerator.js

export class DataHandler {
    constructor(stockData, gridSize, bitCount) {
      this.stockData = stockData;
      this.gridSize = gridSize;
      this.bitCount = bitCount;
    }
  
    // Hash the stock data
    async generateHash(seedData) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seedData));
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert hash buffer to byte array
      return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join(''); // Convert to hex string
    }
  
    // Generate positions from stock data
    async generatePositions() {
      const { price_usd, market_cap } = this.stockData;
      const seedData = `${price_usd}-${market_cap}`;
  
      // Hash the seed data once using Web Crypto API
      const hash = await this.generateHash(seedData);
      console.log('Original Hash:', hash); // Log the original hash for reference
  
      const positions = new Set();
  
      // Generate a unique hash for each position using the position index
      for (let i = 0; positions.size < this.bitCount * 2; i++) {
        const positionSeed = `${hash}-${i}`; // Combine the original hash with the position index
        const positionHash = await this.generateHash(positionSeed);
        console.log(`Position Hash for index ${i}:`, positionHash); // Log each unique hash
  
        // Generate x and y coordinates based on parts of the position hash
        const x = parseInt(positionHash.slice(0, 4), 16) % this.gridSize; // Use the first 4 hex digits for x
        const y = parseInt(positionHash.slice(4, 8), 16) % this.gridSize; // Use the next 4 hex digits for y
  
        positions.add(`${x},${y}`); // Add position to set to ensure uniqueness
      }
  
      // Convert positions back to an array of objects with value
      return Array.from(positions).map((pos, index) => {
        const [x, y] = pos.split(',').map(Number);
        return { x, y, value: index < this.bitCount ? 0 : 1 }; // First half 0s, second half 1s
      });
    }
  }
  