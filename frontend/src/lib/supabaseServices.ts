import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Category, CartItem } from '../types';

// ─── PRODUCTS ──────────────────────────────────────────────────────────────
export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('[Supabase] Failed to fetch products:', error.message);
      return null;
    }
    if (!data) return [];

    return data.map((item: any) => {
      const fc = (typeof item.fabric_care === 'object' && item.fabric_care) ? item.fabric_care : {};
      return {
        id: item.id,
        title: item.title,
        slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: item.category,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : Number(item.price),
        saleDiscount: item.sale_discount || undefined,
        onSale: !!item.on_sale,
        isBestSeller: !!item.is_bestseller,
        isNew: !!item.is_new,
        isSoldOut: !!item.is_sold_out,
        inStockCount: item.in_stock_count !== undefined ? Number(item.in_stock_count) : 15,
        budgetTier: item.budget_tier || 'under_1499',
        description: item.description || '',
        fabricCare: {
          fabric: fc.fabric || '',
          washCare: fc.washCare || '',
          fit: fc.fit || '',
          occasion: fc.occasion || '',
        },
        customReturnPolicy: item.custom_return_policy || fc.custom_return_policy || undefined,
        customWashCareNotes: item.custom_wash_care_notes || fc.custom_wash_care_notes || undefined,
        customDeliveryTimeline: item.custom_delivery_timeline || fc.custom_delivery_timeline || undefined,
        customReviews: item.custom_reviews || fc.custom_reviews || undefined,
        sizes: Array.isArray(item.sizes) ? item.sizes : [],
        colors: Array.isArray(item.colors) ? item.colors : [],
        images: Array.isArray(item.images) ? item.images : [],
        rating: Number(item.rating || 5.0),
        reviewCount: Number(item.review_count || 0),
      };
    });
  } catch (err) {
    console.error('[Supabase] Products query error:', err);
    return null;
  }
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────
export async function fetchCategoriesFromSupabase(): Promise<Category[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.warn('[Supabase] Failed to fetch categories:', error.message);
      return null;
    }
    if (!data) return [];

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      subtitle: item.subtitle || '',
      image: item.image,
    }));
  } catch (err) {
    console.error('[Supabase] Categories query error:', err);
    return null;
  }
}

// ─── CART SYNC ────────────────────────────────────────────────────────────
export async function syncCartToSupabase(userId: string, items: CartItem[]): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase || !userId) return false;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isUuid) return false; // Non-UUID mock/admin IDs shouldn't query Supabase auth-bound cart table

  try {
    await supabase.from('cart_items').delete().eq('user_id', userId);
    if (items.length === 0) return true;

    const rows = items.map((item) => ({
      user_id: userId,
      product_id: item.productId,
      size: item.size,
      color_name: item.color || null,
      quantity: item.quantity,
    }));

    const { error } = await supabase.from('cart_items').insert(rows);
    if (error) {
      console.warn('[Supabase] Cart sync error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Cart sync exception:', err);
    return false;
  }
}

export async function fetchCartFromSupabase(userId: string): Promise<CartItem[] | null> {
  if (!isSupabaseConfigured() || !supabase || !userId) return null;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isUuid) return null;

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('product_id, size, color_name, quantity, products(*)')
      .eq('user_id', userId);

    if (error) {
      console.warn('[Supabase] Cart fetch error:', error.message);
      return null;
    }
    if (!data) return [];

    return data.map((row: any) => {
      const p = row.products;
      const fc = (typeof p.fabric_care === 'object' && p.fabric_care) ? p.fabric_care : {};
      const product: Product = {
        id: p.id,
        title: p.title,
        slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: p.category,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : Number(p.price),
        saleDiscount: p.sale_discount || undefined,
        onSale: !!p.on_sale,
        isBestSeller: !!p.is_bestseller,
        isNew: !!p.is_new,
        isSoldOut: !!p.is_sold_out,
        inStockCount: p.in_stock_count !== undefined ? Number(p.in_stock_count) : 15,
        budgetTier: p.budget_tier || 'under_1499',
        description: p.description || '',
        fabricCare: {
          fabric: fc.fabric || '',
          washCare: fc.washCare || '',
          fit: fc.fit || '',
          occasion: fc.occasion || '',
        },
        customReturnPolicy: p.custom_return_policy || fc.custom_return_policy || undefined,
        customWashCareNotes: p.custom_wash_care_notes || fc.custom_wash_care_notes || undefined,
        customDeliveryTimeline: p.custom_delivery_timeline || fc.custom_delivery_timeline || undefined,
        customReviews: p.custom_reviews || fc.custom_reviews || undefined,
        sizes: Array.isArray(p.sizes) ? p.sizes : [],
        colors: Array.isArray(p.colors) ? p.colors : [],
        images: Array.isArray(p.images) ? p.images : [],
        rating: Number(p.rating || 5.0),
        reviewCount: Number(p.review_count || 0),
      };

      return {
        id: `${p.id}-${row.size}-${row.color_name || ''}`,
        productId: p.id,
        product,
        size: row.size,
        color: row.color_name || 'Standard',
        quantity: row.quantity,
        price: Number(p.price),
      };
    });
  } catch (err) {
    console.error('[Supabase] Cart fetch exception:', err);
    return null;
  }
}

