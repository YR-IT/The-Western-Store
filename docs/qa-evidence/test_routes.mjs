import http from 'http';

const routesToTest = [
  '/',
  '/shop',
  '/category/suits',
  '/collection/under-999',
  '/product/suits',
  '/cart',
  '/checkout',
  '/order-confirmation',
  '/wishlist',
  '/track-order',
  '/account',
  '/account/orders',
  '/login',
  '/signup',
  '/admin/login',
  '/admin',
  '/about',
  '/pricing',
  '/contact',
  '/policies/refund-policy',
  '/policies/shipping-policy',
  '/policies/terms',
  '/policies/privacy-policy',
  '/random-non-existent-url-404',
  '/robots.txt',
  '/sitemap.xml',
];

function fetchRoute(path) {
  return new Promise((resolve) => {
    const req = http.get(
      {
        host: 'localhost',
        port: 3000,
        path,
        headers: {
          'User-Agent': 'Mozilla/5.0 QA Crawler',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            path,
            statusCode: res.statusCode,
            contentType: res.headers['content-type'],
            bodyLength: data.length,
            hasRootDiv: data.includes('id="root"'),
            titleMatch: data.match(/<title>(.*?)<\/title>/i)?.[1] || 'No title',
          });
        });
      }
    );
    req.on('error', (err) => {
      resolve({ path, statusCode: 'ERROR', error: err.message });
    });
  });
}

async function runRouteTests() {
  console.log('Testing Frontend Routes on Port 3000...');
  const results = [];
  for (const r of routesToTest) {
    const res = await fetchRoute(r);
    results.push(res);
  }
  console.log(JSON.stringify(results, null, 2));
}

runRouteTests().catch(console.error);
