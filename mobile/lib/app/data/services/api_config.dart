/// Konfigurasi Endpoint REST API & Cloud Supabase Terpusat untuk Aplikasi Mobile Flutter MORPH Bandar Lampung
class ApiConfig {
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://morph-lampung.vercel.app/api/mobile',
  );

  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: '',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: '',
  );

  static bool get hasSupabaseConfig =>
      supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;

  static const String ordersEndpoint = '/orders';
  static const String driversEndpoint = '/drivers';
}
