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

// ─── PRODUCT CRUD ─────────────────────────────────────────────────────────
export async function upsertProductToSupabase(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const row = {
      id: product.id,
      title: product.title,
      slug: product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: product.category,
      price: product.price,
      original_price: product.originalPrice,
      sale_discount: product.saleDiscount || null,
      on_sale: product.onSale,
      is_bestseller: product.isBestSeller,
      is_new: product.isNew,
      is_sold_out: product.isSoldOut,
      in_stock_count: product.inStockCount,
      budget_tier: product.budgetTier,
      description: product.description,
      fabric_care: product.fabricCare,
      sizes: product.sizes,
      colors: product.colors,
      images: product.images,
      rating: product.rating || 4.9,
      review_count: product.reviewCount || 24,
    };

    const { error } = await supabase.from('products').upsert(row);
    if (error) console.warn('[Supabase] Product upsert error:', error.message);
    return !error;
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
      image: category.image,
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
