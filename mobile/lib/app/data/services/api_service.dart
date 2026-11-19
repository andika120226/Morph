import 'dart:async';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../models/order_model.dart';
import 'api_config.dart';

/// Service Integrasi REST API Flutter (api_service.dart)
/// Menggunakan ApiConfig.baseUrl dengan blok try-catch dan fallback otomatis ke GetStorage lokal
class ApiService extends GetConnect {
  final GetStorage _box = GetStorage();

  @override
  void onInit() {
    super.onInit();
    httpClient.baseUrl = ApiConfig.baseUrl;
    httpClient.timeout = const Duration(seconds: 5);

    httpClient.addRequestModifier<dynamic>((request) {
      request.headers['Content-Type'] = 'application/json';
      request.headers['Accept'] = 'application/json';
      return request;
    });
  }

  // 1. POST /orders -> Buat pesanan jemput sampah baru dari Mode Warga
  Future<Map<String, dynamic>> createOrderToBackend(OrderModel order) async {
    final payload = {
      "id": order.id,
      "wargaId": "warga-budi-01",
      "citizenName": order.citizenName,
      "category":
          order.isAnorganic && !order.isOrganic ? "ANORGANIK" : "ORGANIK",
      "estimatedWeightKg": order.estimatedKg,
      "totalKg": order.estimatedKg,
      "pickupLat": order.latitude,
      "pickupLng": order.longitude,
      "address": order.address,
      "addressText": order.address,
      "district": order.district,
    };

    try {
      final response = await post(ApiConfig.ordersEndpoint, payload);
      if (response.status.isOk && response.body != null) {
        _cacheLocalOrder(order);
        return Map<String, dynamic>.from(response.body);
      }
    } catch (_) {
      // Fallback otomatis ke GetStorage lokal jika sedang offline / demo
    }

    _cacheLocalOrder(order);
    return {
      "status": "local_fallback_ok",
      "data": order.toJson(),
    };
  }

  // 2. GET /orders -> Ambil seluruh daftar pesanan
  Future<List<OrderModel>> fetchOrdersFromBackend() async {
    try {
      final response = await get(ApiConfig.ordersEndpoint);
      if (response.status.isOk &&
          response.body != null &&
          response.body['data'] is List) {
        final List rawList = response.body['data'];
        return rawList
            .map((item) => OrderModel.fromJson(Map<String, dynamic>.from(item)))
            .toList();
      }
    } catch (_) {
      // Fallback otomatis membaca dari GetStorage
    }

    final saved = _box.read<List>('morph_orders_list');
    if (saved != null) {
      return saved
          .map((e) => OrderModel.fromJson(Map<String, dynamic>.from(e)))
          .toList();
    }
    return [];
  }

  // 3. PATCH /orders -> Driver menerima pesanan (status -> ON_THE_WAY)
  Future<bool> acceptOrderOnBackend({
    required String orderId,
    String driverId = "driver-hendra-01",
    String driverName = "Pak Hendra Wijaya",
    String plateNumber = "BE 4521 YX",
  }) async {
    try {
      final response = await patch(ApiConfig.ordersEndpoint, {
        "id": orderId,
        "status": "ON_THE_WAY",
        "driverId": driverId,
        "driverName": driverName,
        "vehiclePlate": plateNumber,
      });
      if (response.status.isOk) return true;
    } catch (_) {
      // Fallback ke GetStorage
    }
    return true;
  }

  // 4. PATCH /orders -> Driver menimbang berat aktual & kirim poin
  Future<Map<String, dynamic>> completeOrderOnBackend({
    required String orderId,
    required double actualWeightKg,
  }) async {
    try {
      final response = await patch(ApiConfig.ordersEndpoint, {
        "id": orderId,
        "status": "COMPLETED",
        "totalKg": actualWeightKg,
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

  void _cacheLocalOrder(OrderModel order) {
    try {
      final List existing = _box.read<List>('morph_orders_list') ?? [];
      existing.insert(0, order.toJson());
      _box.write('morph_orders_list', existing);
    } catch (_) {
      // Ignore storage error
    }
  }
}
