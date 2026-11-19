import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../data/models/order_model.dart';
import '../../data/providers/morph_api_provider.dart';
import '../../routes/app_routes.dart';

class DriverDashboardController extends GetxController {
  final MorphApiProvider store = Get.find<MorphApiProvider>();
  final RxDouble actualWeighedKg = 5.0.obs;

  @override
  void onInit() {
    super.onInit();
    final active = store.activeOrder.value;
    if (active != null) {
      actualWeighedKg.value = active.estimatedKg;
    }
  }

  void toggleOnlineStatus(bool val) {
    store.isDriverOnline.value = val;
  }

  void switchBackToWargaMode() {
    store.switchRole("WARGA");
    Get.offAllNamed(Routes.WARGA_HOME);
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
  void confirmArrivedAtCitizenHome(OrderModel order) {
    actualWeighedKg.value = order.estimatedKg;
    store.markDriverArrived(order.id);
    Get.snackbar(
      "Tiba di Lokasi Warga 📍",
      "Silakan timbang sampah warga dan sesuaikan berat aktual (Kg).",
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

    Get.snackbar(
      "Penjemputan Selesai! +$earnedPts Poin Terkirim 🎉",
      "Saldo Poin Keluarga Budi otomatis bertambah +$earnedPts Poin & muatan gerobak ter-update.",
      backgroundColor: const Color(0xFF00880D),
      colorText: Colors.white,
      duration: const Duration(seconds: 4),
    );
  }
}
