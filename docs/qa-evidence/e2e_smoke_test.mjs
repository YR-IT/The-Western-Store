import http from 'http';

async function fetchRoute(path, options = {}) {
  const url = `http://localhost:3000${path}`;
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function fetchBackend(path, options = {}) {
  const url = `http://localhost:4000${path}`;
  const payload = options.body
    ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
    : null;
  
  const headers = { ...options.headers };
  if (payload) {
    headers['Content-Length'] = Buffer.byteLength(payload);
  }

  const reqOptions = { ...options, headers };

  return new Promise((resolve, reject) => {
    const req = http.request(url, reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runE2ESmoke() {
  console.log('🚀 === RUNNING COMPREHENSIVE QA SMOKE SUITE ===\n');
  const results = [];

  // Test 1: Frontend SPA Base Route
  const home = await fetchRoute('/');
  const homeOk = home.status === 200 && home.body.includes('<div id="root">') && home.body.includes('The Western Store');
  results.push({
    test: 'Homepage SPA Load & HTML Skeleton',
    passed: homeOk,
    status: home.status,
  });

  // Test 2: Category route with slug
  const suitsCat = await fetchRoute('/category/suits');
  results.push({
    test: 'Category Route (/category/suits)',
    passed: suitsCat.status === 200 && suitsCat.body.includes('<div id="root">'),
    status: suitsCat.status,
  });

  // Test 3: Budget collection route
  const under999 = await fetchRoute('/collection/under-999');
  results.push({
    test: 'Budget Collection Route (/collection/under-999)',
    passed: under999.status === 200,
    status: under999.status,
  });

  // Test 4: Product detail page route
  const pdp = await fetchRoute('/product/suits');
  results.push({
    test: 'PDP Route (/product/suits)',
    passed: pdp.status === 200,
    status: pdp.status,
  });

  // Test 5: Policy routes
  const refundPolicy = await fetchRoute('/policies/refund-policy');
  const termsPolicy = await fetchRoute('/policies/terms-and-conditions');
  const shippingPolicy = await fetchRoute('/policies/shipping-policy');
  const privacyPolicy = await fetchRoute('/policies/privacy-policy');
  results.push({
    test: 'Policy Routes (/policies/*)',
    passed: refundPolicy.status === 200 && termsPolicy.status === 200 && shippingPolicy.status === 200 && privacyPolicy.status === 200,
    status: 200,
  });

  // Test 6: Backend Health Check
  const health = await fetchBackend('/api/health');
  const healthJson = JSON.parse(health.body || '{}');
  results.push({
    test: 'Backend Health Check (/api/health)',
    passed: health.status === 200 && healthJson.status === 'ok' && healthJson.supabase?.configured === true,
    status: health.status,
  });

  // Test 7: Backend Price Tampering Immunity (CRIT-02 verification)
  const tamperOrder = await fetchBackend('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      items: [{ id: 'tampered-item-999', title: 'Hacked Silk Suit', price: 1, quantity: 1, size: 'M', color: 'Gold' }],
      formData: {
        name: 'Attacker Test',
        phone: '9876543210',
        address: '123 Fake Street',
        city: 'Kurukshetra',
        state: 'Haryana',
        pincode: '136118',
      },
    },
  });
  results.push({
    test: 'Backend Price & Catalog Tampering Rejection (CRIT-02)',
    passed: tamperOrder.status === 400 && tamperOrder.body.includes('not available in our boutique catalog'),
    status: tamperOrder.status,
  });

  // Test 8: Order Tracking Lookup endpoint (HIGH-03 verification)
  const trackOrder = await fetchBackend('/api/orders/track?orderNumber=NONEXISTENT-999&phone=9999999999');
  results.push({
    test: 'Order Tracking API Endpoint (HIGH-03)',
    passed: trackOrder.status === 404 && trackOrder.body.includes('No order found'),
    status: trackOrder.status,
  });

  // Test 9: Admin Authentication Gate (CRIT-01/HIGH-01 verification)
  const adminUnauth = await fetchBackend('/api/admin/orders');
  results.push({
    test: 'Admin Orders API Gate (CRIT-01 / RBAC)',
    passed: adminUnauth.status === 401 && adminUnauth.body.includes('Unauthorized'),
    status: adminUnauth.status,
  });

  // Test 10: Robots.txt & SEO crawlers rules
  const robots = await fetchRoute('/robots.txt');
  const robotsOk = robots.status === 200 &&
    robots.body.includes('Disallow: /admin') &&
    robots.body.includes('Disallow: /cart') &&
    robots.body.includes('Disallow: /checkout') &&
    robots.body.includes('Sitemap: https://www.thewesternstore.in/sitemap.xml');
  results.push({
    test: 'Robots.txt Crawl Directives',
    passed: robotsOk,
    status: robots.status,
  });

  // Print Summary
  console.log(JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.passed);
  if (failed.length === 0) {
    console.log(`\n🎉 ALL ${results.length} E2E SMOKE TESTS PASSED CLEANLY!`);
  } else {
    console.error(`\n❌ ${failed.length} TESTS FAILED!`);
    process.exit(1);
  }
}

runE2ESmoke().catch((err) => {
  console.error('Smoke suite runner error:', err);
  process.exit(1);
});
