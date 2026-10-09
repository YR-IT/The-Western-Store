import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Load backend .env
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve('backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl ? 'Configured' : 'Missing');
console.log('Key:', supabaseServiceKey ? 'Configured' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabase() {
  // Test 1: Fetch 1 order
  const { data: orders, error: orderErr } = await supabase.from('orders').select('*').limit(1);
  console.log('\n--- Orders Table Sample ---');
  if (orderErr) console.error('Orders error:', orderErr);
  else console.log('Orders columns in live DB:', orders && orders[0] ? Object.keys(orders[0]) : 'Empty table');

  // Test 2: Fetch products
  const { data: products, error: prodErr } = await supabase.from('products').select('id, title, slug, price').limit(5);
  console.log('\n--- Products Sample ---');
  if (prodErr) console.error('Products error:', prodErr);
  else console.log('Products count:', products?.length, 'Sample:', products);

  // Test 3: Fetch categories
  const { data: categories, error: catErr } = await supabase.from('categories').select('*').limit(5);
  console.log('\n--- Categories Sample ---');
  if (catErr) console.error('Categories error:', catErr);
  else console.log('Categories count:', categories?.length, 'Sample:', categories);

  // Test 4: Check store_settings
  const { data: settings, error: setErr } = await supabase.from('store_settings').select('*');
  console.log('\n--- Store Settings ---');
  if (setErr) console.error('Settings error:', setErr);
  else console.log('Settings count:', settings?.length, 'Keys:', settings?.map(s => s.key));

  // Test 5: Check contact_messages
  const { data: messages, error: msgErr } = await supabase.from('contact_messages').select('*').limit(1);
  console.log('\n--- Contact Messages ---');
  if (msgErr) console.error('Contact messages error:', msgErr);
  else console.log('Contact messages accessible by service_role:', messages !== null);
}

testSupabase().catch(console.error);
