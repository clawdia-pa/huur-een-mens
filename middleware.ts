import { paymentMiddleware } from 'x402-next';

// Wallet address to receive USDC payments on Base
// Set X402_SELLER_WALLET in your environment variables
const SELLER_WALLET = (process.env.X402_SELLER_WALLET || "0x0000000000000000000000000000000000000000") as `0x${string}`;

// Facilitator handles payment verification and settlement
const facilitator = {
  url: "https://x402.org/facilitator" as `https://${string}`
};

// Protect the bookings API with x402 payments
// Agents pay $1.00 USDC per booking on Base Sepolia (testnet)
// Change to "base" for production with real USDC
export const middleware = paymentMiddleware(
  SELLER_WALLET,
  {
    '/api/bookings': {
      price: '$1.00',
      network: 'base-sepolia',
      config: {
        description: 'Book a human on HuurEenMens - pay with USDC on Base',
      }
    },
  },
  facilitator
);

export const config = {
  matcher: ['/api/bookings'],
  runtime: 'nodejs'
};
