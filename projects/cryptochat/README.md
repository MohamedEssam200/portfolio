# CryptoChat - Secure Encrypted Messaging

A modern, secure chat application built with Next.js featuring end-to-end encryption, real-time messaging, and advanced cryptographic security features.

## Features

- **End-to-End Encryption**: AES-256 encryption for all messages
- **Real-time Messaging**: Instant message delivery using WebSocket
- **Secure Key Exchange**: Diffie-Hellman key exchange protocol
- **Message Authentication**: Digital signatures for message integrity
- **Perfect Forward Secrecy**: New encryption keys for each session
- **Secure File Sharing**: Encrypted file transfers
- **Self-Destructing Messages**: Automatic message deletion
- **Anonymous Mode**: Optional anonymous messaging

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Real-time**: Socket.IO for WebSocket communication
- **Encryption**: CryptoJS for cryptographic operations
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Security Features

- **AES-256 Encryption**: Military-grade message encryption
- **RSA Key Exchange**: Secure key distribution
- **Message Integrity**: HMAC for message authentication
- **Forward Secrecy**: Ephemeral key generation
- **Zero-Knowledge**: Server cannot decrypt messages
- **Secure Storage**: Encrypted local message storage

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone https://github.com/MohamedEssam200/cryptochat.git
cd cryptochat
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Create a secure chat room or join an existing one
2. Exchange encryption keys securely
3. Start sending encrypted messages
4. Share files securely with end-to-end encryption
5. Use self-destructing messages for sensitive information

## Cryptographic Protocols

- AES-256-GCM for message encryption
- RSA-2048 for key exchange
- ECDH for perfect forward secrecy
- SHA-256 for message hashing
- HMAC-SHA256 for authentication

## License

MIT License - see LICENSE file for details.

## Author

Mohamed Essam - Computer Engineering Student & Cybersecurity Enthusiast
