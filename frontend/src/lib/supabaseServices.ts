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
    if (!data || data.length === 0) return null;

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : Number(item.price),
      saleDiscount: item.sale_discount || undefined,
      onSale: !!item.on_sale,
      isBestSeller: !!item.is_bestseller,
      isNew: !!item.is_new,
      isSoldOut: !!item.is_sold_out,
      inStockCount: item.in_stock_count,
      budgetTier: item.budget_tier || 'under_1499',
      description: item.description || '',
      fabricCare: item.fabric_care || { fabric: 'Pure Silk', washCare: 'Dry Clean Only', fit: 'Regular', occasion: 'Festive' },
      sizes: item.sizes || ['Free Size'],
      colors: item.colors || [{ name: 'Deep Maroon', hex: '#721B29' }],
      images: item.images || [],
      rating: Number(item.rating || 4.9),
      reviewCount: Number(item.review_count || 24),
    }));
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
    if (!data || data.length === 0) return null;

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
    const row = {
      id: order.id,
      order_number: order.orderNumber,
      user_id: userId || null,
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
      console.warn('[Supabase] Order save failed:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Save order exception:', err);
    return false;
  }
}
