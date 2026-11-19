/// Konfigurasi Endpoint REST API Terpusat untuk Aplikasi Mobile Flutter MORPH Bandar Lampung
class ApiConfig {
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://morph-lampung.vercel.app/api/mobile',
  );

  static const String fallbackVercelUrl =
      'https://frontend-three-smoky-67.vercel.app/api/mobile';

  static const String ordersEndpoint = '/orders';
  static const String driversEndpoint = '/drivers';
}
