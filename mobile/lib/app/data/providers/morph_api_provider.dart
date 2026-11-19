import 'dart:async';
import 'package:get/get.dart';
import '../models/order_model.dart';
import '../services/api_service.dart';

/// HTTP Service Provider (GetConnect) & Reactive Store (Rx)
/// Menyinkronkan aplikasi mobile & Mitra Driver dengan NestJS & Web Admin Dashboard
class MorphApiProvider extends GetConnect {
  ApiService get _api => Get.find<ApiService>();

  // URL Web Admin Dashboard di Vercel (dengan fallback offline 100% aman)
  final String adminBaseUrl = "https://frontend-three-smoky-67.vercel.app";

  // Reactive Global State untuk Warga & Mitra Driver
  final RxString currentRole = "WARGA".obs; // 'WARGA' atau 'DRIVER'
  final RxInt walletPoints = 1250.obs; // 1.250 Poin (Setara Rp 12.500)

  // Status Kerja Mitra Driver (GoPartner Style)
  final RxBool isDriverOnline = true.obs;
  final RxDouble driverCurrentLoadKg = 35.0.obs;
  final RxDouble driverMaxCapacityKg = 100.0.obs;

  // Daftar Order (CRUD) & Order Aktif
  final RxList<OrderModel> orders = <OrderModel>[].obs;
  final Rxn<OrderModel> activeOrder = Rxn<OrderModel>();

  // Pesan Obrolan In-App Warga <-> Driver
  final RxList<ChatMessageModel> chatMessages = <ChatMessageModel>[].obs;

  // Katalog Penukaran Poin Reward
  final RxList<RewardCatalogModel> rewardCatalog = <RewardCatalogModel>[
    RewardCatalogModel(
      id: "RWD-01",
      title: "Saldo Dompet Digital MORPH Pay Rp 10.000",
      subtitle: "Cair instan ke nomor HP keluarga Budi",
      category: "E-Wallet",
      pointsCost: 1000,
      valueLabel: "Rp 10.000",
    ),
    RewardCatalogModel(
      id: "RWD-02",
      title: "Minyak Goreng Kemasan 1 Liter",
      subtitle: "Tukar di Warung Mitra RT/RW Kedaton",
      category: "Sembako",
      pointsCost: 1200,
      valueLabel: "1 Liter",
    ),
    RewardCatalogModel(
      id: "RWD-03",
      title: "Pulsa All Operator Rp 15.000",
      subtitle: "Telkomsel, Indosat, XL, Tri",
      category: "Pulsa & PLN",
      pointsCost: 1400,
      valueLabel: "Rp 15.000",
    ),
    RewardCatalogModel(
      id: "RWD-04",
      title: "Beras Premium Lampung 5 Kg",
      subtitle: "Diantar langsung oleh armada MORPH",
      category: "Sembako",
      pointsCost: 5000,
      valueLabel: "5 Kg",
    ),
    RewardCatalogModel(
      id: "RWD-05",
      title: "Token Listrik PLN Rp 20.000",
      subtitle: "20 digit kode token langsung tampil",
      category: "Pulsa & PLN",
      pointsCost: 2000,
      valueLabel: "Rp 20.000",
    ),
  ].obs;

  @override
  void onInit() {
    super.onInit();
    httpClient.baseUrl = adminBaseUrl;
    httpClient.timeout = const Duration(seconds: 6);
    _loadInitialData();
  }

