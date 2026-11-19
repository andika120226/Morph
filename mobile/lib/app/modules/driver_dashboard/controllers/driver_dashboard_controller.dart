import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/order_model.dart';
import '../../../data/providers/morph_api_provider.dart';
import '../../../routes/app_routes.dart';

class DriverDashboardController extends GetxController {
  final MorphApiProvider store = Get.find<MorphApiProvider>();
  final RxDouble actualWeighedKg = 5.0.obs;
  final RxInt currentBottomTab = 0.obs; // 0: Beranda, 1: Riwayat Jemput, 2: Pendapatan, 3: Profil Mitra

  final RxInt todayIncentiveRp = 85000.obs;
  final RxInt todayCompletedTasks = 6.obs;
  final RxDouble todayTotalHauledKg = 42.5.obs;

  @override
  void onInit() {
    super.onInit();
    final active = store.activeOrder.value;
    if (active != null) {
      actualWeighedKg.value = active.estimatedKg;
    }
  }

  void switchTab(int index) {
    currentBottomTab.value = index;
  }

  void toggleOnlineStatus(bool val) {
    store.isDriverOnline.value = val;
  }

  void logoutToOnboarding() {
    Get.offAllNamed(Routes.ONBOARDING);
  }

  // Langkah 1 Driver: Terima Tugas Jemput
  void acceptIncomingOrder(OrderModel order) {
    actualWeighedKg.value = order.estimatedKg;
    store.assignDriverToOrder(order.id);
    Get.snackbar(
      "Tugas Jemput Diterima! 🚛",
      "Silakan menuju ${order.address} (${order.citizenName}).",
      backgroundColor: const Color(0xFF00880D),
      colorText: Colors.white,
    );
  }

  // Langkah 2 Driver: Saya Sudah Sampai di Lokasi
  void confirmArrivedAtLocation(OrderModel order) {
    actualWeighedKg.value = order.estimatedKg;
    store.markDriverArrived(order.id);
    Get.snackbar(
      "Tiba di Lokasi Jemput 📍",
      "Silakan timbang sampah dan sesuaikan berat aktual (Kg).",
      backgroundColor: const Color(0xFF0F172A),
      colorText: Colors.white,
    );
  }

  void incrementActualWeight() {
    if (actualWeighedKg.value < 50.0) {
      actualWeighedKg.value = (actualWeighedKg.value + 0.5).clamp(0.5, 50.0);
    }
  }

  void decrementActualWeight() {
    if (actualWeighedKg.value > 0.5) {
      actualWeighedKg.value = (actualWeighedKg.value - 0.5).clamp(0.5, 50.0);
    }
  }

  // Langkah 3 Driver: Selesaikan Penjemputan & Kirim Poin
  void completePickupAndSendPoints(OrderModel order) {
    final earnedPts = (actualWeighedKg.value * order.ratePerKg).round();
    store.completeOrderByDriver(
      orderId: order.id,
      verifiedActualKg: actualWeighedKg.value,
    );

    todayCompletedTasks.value += 1;
    todayTotalHauledKg.value += actualWeighedKg.value;
    todayIncentiveRp.value += (actualWeighedKg.value * 2500).round();

    Get.snackbar(
      "Penjemputan Selesai! +$earnedPts Poin Terkirim 🎉",
      "Poin pengguna bertambah +$earnedPts Poin & muatan gerobak ter-update.",
      backgroundColor: const Color(0xFF00880D),
      colorText: Colors.white,
      duration: const Duration(seconds: 4),
    );
  }
}
