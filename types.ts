export enum GameType {
  FREE_FIRE = 'Free Fire'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

export interface Player {
  name: string;
  uid: string;
}

export interface Team {
  id?: string;
  teamName: string;
  game: GameType;
  players: Player[]; // 0-3 are main, 4 is substitute
  substitute?: Player;
  captainPhone: string;
  captainWhatsapp: string;
  paymentScreenshotUrl?: string; // URL from Firebase Storage
  status: PaymentStatus;
  timestamp: number;
  hiddenFromAdmin?: boolean;
  permanentlyDeleted?: boolean;
}