  void _loadInitialData() {
    // Seed dummy data awal yang realistis di Bandar Lampung
    orders.assignAll([
      OrderModel(
        id: "MRP-8816",
        citizenName: "Budi Santoso",
        address: "Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung",
        district: "Kedaton",
        landmarkNote: "Di depan pagar rumah cat putih",
        isOrganic: false,
        isAnorganic: true,
        estimatedKg: 6.0,
        actualKg: 6.0,
        pointsEarned: 90,
        status: MorphOrderState.completed,
        createdAtLabel: "Kemarin, 16:15 WIB",
      ),
      OrderModel(
        id: "MRP-8809",
        citizenName: "Budi Santoso",
        address: "Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung",
        district: "Kedaton",
        landmarkNote: "Di dekat pos satpam",
        isOrganic: true,
        isAnorganic: false,
        estimatedKg: 8.0,
        actualKg: 8.0,
        pointsEarned: 80,
        status: MorphOrderState.completed,
        createdAtLabel: "3 Hari lalu, 09:20 WIB",
      ),
    ]);

    _refreshActiveOrderPointer();

    // Seed pesan awal di ruang chat
    chatMessages.assignAll([
      ChatMessageModel(
        id: "MSG-1",
        senderRole: "DRIVER",
        senderName: "Pak Hendra Wijaya",
        messageText:
            "Halo Pak/Bu Budi, saya Mitra Kebersihan MORPH area Kedaton. Saya sedang meluncur ke titik rumah Anda ya.",
        timeLabel: "Baru saja",
      ),
    ]);
  }

  void _persistOrders() {
    _refreshActiveOrderPointer();
  }

  void _refreshActiveOrderPointer() {
    final running = orders.firstWhereOrNull(
      (o) =>
          o.status == MorphOrderState.searching ||
          o.status == MorphOrderState.driverOnTheWay ||
          o.status == MorphOrderState.arrivedAtLocation,
    );
    activeOrder.value = running;
  }

  // Switch Mode Warga <-> Mode Mitra Driver secara instan untuk Demo
  void switchRole(String targetRole) {
    currentRole.value = targetRole;
  }

  // CREATE: Buat Pesanan Penjemputan Baru dari Mode Warga
  Future<OrderModel> createPickupOrder({
    required bool isOrganic,
    required bool isAnorganic,
    required double estimatedKg,
    required String address,
    required String landmarkNote,
  }) async {
    final int rate = (isOrganic && isAnorganic)
        ? 15
        : isAnorganic
            ? 15
            : 10;
    final int estPoints = (estimatedKg * rate).round();
    final String orderId =
        "MRP-${8825 + DateTime.now().millisecondsSinceEpoch % 900}";

    final newOrder = OrderModel(
      id: orderId,
      citizenName: "Keluarga Budi",
      address: address,
      district: "Kedaton",
      landmarkNote: landmarkNote,
      isOrganic: isOrganic,
      isAnorganic: isAnorganic,
      estimatedKg: estimatedKg,
      actualKg: estimatedKg,
      pointsEarned: estPoints,
      status: MorphOrderState.searching,
      createdAtLabel: "Hari ini, Baru saja",
    );

    orders.insert(0, newOrder);
    activeOrder.value = newOrder;
    _persistOrders();

    // Kirim sinkronisasi ke Web Admin API Bridge (/api/mobile/orders)
    unawaited(_syncOrderToWebAdmin(newOrder));

    return newOrder;
  }

  Future<void> _syncOrderToWebAdmin(OrderModel order) async {
    try {
      await _api.createOrderToBackend(order);
      await post("/api/mobile/orders", {
        "id": order.id,
        "citizenName": order.citizenName,
        "address": order.address,
        "district": order.district,
        "category": order.categoryLabel,
        "organicKg": order.isOrganic ? order.estimatedKg : 0,
        "anorganicKg": order.isAnorganic ? order.estimatedKg : 0,
        "totalKg": order.estimatedKg,
        "status": "SEARCHING_DRIVER",
        "latitude": order.latitude,
        "longitude": order.longitude,
      });
    } catch (_) {
      // Tetap berjalan lancar secara offline/lokal jika tanpa internet
    }
  }

  // Transisi ke DRIVER_ON_THE_WAY (PATCH /api/orders/:id/accept)
  void assignDriverToOrder(String orderId) {
    final idx = orders.indexWhere((o) => o.id == orderId);
    if (idx == -1) return;

    final item = orders[idx];
    item.status = MorphOrderState.driverOnTheWay;
    orders[idx] = item;
    orders.refresh();
    _persistOrders();
    unawaited(_api.acceptOrderOnBackend(orderId: orderId));
  }

