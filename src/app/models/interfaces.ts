// src/app/models/interfaces.ts

export interface Collection {
  id: number;
  name: string;
  release_year: number;
}

export interface Skin {
  id: number;
  name: string;
  weapon_type: WeaponType;
  rarity: Rarity;
  image_path: string;
  collection: Collection;
  release_date: Date;
  base_price: number;
  instances?: SkinInstance[];
}

export interface SkinInstance {
  id: number;
  skin: Skin;
  owner: User;
  float_value: number;
  is_stattrak: boolean;
  is_souvenir: boolean;
  is_listed_for_sale: boolean;
  is_traded_away: boolean;
  custom_name?: string;
  wear: Wear;
  trade_locked_until?: Date;
  price?: number;
  acquired_at: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;
  steam_id?: string;
  profile_url?: string;
  created_at: Date;
  balance: number;
}

export interface MarketListing {
  id: number;
  skin: Skin;
  owner: User;
  float_value: number;
  is_stattrak: boolean;
  is_souvenir: boolean;
  custom_name?: string;
  wear: Wear;
  price: number;
  acquired_at: Date;
}

// Enums
export enum WeaponType {
  AK47 = "AK-47",
  M4A4 = "M4A4",
  M4A1S = "M4A1-S",
  AWP = "AWP",
  SSG08 = "SSG 08",
  AUG = "AUG",
  SG553 = "SG 553",
  FAMAS = "FAMAS",
  GALIL_AR = "Galil AR",
  MAC10 = "MAC-10",
  MP5SD = "MP5-SD",
  MP7 = "MP7",
  MP9 = "MP9",
  P90 = "P90",
  PPBIZON = "PP-Bizon",
  UMP45 = "UMP-45",
  SCAR20 = "SCAR-20",
  G3SG1 = "G3SG1",
  NOVA = "Nova",
  XM1014 = "XM1014",
  MAG7 = "MAG-7",
  SAWEDOFF = "Sawed-Off",
  M249 = "M249",
  NEGEV = "Negev",
  GLOCK18 = "Glock-18",
  USP_S = "USP-S",
  P2000 = "P2000",
  P250 = "P250",
  FIVESEVEN = "Five-SeveN",
  TEC9 = "Tec-9",
  CZ75 = "CZ75-Auto",
  DUAL_BERETTAS = "Dual Berettas",
  DEAGLE = "Desert Eagle",
  R8 = "R8 Revolver",
}

export enum Rarity {
  RED = "red",
  BLUE = "blue",
  DARK_BLUE = "dark_blue",
  PURPLE = "purple",
  PINK = "pink",
  WHITE = "white",
  CONTRABAND = "contraband",
}

export enum Wear {
  FACTORY_NEW = "factory new",
  MINIMAL_WEAR = "minimal wear",
  FIELD_TESTED = "field tested",
  WELL_WORN = "well worn",
  BATTLE_SCARRED = "battle scarred",
}

// Utility functions
export function getRarityColor(rarity: Rarity): string {
  const colors = {
    [Rarity.WHITE]: "text-rarity-white",
    [Rarity.BLUE]: "text-rarity-blue",
    [Rarity.DARK_BLUE]: "text-blue-600",
    [Rarity.PURPLE]: "text-rarity-purple",
    [Rarity.PINK]: "text-rarity-pink",
    [Rarity.RED]: "text-rarity-red",
    [Rarity.CONTRABAND]: "text-rarity-contraband",
  };
  return colors[rarity] || "text-white";
}

export function getRarityBorderColor(rarity: Rarity): string {
  const colors = {
    [Rarity.WHITE]: "border-rarity-white/50",
    [Rarity.BLUE]: "border-rarity-blue/50",
    [Rarity.DARK_BLUE]: "border-blue-600/50",
    [Rarity.PURPLE]: "border-rarity-purple/50",
    [Rarity.PINK]: "border-rarity-pink/50",
    [Rarity.RED]: "border-rarity-red/50",
    [Rarity.CONTRABAND]: "border-rarity-contraband/50",
  };
  return colors[rarity] || "border-white/20";
}

// API Response Types
export interface LoginResponse {
  access_token: string;
}

export interface BalanceResponse {
  balance: number;
  userId: number;
}
