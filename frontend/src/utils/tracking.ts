/**
 * Tracking URL Resolver for The Western Store
 * Normalizes courier links and ensures direct HTTPS external navigation
 */

export function resolveTrackingUrl(
  courierName?: string,
  trackingNumber?: string,
  trackingLink?: string
): string | null {
  const trimmedLink = trackingLink?.trim();

  // If a tracking link is directly provided
  if (trimmedLink) {
    if (/^https?:\/\//i.test(trimmedLink)) {
      return trimmedLink;
    }
    return `https://${trimmedLink}`;
  }

  const awb = trackingNumber?.trim();
  if (!awb) return null;

  const courier = (courierName || '').toLowerCase().trim();

  if (courier.includes('delhivery')) {
    return `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`;
  }
  if (courier.includes('blue dart') || courier.includes('bluedart')) {
    return `https://www.bluedart.com/tracking?trackNumber=${encodeURIComponent(awb)}`;
  }
  if (courier.includes('dtdc')) {
    return `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${encodeURIComponent(awb)}`;
  }
  if (courier.includes('india post') || courier.includes('speed post') || courier.includes('post')) {
    return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`;
  }
  if (courier.includes('shiprocket')) {
    return `https://shiprocket.co/tracking/${encodeURIComponent(awb)}`;
  }
  if (courier.includes('xpressbees')) {
    return `https://www.xpressbees.com/track?isawb=Yes&trackid=${encodeURIComponent(awb)}`;
  }
  if (courier.includes('shadowfax')) {
    return `https://tracker.shadowfax.in/#/track/${encodeURIComponent(awb)}`;
  }
  if (courier.includes('trackon')) {
    return `https://trackon.in/track?tracking_no=${encodeURIComponent(awb)}`;
  }
  if (courier.includes('professional') || courier.includes('tpc')) {
    return `https://www.tpcindia.com/tracking.aspx?type=DOM&id=${encodeURIComponent(awb)}`;
  }

  // Fallback Google Search for this courier & AWB
  return `https://www.google.com/search?q=${encodeURIComponent((courierName || 'courier') + ' tracking ' + awb)}`;
}
