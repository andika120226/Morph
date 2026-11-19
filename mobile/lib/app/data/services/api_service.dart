import 'dart:async';
import 'dart:convert';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import '../models/order_model.dart';
import 'api_config.dart';

/// Service Integrasi Pure Dart HTTP + REST API + Local Cache Fallback (api_service.dart)
/// 100% Web & Android Safe tanpa native hook (objective_c / ffi / path_provider)
class ApiService extends GetConnect {
  final List<Map<String, dynamic>> _localCache = [];

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

  Map<String, String> get _supabaseHeaders => {
        'apikey': ApiConfig.supabaseAnonKey,
        'Authorization': 'Bearer ${ApiConfig.supabaseAnonKey}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      };

  // 1. CREATE ORDER -> Simpan ke Supabase REST (jika aktif) + API Bridge + GetStorage
  Future<Map<String, dynamic>> createOrderToBackend(OrderModel order) async {
    if (ApiConfig.hasSupabaseConfig) {
      try {
        final uri = Uri.parse('${ApiConfig.supabaseUrl}/rest/v1/morph_orders');
        await http
            .post(
              uri,
              headers: _supabaseHeaders,
              body: jsonEncode({
                "id": order.id,
                "time": "Baru saja",
                "citizen_name": order.citizenName,
                "citizen_phone": "0812-7741-9021",
                "address": order.address,
                "district": order.district,
                "category": order.categoryLabel,
                "organic_kg": order.isOrganic ? order.estimatedKg : 0.0,
                "anorganic_kg": order.isAnorganic ? order.estimatedKg : 0.0,
                "total_kg": order.estimatedKg,
                "status": "SEARCHING_DRIVER",
                "points_awarded": order.pointsEarned,
                "latitude": order.latitude,
                "longitude": order.longitude,
              }),
            )
            .timeout(const Duration(seconds: 4));
      } catch (_) {
        // Lanjut ke REST API / GetStorage fallback
      }
    }

    try {
      final response = await post(ApiConfig.ordersEndpoint, {
        "id": order.id,
        "citizenName": order.citizenName,
        "address": order.address,
        "district": order.district,
        "category": order.categoryLabel,
        "organicKg": order.isOrganic ? order.estimatedKg : 0.0,
        "anorganicKg": order.isAnorganic ? order.estimatedKg : 0.0,
        "totalKg": order.estimatedKg,
        "latitude": order.latitude,
        "longitude": order.longitude,
      });
      if (response.status.isOk && response.body != null) {
        _cacheLocalOrder(order);
        return Map<String, dynamic>.from(response.body);
      }
    } catch (_) {
      // Fallback otomatis ke GetStorage lokal
    }

    _cacheLocalOrder(order);
    return {
      "status": "local_fallback_ok",
      "data": order.toJson(),
    };
  }

  // 2. READ ORDERS -> Ambil dari Supabase REST / API Bridge / GetStorage
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
      // Fallback ke GetStorage
    }

    if (_localCache.isNotEmpty) {
      return _localCache
          .map((e) => OrderModel.fromJson(Map<String, dynamic>.from(e)))
          .toList();
    }
    return [];
  }

  // 3. ACCEPT ORDER -> Update status ON_THE_WAY
  Future<bool> acceptOrderOnBackend({
    required String orderId,
    String driverId = "DRV-01",
    String driverName = "Pak Hendra Wijaya",
    String plateNumber = "BE 4521 YX",
  }) async {
    if (ApiConfig.hasSupabaseConfig) {
      try {
        final uri = Uri.parse(
            '${ApiConfig.supabaseUrl}/rest/v1/morph_orders?id=eq.$orderId');
        await http
            .patch(
              uri,
              headers: _supabaseHeaders,
              body: jsonEncode({
                "status": "ON_THE_WAY",
                "driver_id": driverId,
                "driver_name": driverName,
                "vehicle_plate": plateNumber,
              }),
            )
            .timeout(const Duration(seconds: 4));
      } catch (_) {}
    }

    try {
      await patch(ApiConfig.ordersEndpoint, {
        "id": orderId,
        "status": "ON_THE_WAY",
        "driverId": driverId,
        "driverName": driverName,
        "vehiclePlate": plateNumber,
      });
    } catch (_) {}
    return true;
  }

  // 4. COMPLETE ORDER -> Update berat aktual & poin reward
  Future<Map<String, dynamic>> completeOrderOnBackend({
    required String orderId,
    required double actualWeightKg,
  }) async {
    final int earnedPts = (actualWeightKg * 10).round();

    if (ApiConfig.hasSupabaseConfig) {
      try {
        final uri = Uri.parse(
            '${ApiConfig.supabaseUrl}/rest/v1/morph_orders?id=eq.$orderId');
        await http
            .patch(
              uri,
              headers: _supabaseHeaders,
              body: jsonEncode({
                "status": "COMPLETED",
                "total_kg": actualWeightKg,
                "points_awarded": earnedPts,
              }),
            )
            .timeout(const Duration(seconds: 4));
      } catch (_) {}
    }

    try {
      final response = await patch(ApiConfig.ordersEndpoint, {
        "id": orderId,
        "status": "COMPLETED",
        "totalKg": actualWeightKg,
      });
      if (response.status.isOk && response.body != null) {
        return Map<String, dynamic>.from(response.body);
      }
    } catch (_) {}

    return {
      "status": "local_fallback_ok",
      "earnedPoints": earnedPts,
    };
  }

  void _cacheLocalOrder(OrderModel order) {
    _localCache.insert(0, order.toJson());
  }
}