// ─── WISHLIST SYNC ────────────────────────────────────────────────────────
export async function syncWishlistToSupabase(userId: string, productIds: string[]): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase || !userId) return false;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isUuid) return false;

  try {
    await supabase.from('wishlists').delete().eq('user_id', userId);
    if (productIds.length === 0) return true;

    const rows = productIds.map((productId) => ({
      user_id: userId,
      product_id: productId,
    }));

    const { error } = await supabase.from('wishlists').insert(rows);
    if (error) {
      console.warn('[Supabase] Wishlist sync error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Wishlist sync exception:', err);
    return false;
  }
}

export async function fetchWishlistFromSupabase(userId: string): Promise<string[] | null> {
  if (!isSupabaseConfigured() || !supabase || !userId) return null;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isUuid) return null;

  try {
    const { data, error } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      console.warn('[Supabase] Wishlist fetch error:', error.message);
      return null;
    }
    if (!data) return [];
    return data.map((r: any) => r.product_id);
  } catch (err) {
    console.error('[Supabase] Wishlist fetch exception:', err);
    return null;
  }
}

// ─── PRODUCT CRUD ─────────────────────────────────────────────────────────
export async function upsertProductToSupabase(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const row = {
      id: product.id,
      title: product.title,
      slug: product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: product.category,
      price: Number(product.price) || 0,
      original_price: Number(product.originalPrice) || Number(product.price) || 0,
      sale_discount: product.saleDiscount || null,
      on_sale: !!product.onSale,
      is_bestseller: !!product.isBestSeller,
      is_new: !!product.isNew,
      is_sold_out: !!product.isSoldOut,
      in_stock_count: product.inStockCount !== undefined ? Number(product.inStockCount) : 15,
      budget_tier: product.budgetTier || 'under_1499',
      description: product.description || '',
      fabric_care: {
        ...(product.fabricCare || {}),
        custom_return_policy: product.customReturnPolicy || null,
        custom_wash_care_notes: product.customWashCareNotes || null,
        custom_delivery_timeline: product.customDeliveryTimeline || null,
        custom_reviews: product.customReviews || null,
      },
      sizes: product.sizes || [],
      colors: product.colors || [],
      images: product.images || [],
      rating: Number(product.rating) || 5.0,
      review_count: Number(product.reviewCount) || 0,
    };

    const { error } = await supabase.from('products').upsert(row);
    if (error) {
      console.warn('[Supabase] Product upsert error:', error.message, error.details);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Product upsert exception:', err);
    return false;
  }
}

export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) console.warn('[Supabase] Delete product error:', error.message);
    return !error;
  } catch (err) {
    console.error('[Supabase] Delete product exception:', err);
    return false;
  }
}

// ─── CATEGORY CRUD ────────────────────────────────────────────────────────
export async function upsertCategoryToSupabase(category: Category): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const row = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      subtitle: category.subtitle || null,
      image: category.image || null,
    };

    const { error } = await supabase.from('categories').upsert(row);
    if (error) console.warn('[Supabase] Category upsert error:', error.message);
    return !error;
  } catch (err) {
    console.error('[Supabase] Category upsert exception:', err);
    return false;
  }
}

export async function deleteCategoryFromSupabase(categoryId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId);
    if (error) console.warn('[Supabase] Delete category error:', error.message);
    return !error;
  } catch (err) {
    console.error('[Supabase] Delete category exception:', err);
    return false;
  }
}

const rawBackendUrl = ((import.meta as any).env?.VITE_BACKEND_URL || '').trim().replace(/\/+$/, '');
const BACKEND_URL = rawBackendUrl || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:4000' : '');

// ─── STORE SETTINGS & HOMEPAGE CONFIGS ────────────────────────────────────
export async function fetchStoreSettingsFromSupabase(): Promise<Record<string, any> | null> {
  // 1. Direct Supabase Query FIRST (sub-100ms ultra fast edge query)
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('store_settings').select('*');
      if (!error && data && data.length > 0) {
        const settings: Record<string, any> = {};
        for (const row of data) {
          if (row.key) {
            settings[row.key] = row.value;
          }
        }
        return settings;
      }
    } catch (err) {
      console.warn('[Supabase] fetchStoreSettings direct error:', err);
    }
  }

  // 2. Fallback to Backend API with 2s timeout
  if (BACKEND_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${BACKEND_URL}/api/store-settings`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.settings && typeof json.settings === 'object') {
          return json.settings;
        }
      }
    } catch {}
  }

  return null;
}

export async function saveStoreSettingToSupabase(key: string, value: any): Promise<boolean> {
  const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('tws_admin_token') : null;
  let savedToBackend = false;

  // 1. Persist to Backend Server API first
  if (BACKEND_URL && adminToken) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/store-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) savedToBackend = true;
    } catch (err) {
      console.warn('[StoreSettings] Backend save failed, falling back to Supabase direct:', err);
    }
  }

  // 2. Persist to Supabase directly
  if (isSupabaseConfigured() && supabase) {
    try {
      const row = {
        key,
        value,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('store_settings').upsert(row);
      if (error) {
        console.warn('[Supabase] Save store setting direct error:', error.message);
      } else {
        return true;
      }
    } catch (err) {
      console.error('[Supabase] Save store setting direct exception:', err);
    }
  }

  return savedToBackend;
}