  // Transisi Driver Sampai di Lokasi Rumah Warga
  void markDriverArrived(String orderId) {
    final idx = orders.indexWhere((o) => o.id == orderId);
    if (idx == -1) return;

    final item = orders[idx];
    item.status = MorphOrderState.arrivedAtLocation;
    orders[idx] = item;
    orders.refresh();
    _persistOrders();
  }

  // UPDATE (CRUD Warga): Ubah catatan patokan alamat atau estimasi berat (Kg)
  void updateOrderByCitizen({
    required String orderId,
    required double newEstimatedKg,
    required String newLandmarkNote,
  }) {
    final idx = orders.indexWhere((o) => o.id == orderId);
    if (idx == -1) return;

    final item = orders[idx];
    item.estimatedKg = newEstimatedKg;
    item.actualKg = newEstimatedKg;
    item.landmarkNote = newLandmarkNote;
    item.pointsEarned = (newEstimatedKg * item.ratePerKg).round();

    orders[idx] = item;
    orders.refresh();
    _persistOrders();
  }

  // COMPLETE (Eksekusi Mitra Driver): Input Timbangan Aktual (Kg) & Kirim Poin
  void completeOrderByDriver({
    required String orderId,
    required double verifiedActualKg,
  }) {
    final idx = orders.indexWhere((o) => o.id == orderId);
    if (idx == -1) return;

    final item = orders[idx];
    final earnedPts = (verifiedActualKg * item.ratePerKg).round();

    item.actualKg = verifiedActualKg;
    item.pointsEarned = earnedPts;
    item.status = MorphOrderState.completed;

    orders[idx] = item;
    orders.refresh();

    // 1. Tambah Saldo Poin Warga secara otomatis
    walletPoints.value += earnedPts;

    // 2. Tambah Kapasitas Muatan Gerobak Driver
    driverCurrentLoadKg.value = (driverCurrentLoadKg.value + verifiedActualKg)
        .clamp(0.0, driverMaxCapacityKg.value);

    _persistOrders();
    unawaited(
      _api.completeOrderOnBackend(
        orderId: orderId,
        actualWeightKg: verifiedActualKg,
      ),
    );
  }

  // DELETE (CRUD Warga): Batalkan pesanan aktif atau hapus riwayat pesanan
  void deleteOrCancelOrder(String orderId) {
    orders.removeWhere((o) => o.id == orderId);
    orders.refresh();
    _persistOrders();
  }

  // CHAT: Kirim pesan & simulasi balasan otomatis 2 detik dari Driver
  void sendMessage({
    required String senderRole,
    required String text,
  }) {
    if (text.trim().isEmpty) return;

    chatMessages.add(
      ChatMessageModel(
        id: "MSG-${DateTime.now().millisecondsSinceEpoch}",
        senderRole: senderRole,
        senderName:
            senderRole == "WARGA" ? "Keluarga Budi" : "Pak Hendra Wijaya",
        messageText: text.trim(),
        timeLabel: "Baru saja",
      ),
    );

    if (senderRole == "WARGA") {
      Future.delayed(const Duration(seconds: 2), () {
        chatMessages.add(
          ChatMessageModel(
            id: "MSG-DRV-${DateTime.now().millisecondsSinceEpoch}",
            senderRole: "DRIVER",
            senderName: "Pak Hendra Wijaya",
            messageText:
                "Siap Pak/Bu Budi! Terima kasih infonya, sekitar 4 menit lagi motor gerobak saya sampai di depan rumah ya.",
            timeLabel: "Baru saja",
          ),
        );
      });
    }
  }

  // REWARD: Tukar Poin
  bool redeemReward(RewardCatalogModel reward) {
    if (walletPoints.value < reward.pointsCost) {
      return false;
    }
    walletPoints.value -= reward.pointsCost;
    return true;
  }
}
