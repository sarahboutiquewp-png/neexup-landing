// Neexup - Shared utility
// Ensures profile exists for current user

async function ensureProfile(sb, userId, userMeta) {
  try {
    var res = await sb.from('profiles').select('store_id, role').eq('id', userId).single();
    if (res.data && res.data.store_id) return res.data;

    // Profile missing - create org + store + profile
    var storeName = (userMeta && userMeta.store_name) ? userMeta.store_name : 'Ma Boutique';
    var city = (userMeta && userMeta.city) ? userMeta.city : null;
    var address = (userMeta && userMeta.address) ? userMeta.address : null;
    var phone = (userMeta && userMeta.phone) ? userMeta.phone : null;
    var country = (userMeta && userMeta.country) ? userMeta.country : 'MA';
    var postalCode = (userMeta && userMeta.postal_code) ? userMeta.postal_code : null;
    var fullName = (userMeta && userMeta.full_name) ? userMeta.full_name : null;

    var orgRes = await sb.from('organizations').insert({
      name: storeName + ' Org',
      plan: 'free'
    }).select().single();

    if (orgRes.error) throw orgRes.error;

    var storeAddress = city ? (city + (address ? '|' + address : '')) : null;
    var storeRes = await sb.from('stores').insert({
      org_id: orgRes.data.id,
      name: storeName,
      address: storeAddress,
      phone: phone
    }).select().single();

    if (storeRes.error) throw storeRes.error;

    // Get user email from auth
    var authRes = await sb.auth.getUser();
    var email = authRes.data && authRes.data.user ? authRes.data.user.email : null;

    // Expiry = 14 days from now
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 14);
    var expiryStr = expiry.toISOString().split('T')[0];

    var profileData = {
      id: userId,
      store_id: storeRes.data.id,
      full_name: fullName,
      email: email,
      phone: phone,
      country: country,
      city: city,
      address: address,
      postal_code: postalCode,
      role: 'admin',
      expiry_date: expiryStr
    };

    await sb.from('profiles').upsert(profileData);
    return { store_id: storeRes.data.id, role: 'admin' };
  } catch(e) {
    console.error('ensureProfile error:', e);
    return null;
  }
}
