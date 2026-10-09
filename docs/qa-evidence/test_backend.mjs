import http from 'http';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  const results = [];
  console.log('=== RUNNING BACKEND API & SECURITY TESTS ===');

  // Test 1: Health check
  const health = await makeRequest({ host: 'localhost', port: 4000, path: '/api/health', method: 'GET' });
  results.push({ test: 'GET /api/health', status: health.statusCode, body: health.body });

  // Test 2: Admin orders without token
  const ordersNoAuth = await makeRequest({ host: 'localhost', port: 4000, path: '/api/admin/orders', method: 'GET' });
  results.push({ test: 'GET /api/admin/orders (no auth)', status: ordersNoAuth.statusCode, body: ordersNoAuth.body });

  // Test 3: Admin orders with fake token
  const ordersFakeAuth = await makeRequest({
    host: 'localhost',
    port: 4000,
    path: '/api/admin/orders',
    method: 'GET',
    headers: { Authorization: 'Bearer fake-invalid-token' },
  });
  results.push({ test: 'GET /api/admin/orders (fake auth)', status: ordersFakeAuth.statusCode, body: ordersFakeAuth.body });

  // Test 4: Legacy /api/orders without auth
  const legacyOrdersNoAuth = await makeRequest({ host: 'localhost', port: 4000, path: '/api/orders', method: 'GET' });
  results.push({ test: 'GET /api/orders (legacy no auth)', status: legacyOrdersNoAuth.statusCode, body: legacyOrdersNoAuth.body });

  // Test 5: ImageKit auth without token
  const ikAuthNoToken = await makeRequest({ host: 'localhost', port: 4000, path: '/api/imagekit/auth', method: 'GET' });
  results.push({ test: 'GET /api/imagekit/auth (no auth)', status: ikAuthNoToken.statusCode, body: ikAuthNoToken.body });

  // Test 6: ImageKit files without token
  const ikFilesNoToken = await makeRequest({ host: 'localhost', port: 4000, path: '/api/imagekit/files', method: 'GET' });
  results.push({ test: 'GET /api/imagekit/files (no auth)', status: ikFilesNoToken.statusCode, body: ikFilesNoToken.body });

  // Test 7: Store settings update without token
  const storeSettingsPost = await makeRequest(
    {
      host: 'localhost',
      port: 4000,
      path: '/api/store-settings',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { key: 'test', value: 'unauthorized' }
  );
  results.push({ test: 'POST /api/store-settings (no auth)', status: storeSettingsPost.statusCode, body: storeSettingsPost.body });

  // Test 8: Admin Login wrong password
  const adminLoginWrong = await makeRequest(
    {
      host: 'localhost',
      port: 4000,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@thewesternstore.in', password: 'wrongpassword' }
  );
  results.push({ test: 'POST /api/admin/login (wrong password)', status: adminLoginWrong.statusCode, body: adminLoginWrong.body });

  // Test 9: Admin Login correct (if default password configured in .env)
  const adminLoginValid = await makeRequest(
    {
      host: 'localhost',
      port: 4000,
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@thewesternstore.in', password: 'westernstore_admin_2026' }
  );
  results.push({ test: 'POST /api/admin/login (default credential test)', status: adminLoginValid.statusCode, body: adminLoginValid.body });

  // Test 10: Price Tampering on POST /api/orders
  const fakeProductOrder = await makeRequest(
    {
      host: 'localhost',
      port: 4000,
      path: '/api/orders',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      formData: {
        name: 'Security Test Customer',
        phone: '9999999999',
        pincode: '136118',
        address: '123 Test Street, Model Town',
        city: 'Kurukshetra',
        state: 'Haryana',
      },
      items: [
        {
          productId: 'non-existent-or-hacked-item',
          title: 'Tampered Luxury Suit',
          price: 1, // Client claims ₹1
          quantity: 1,
        },
      ],
    }
  );
  results.push({ test: 'POST /api/orders (arbitrary product & price tampering)', status: fakeProductOrder.statusCode, body: fakeProductOrder.body });

  // Test 11: CORS Origin check
  const corsTest = await makeRequest({
    host: 'localhost',
    port: 4000,
    path: '/api/health',
    method: 'GET',
    headers: { Origin: 'https://evil-attacker-site.com' },
  });
  results.push({
    test: 'CORS Origin check (evil origin)',
    status: corsTest.statusCode,
    corsHeader: corsTest.headers['access-control-allow-origin'] || 'NONE',
  });

  // Test 12: Order tracking with mismatched phone
  const trackMismatch = await makeRequest({
    host: 'localhost',
    port: 4000,
    path: '/api/orders/track?orderNumber=TWS-2026-1000&phone=0000000000',
    method: 'GET',
  });
  results.push({ test: 'GET /api/orders/track (mismatch)', status: trackMismatch.statusCode, body: trackMismatch.body });

  console.log(JSON.stringify(results, null, 2));
}

runTests().catch(console.error);
