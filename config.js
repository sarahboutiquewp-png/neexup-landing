var SUPABASE_URL = 'https://xcawbucpypkhdqdyvjpt.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjYXdidWNweXBraGRxZHl2anB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzI4MjEsImV4cCI6MjA5NzEwODgyMX0.jdPDV380N6evZYTmg2zeC7XoYKVnCKSpMAyhMepmfYg';

async function __logout() {
  try {
    var _sb = (typeof sb !== 'undefined') ? sb : supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    await _sb.auth.signOut();
  } catch(e) {}
  window.location.href = 'login.html';
}
