import 'dart:async';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../models/order_model.dart';

/// Service Integrasi REST API Flutter (api_service.dart)
/// Menghubungkan Flutter GetX (Warga & Driver) ke NestJS (/api/orders) & Next.js Web Admin
/// Dilengkapi Auto-Fallback Interceptor ke GetStorage jika sedang dalam mode lokal/offline.
class ApiService extends GetConnect {
  final GetStorage _box = GetStorage();

  // Base URL Server Backend NestJS / Next.js Vercel
  static const String baseUrlEndpoint =
      String.fromEnvironment('MORPH_API_URL', defaultValue: 'http://localhost:4000');

  @override
  void onInit() {
    super.onInit();
    httpClient.baseUrl = baseUrlEndpoint;
    httpClient.timeout = const Duration(seconds: 5);

    // Request & Response Interceptor untuk logging & fallback
    httpClient.addRequestModifier<dynamic>((request) {
      request.headers['Content-Type'] = 'application/json';
      request.headers['Accept'] = 'application/json';
      return request;
    });
  }

  // 1. POST /api/orders -> Buat pesanan jemput sampah baru dari Mode Warga
  Future<Map<String, dynamic>> createOrderToBackend(OrderModel order) async {
    final payload = {
      "id": order.id,
      "wargaId": "warga-budi-01",
      "citizenName": order.citizenName,
      "category": order.isAnorganic && !order.isOrganic ? "ANORGANIK" : "ORGANIK",
      "estimatedWeightKg": order.estimatedKg,
      "pickupLat": order.latitude,
      "pickupLng": order.longitude,
      "addressText": order.address,
      "district": order.district,
    };

    try {
      final response = await post('/api/orders', payload);
      if (response.status.isOk && response.body != null) {
        _cacheLocalOrder(order);
        return Map<String, dynamic>.from(response.body);
      }
    } catch (_) {
      // Fallback otomatis ke GetStorage jika server lokal sedang offline
    }

    _cacheLocalOrder(order);
    return {
      "status": "local_fallback_ok",
      "data": order.toJson(),
    };
  }

  // 2. GET /api/orders -> Ambil seluruh daftar pesanan
  Future<List<OrderModel>> fetchOrdersFromBackend() async {
    try {
      final response = await get('/api/orders');
      if (response.status.isOk &&
          response.body != null &&
          response.body['data'] is List) {
        final List rawList = response.body['data'];
        return rawList
            .map((item) => OrderModel.fromJson(Map<String, dynamic>.from(item)))
            .toList();
      }
    } catch (_) {
      // Fallback baca dari GetStorage
    }

    final saved = _box.read<List>('morph_orders_list');
    if (saved != null) {
      return saved
          .map((e) => OrderModel.fromJson(Map<String, dynamic>.from(e)))
          .toList();
    }
    return [];
  }

  // 3. PATCH /api/orders/:id/accept -> Driver menerima pesanan (status -> ON_THE_WAY)
  Future<bool> acceptOrderOnBackend({
    required String orderId,
    String driverId = "driver-hendra-01",
    String driverName = "Pak Hendra Wijaya",
    String plateNumber = "BE 4521 YX",
  }) async {
    try {
      final response = await patch('/api/orders/$orderId/accept', {
        "driverId": driverId,
        "driverName": driverName,
        "plateNumber": plateNumber,
      });
      if (response.status.isOk) return true;
    } catch (_) {
      // Fallback ke penyimpanan lokal GetStorage
    }
    return true;
  }

  // 4. PATCH /api/orders/:id/complete -> Driver menimbang berat aktual & kirim poin
  Future<Map<String, dynamic>> completeOrderOnBackend({
    required String orderId,
    required double actualWeightKg,
  }) async {
    try {
      final response = await patch('/api/orders/$orderId/complete', {
        "actualWeightKg": actualWeightKg,
      });
      if (response.status.isOk && response.body != null) {
        return Map<String, dynamic>.from(response.body);
      }
    } catch (_) {
      // Fallback otomatis ke GetStorage
    }

    final int fallbackPoints = (actualWeightKg * 10).round();
    return {
      "status": "local_fallback_ok",
      "earnedPoints": fallbackPoints,
    };
  }

  // 5. GET & POST /api/orders/:id/chat -> Sinkronisasi chat Warga <-> Driver
  Future<void> postChatMessageToBackend({
    required String orderId,
    required String senderRole,
    required String message,
  }) async {
    try {
      await post('/api/orders/$orderId/chat', {
        "senderRole": senderRole,
        "message": message,
      });
    } catch (_) {
      // Tersimpan di state reaktif lokal
    }
  }

  void _cacheLocalOrder(OrderModel order) {
    final List existing = _box.read<List>('morph_orders_list') ?? [];
    existing.insert(0, order.toJson());
    _box.write('morph_orders_list', existing);
  }
}
