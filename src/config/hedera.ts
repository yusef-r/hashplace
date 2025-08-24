/**
 * Hedera configuration constants
 */

// Hedera Testnet configuration
export const CANVAS_ACCOUNT_ID = "0.0.12345"; // Hardcoded testnet account
export const HEDERA_NETWORK = "testnet";
export const MIRROR_NODE_URL = "https://testnet.mirrornode.hedera.com";

// Canvas configuration
export const CANVAS_SIZE = 50; // 50x50 pixel grid
export const PIXEL_SIZE = 12; // Size of each pixel in the UI

// Default colors for the pixel art
export const DEFAULT_COLORS = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFFFFF", // White
  "#000000", // Black
  "#FF8000", // Orange
  "#8000FF", // Purple
];

// Transaction configuration
export const TRANSACTION_FEE = 0.001; // HBAR fee for placing a pixel
export const MEMO_PREFIX = "HEDERA_PLACE_PIXEL";