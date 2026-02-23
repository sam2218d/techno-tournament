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
        description: "All players must play without any cheat. If any player is found using any kind of hack or panel, the whole team will be disqualified. On the final match, the team members must be present on the TCEA campus. At least 2 players must be present on the campus during the final match mandatory. ",
    },

    prizePool: {
        baseAmount: 4000,
        incrementAmount: 0,
        incrementStep: 5,
        status: "Growing every minute"
    },

    // Countdown Timer Target Date
    // Format: YYYY-MM-DDTHH:mm:ss
    countdownTarget: "2026-02-27T13:00:00",

    // Creator Credits
    creator: {
        name: "Sreya Prasanna Chowdhury",
        role: "Tournament Director",
        avatar: "/assets/creator-avatar.png", // Placeholder, will be replaced by generated image
        instagram: "https://www.instagram.com/samrat_chowdhury___?igsh=NTc4MTIwNjQ2YQ=="
    },

    // WhatsApp Group Link (shown after registration)
    whatsappGroupLink: "https://chat.whatsapp.com/IPxvhd2cKTu7Kc4nKrll5H",

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
        prize: '₹4000',
        date: 'feb 27, 2026',
        time: '13:00',
        slotsTotal: 100,
        slotsFilled: 42,
        color: 'text-orange-500',
        borderColor: 'border-orange-500',
        neonBorder: 'neon-border-orange',
        accentColor: 'bg-accent-orange',
        shadowColor: 'shadow-[0_4px_20px_rgba(255,107,0,0.3)]',
        bgGradient: 'from-orange-900/20 to-transparent',
        image: 'https://wallpapers.com/images/hd/free-fire-hoodie-banner-gpfrxk4b25jk8c0y.jpg',
        prizeBreakdown: [
            { place: '1st', prize: '₹2,000', extra: 'Certificate' },
            { place: '2nd', prize: '₹1,000', extra: 'Certificate' },
            { place: '3rd', prize: '₹500', extra: 'Certificate' },
        ],
        pointSystem: {
            killPoints: 1, // Each kill = 1 point
            rankPoints: [
                { rank: '#1', points: 12 },
                { rank: '#2', points: 9 },
                { rank: '#3', points: 8 },
                { rank: '#4', points: 7 },
                { rank: '#5', points: 6 },
                { rank: '#6', points: 5 },
                { rank: '#7', points: 4 },
                { rank: '#8', points: 3 },
                { rank: '#9', points: 2 },
                { rank: '#10', points: 1 },
                { rank: '#11', points: 0 },
                { rank: '#12', points: 0 },
            ]
        }
    },
};
