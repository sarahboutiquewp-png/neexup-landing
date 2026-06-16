// Neexup - Shared utility
// Ensures profile exists for current user

async function ensureProfile(sb, userId, userMeta) {
  try {
    var res = await sb.from('profiles').select('store_id, role').eq('id', userId).single();
    if (res.data && res.data.store_id) return res.data;

    // Profile missing - create org + store + profile
    var orgRes = await sb.from('organizations').insert({
      name: (userMeta && userMeta.store_name) ? userMeta.store_name + ' Org' : 'Mon Organisation',
      plan: 'free'
    }).select().single();

    if (orgRes.error) throw orgRes.error;

    var storeRes = await sb.from('stores').insert({
      org_id: orgRes.data.id,
      name: (userMeta && userMeta.store_name) ? userMeta.store_name : 'Ma Boutique',
      address: (userMeta && userMeta.city) ? userMeta.city : null,
      phone: (userMeta && userMeta.phone) ? userMeta.phone : null
    }).select().single();

    if (storeRes.error) throw storeRes.error;

    var profileData = {
      id: userId,
      store_id: storeRes.data.id,
      full_name: (userMeta && userMeta.full_name) ? userMeta.full_name : null,
      role: 'admin'
    };

    await sb.from('profiles').upsert(profileData);
    return { store_id: storeRes.data.id, role: 'admin' };
  } catch(e) {
    console.error('ensureProfile error:', e);
    return null;
  }
}
