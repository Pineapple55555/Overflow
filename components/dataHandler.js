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
  
      const positions = new Set();
  
      // Generate a unique hash for each position using the position index
      for (let i = 0; positions.size < this.bitCount * 2; i++) {
        const positionSeed = `${hash}-${i}`; // Combine the original hash with the position index
        const positionHash = await this.generateHash(positionSeed);
  
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
  
  async function getRandomLineFromJson(fileUrl, min = 2) {
    // Fetch the JSON file
    return fetch(fileUrl)
      .then(response => response.json())  // Parse the JSON data
      .then(data => {
        // Ensure the data is an array and contains at least 'min' entries
        if (Array.isArray(data) && data.length >= min) {
          // Generate a random index between min-1 and the length of the array
          const randomIndex = Math.floor(Math.random() * (data.length - min + 1)) + min - 1;
          
          // Return the random line
          return { index: randomIndex, line: data[randomIndex] };
        } else {
          throw new Error('JSON data is not an array or doesn’t contain enough entries.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  
  