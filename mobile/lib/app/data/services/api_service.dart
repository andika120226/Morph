import 'dart:async';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/order_model.dart';
import 'api_config.dart';

/// Service Integrasi Hybrid Cloud Supabase + REST API + GetStorage Fallback (api_service.dart)
class ApiService extends GetConnect {
  final GetStorage _box = GetStorage();

  SupabaseClient? get _supabase {
    if (!ApiConfig.hasSupabaseConfig) return null;
    try {
      return Supabase.instance.client;
    } catch (_) {
      return null;
    }
  }

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

  // 1. CREATE ORDER -> Simpan ke Supabase (morph_orders) + API Bridge + GetStorage
  Future<Map<String, dynamic>> createOrderToBackend(OrderModel order) async {
    final supabaseRow = {
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
    };

    // A. Coba simpan ke Cloud Supabase jika aktif
    try {
      final client = _supabase;
      if (client != null) {
        await client.from('morph_orders').upsert(supabaseRow);
      }
    } catch (_) {
      // Lanjut ke REST API / GetStorage fallback
    }

    // B. Coba kirim ke REST API Bridge
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

  // 2. READ ORDERS -> Ambil dari Supabase (morph_orders) -> API Bridge -> GetStorage
  Future<List<OrderModel>> fetchOrdersFromBackend() async {
    try {
      final client = _supabase;
      if (client != null) {
        final List<dynamic> rows = await client
            .from('morph_orders')
            .select()
            .order('created_at', ascending: false);
        if (rows.isNotEmpty) {
          return rows
              .map((r) => OrderModel.fromJson(Map<String, dynamic>.from(r)))
              .toList();
        }
      }
    } catch (_) {
      // Fallback ke REST API
    }

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

    final saved = _box.read<List>('morph_orders_list');
    if (saved != null) {
      return saved
          .map((e) => OrderModel.fromJson(Map<String, dynamic>.from(e)))
          .toList();
    }
    return [];
  }

  // 3. ACCEPT ORDER -> Update status ON_THE_WAY di Supabase + API Bridge
  Future<bool> acceptOrderOnBackend({
    required String orderId,
    String driverId = "DRV-01",
    String driverName = "Pak Hendra Wijaya",
    String plateNumber = "BE 4521 YX",
  }) async {
    try {
      final client = _supabase;
      if (client != null) {
        await client.from('morph_orders').update({
          "status": "ON_THE_WAY",
          "driver_id": driverId,
          "driver_name": driverName,
          "vehicle_plate": plateNumber,
        }).eq('id', orderId);
      }
    } catch (_) {}

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

  // 4. COMPLETE ORDER -> Update berat aktual & poin reward di Supabase + API Bridge
  Future<Map<String, dynamic>> completeOrderOnBackend({
    required String orderId,
    required double actualWeightKg,
  }) async {
    final int earnedPts = (actualWeightKg * 10).round();

    try {
      final client = _supabase;
      if (client != null) {
        await client.from('morph_orders').update({
          "status": "COMPLETED",
          "total_kg": actualWeightKg,
          "points_awarded": earnedPts,
        }).eq('id', orderId);
      }
    } catch (_) {}

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

  // 5. SYNC CHAT -> Simpan pesan chat ke Supabase (morph_chats)
  Future<void> postChatMessageToBackend({
    required String orderId,
    required String senderRole,
    required String senderName,
    required String message,
  }) async {
    try {
      final client = _supabase;
      if (client != null) {
        await client.from('morph_chats').insert({
          "id": "MSG-${DateTime.now().millisecondsSinceEpoch}",
          "order_id": orderId,
          "sender_role": senderRole,
          "sender_name": senderName,
          "message_text": message,
        });
      }
    } catch (_) {}
  }

  void _cacheLocalOrder(OrderModel order) {
    try {
      final List existing = _box.read<List>('morph_orders_list') ?? [];
      existing.insert(0, order.toJson());
      _box.write('morph_orders_list', existing);
    } catch (_) {}
  }
}
