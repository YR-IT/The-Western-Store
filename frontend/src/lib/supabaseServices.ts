import { supabase, isSupabaseConfigured } from './supabase';
import { Product, Category, CartItem, Order } from '../types';

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
    if (error) console.warn('[Supabase] Sync cart error:', error.message);
    return !error;
  } catch (err) {
    console.error('[Supabase] Cart sync failed:', err);
    return false;
  }
}

// ─── WISHLIST SYNC ─────────────────────────────────────────────────────────
export async function syncWishlistToSupabase(userId: string, productIds: string[]): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase || !userId) return false;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isUuid) return false; // Non-UUID mock/admin IDs shouldn't query Supabase auth-bound wishlist table

  try {
    await supabase.from('wishlist_items').delete().eq('user_id', userId);
    if (productIds.length === 0) return true;

    const rows = productIds.map((pid) => ({
      user_id: userId,
      product_id: pid,
    }));

    const { error } = await supabase.from('wishlist_items').insert(rows);
    if (error) console.warn('[Supabase] Sync wishlist error:', error.message);
    return !error;
  } catch (err) {
    console.error('[Supabase] Wishlist sync failed:', err);
    return false;
  }
}

// ─── ORDERS ───────────────────────────────────────────────────────────────
export async function saveOrderToSupabase(order: Order, userId?: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const isUuid = userId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) : false;

    const row = {
      id: order.id,
      order_number: order.orderNumber,
      user_id: isUuid ? userId : null,
      customer_name: order.customerName,
      customer_phone: order.phone,
      customer_email: order.email || order.userEmail || null,
      shipping_address: {
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        notes: order.notes,
      },
      total_amount: order.total,
      status: order.status,
      payment_method: 'whatsapp_cod',
      items: order.items,
      tracking_number: order.trackingNumber || null,
      courier_name: order.courierName || null,
    };

    const { error } = await supabase.from('orders').upsert(row);
    if (error) {
      console.warn('[Supabase] Order save failed:', error.message, error.details);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Save order exception:', err);
    return false;
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Fetch orders failed:', error.message);
      return null;
    }

    return (data || [])
      .filter((row: any) => row.order_number && !row.order_number.startsWith('TWS-2026-100') && row.id !== 'order-1002')
      .map((row: any) => ({
        id: row.id,
        orderNumber: row.order_number || row.id,
        createdAt: row.created_at || new Date().toISOString(),
        customerName: row.customer_name || 'Customer',
        phone: row.customer_phone || '',
        email: row.customer_email || undefined,
        address: row.shipping_address?.address || '',
        pincode: row.shipping_address?.pincode || '',
        city: row.shipping_address?.city || '',
        state: row.shipping_address?.state || '',
        notes: row.shipping_address?.notes || undefined,
        items: row.items || [],
        subtotal: row.total_amount || 0,
        shippingFee: 0,
        total: row.total_amount || 0,
        status: row.status || 'Pending WhatsApp',
        courierName: row.courier_name || undefined,
        trackingNumber: row.tracking_number || undefined,
        trackingLink: row.tracking_number ? `https://delhivery.com/track/package/${row.tracking_number}` : undefined,
        userId: row.user_id || undefined,
      }));
  } catch (err) {
    console.error('[Supabase] Fetch orders exception:', err);
    return null;
  }
}

export async function deleteOrderFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) {
      console.warn('[Supabase] Delete order failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Delete order exception:', err);
    return false;
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

const BACKEND_URL = ((import.meta as any).env?.VITE_BACKEND_URL) || 'http://localhost:4000';

// ─── STORE SETTINGS & HOMEPAGE CONFIGS (REELS, HERO, REVIEWS, ETC.) ───────────
export async function fetchStoreSettingsFromSupabase(): Promise<Record<string, any> | null> {
  // 1. Try Backend Server API first (Fast, reliable, persistent local/server storage)
  try {
    const res = await fetch(`${BACKEND_URL}/api/store-settings`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.settings && typeof json.settings === 'object') {
        return json.settings;
      }
    }
  } catch {}

  // 2. Fallback to Supabase directly if Backend API is unreachable
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
    } catch {}
  }

  return null;
}

export async function saveStoreSettingToSupabase(key: string, value: any): Promise<boolean> {
  // 1. Persist to Backend Server API first
  let savedToBackend = false;
  try {
    const res = await fetch(`${BACKEND_URL}/api/store-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) savedToBackend = true;
  } catch {}

  // 2. If Backend is unreachable, try Supabase directly
  if (!savedToBackend && isSupabaseConfigured() && supabase) {
    try {
      const row = {
        key,
        value,
        updated_at: new Date().toISOString(),
      };
      await supabase.from('store_settings').upsert(row);
    } catch {}
  }

  return true;
}

