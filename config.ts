import { GameType } from './types';

// ==================================================================================
// 🏆 TOURNAMENT CONFIGURATION
// ==================================================================================

export const TOURNAMENT_CONFIG = {
    seasonName: "Season 4",
    isLive: true,

    // Admin Access Control
    // Add your email here to access the admin panel
    adminEmails: ["sam@gmail.com"],
    superAdminEmails: ["samratchabc123@gmail.com"],

    // Hero Section Texts
    hero: {
        titleLine1: "BATTLE FOR",
        titleLine2: "GLORY", // This part is styled with the primary color and italic
        description: "Join the elite circle of mobile esports. Compete against the best and claim your legacy.",
    },

    // Prize Pool Section
    prizePool: {
        totalAmount: "₹15,000",
        status: "Growing every minute"
    },

    // Countdown Timer Target Date
    // Format: YYYY-MM-DDTHH:mm:ss
    countdownTarget: "2023-10-30T18:00:00",

    // Creator Credits
    creator: {
        name: "Sreya Prasanna Chowdhury",
        role: "Tournament Director",
        avatar: "/assets/creator-avatar.png", // Placeholder, will be replaced by generated image
        instagram: "https://www.instagram.com/samrat_chowdhury___?igsh=NTc4MTIwNjQ2YQ=="
    },

    // Payment Configuration
    payment: {
        // If qrCodeImage is provided, it will be used instead of the generated one.
        // Place your QR code image in the public/assets folder.
        qrCodeImage: "/assets/payment-qr.png",
        upiId: "tournament@upi" // Fallback UPI ID
    }
};

// ==================================================================================
// 🎮 GAME CONFIGURATION
// ==================================================================================

export const GAMES_CONFIG = {
    [GameType.FREE_FIRE]: {
        id: 'ff',
        name: 'Free Fire',
        fee: 100, // Entry fee in currency
        prize: '₹5000',
        date: 'Oct 25, 2023',
        time: '20:00 GMT',
        slotsTotal: 100,
        slotsFilled: 42,
        color: 'text-orange-500',
        borderColor: 'border-orange-500',
        neonBorder: 'neon-border-orange',
        accentColor: 'bg-accent-orange',
        shadowColor: 'shadow-[0_4px_20px_rgba(255,107,0,0.3)]',
        bgGradient: 'from-orange-900/20 to-transparent',
        image: 'https://wallpapers.com/images/hd/free-fire-hoodie-banner-gpfrxk4b25jk8c0y.jpg'
    },
    [GameType.BGMI]: {
        id: 'bgmi',
        name: 'BGMI',
        fee: 100,
        prize: '₹5000',
        date: 'Oct 28, 2023',
        time: '15:30 GMT',
        slotsTotal: 100,
        slotsFilled: 88,
        color: 'text-green-500',
        borderColor: 'border-green-500',
        neonBorder: 'neon-border-yellow', // Using yellow for BGMI as per Stitch design
        accentColor: 'bg-accent-yellow',
        shadowColor: 'shadow-[0_4px_20px_rgba(255,204,0,0.3)]',
        bgGradient: 'from-green-900/20 to-transparent',
        image: 'https://tse1.mm.bing.net/th/id/OIP.UbtgBS_nwpNZyNGfsF5laQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    [GameType.MOBILE_LEGENDS]: {
        id: 'mlbb',
        name: 'Mobile Legends',
        fee: 100,
        prize: '₹5000',
        date: 'Oct 30, 2023',
        time: '18:00 GMT',
        slotsTotal: 64,
        slotsFilled: 12,
        color: 'text-purple-500',
        borderColor: 'border-purple-500',
        neonBorder: 'neon-border-purple',
        accentColor: 'bg-accent-purple',
        shadowColor: 'shadow-[0_4px_20px_rgba(168,85,247,0.3)]',
        bgGradient: 'from-purple-900/20 to-transparent',
        image: 'https://tse1.mm.bing.net/th/id/OIP.C4Dw0hSHxTHI_HRlSaQBxQHaDt?rs=1&pid=ImgDetMain&o=7&rm=3'
    }
};
