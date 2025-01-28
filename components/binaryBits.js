import { DataHandler } from '/components/dataHandler.js';

export class Binary {
    constructor() {
    }

        async generateBinary() {
            const gridSize = 16; // Size of the board
            const bitCount = 8;  // Number of 0s and 1s to generate
            const stockData = { price_usd: 0.002312, market_cap: 1234567 }; // Example stock data

            const dataSet = new DataHandler(stockData, gridSize, bitCount);

            const positions = await dataSet.generatePositions();
            console.log('Generated Positions:', positions);
        
    }
}