/**
 * Local customer profile + saved addresses (per user id).
 * Used for account settings and checkout prefills until a profiles API exists.
 */

export interface SavedAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
}

const profileKey = (userId: string) => `tws_profile_${userId}`;
const addressesKey = (userId: string) => `tws_addresses_${userId}`;

export function loadCustomerProfile(userId: string): CustomerProfile | null {
  try {
    const raw = localStorage.getItem(profileKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as CustomerProfile;
  } catch {
    return null;
  }
}

export function saveCustomerProfile(userId: string, profile: CustomerProfile): void {
  localStorage.setItem(profileKey(userId), JSON.stringify(profile));
}

export function loadSavedAddresses(userId: string): SavedAddress[] {
  try {
    const raw = localStorage.getItem(addressesKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedAddresses(userId: string, addresses: SavedAddress[]): void {
  localStorage.setItem(addressesKey(userId), JSON.stringify(addresses));
}

export function getDefaultAddress(userId: string): SavedAddress | null {
  const list = loadSavedAddresses(userId);
  return list.find((a) => a.isDefault) || list[0] || null;
}
