import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../data/models/order_model.dart';
import '../../data/providers/morph_api_provider.dart';
import '../../routes/app_routes.dart';

class WargaOrderController extends GetxController {
  final MorphApiProvider store = Get.find<MorphApiProvider>();

  // Step 1: Kategori & Berat (HANYA KILOGRAM 1.0 - 25.0 Kg)
  final RxBool isOrganicSelected = true.obs;
  final RxBool isAnorganicSelected = false.obs;
  final RxDouble weightKg = 5.0.obs; // Default 5.0 Kg

  // Step 2: Titik Jemput GPS & Patokan Cepat
  final RxString addressText =
      "Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung".obs;
  final RxString selectedLandmark = "Di depan pagar".obs;

  final List<String> quickLandmarks = [
    "Di depan pagar",
    "Di dekat pos satpam",
    "Panggil saat tiba",
  ];

  // Siklus Status Order GoRide Style ('FORM', 'SEARCHING', 'DRIVER_ON_THE_WAY')
  final RxString orderFlowStep = "FORM".obs;
  Timer? _radarTimer;

  @override
  void onInit() {
    super.onInit();
    final arg = Get.arguments;
    if (arg == "ANORGANIC") {
      isOrganicSelected.value = false;
      isAnorganicSelected.value = true;
    } else if (arg == "ORGANIC") {
      isOrganicSelected.value = true;
      isAnorganicSelected.value = false;
    }

    // Jika sedang ada order aktif, langsung tampilkan tracking
    final current = store.activeOrder.value;
    if (current != null) {
      if (current.status == MorphOrderState.searching) {
        orderFlowStep.value = "SEARCHING";
      } else {
        orderFlowStep.value = "DRIVER_ON_THE_WAY";
      }
    }
  }

  void toggleOrganic() {
    if (isOrganicSelected.value && !isAnorganicSelected.value) return;
    isOrganicSelected.value = !isOrganicSelected.value;
  }

  void toggleAnorganic() {
    if (isAnorganicSelected.value && !isOrganicSelected.value) return;
    isAnorganicSelected.value = !isAnorganicSelected.value;
  }

  void incrementWeight() {
    if (weightKg.value < 25.0) {
      weightKg.value = (weightKg.value + 1.0).clamp(1.0, 25.0);
    }
  }

  void decrementWeight() {
    if (weightKg.value > 1.0) {
      weightKg.value = (weightKg.value - 1.0).clamp(1.0, 25.0);
    }
  }

  int get estimatedPoints {
    final int rate = (isOrganicSelected.value && isAnorganicSelected.value)
        ? 15
        : isAnorganicSelected.value
            ? 15
            : 10;
    return (weightKg.value * rate).round();
  }

  // Langkah 3: Panggil Armada MORPH Sekarang
  Future<void> submitOrderNow() async {
    final created = await store.createPickupOrder(
      isOrganic: isOrganicSelected.value,
      isAnorganic: isAnorganicSelected.value,
      estimatedKg: weightKg.value,
      address: addressText.value,
      landmarkNote: selectedLandmark.value,
    );

    // State 1: SEARCHING (2 Detik radar hijau berputar)
    orderFlowStep.value = "SEARCHING";

    _radarTimer?.cancel();
    _radarTimer = Timer(const Duration(seconds: 2), () {
      store.assignDriverToOrder(created.id);
      orderFlowStep.value = "DRIVER_ON_THE_WAY";
    });
  }

  void cancelCurrentOrder() {
    _radarTimer?.cancel();
    final active = store.activeOrder.value;
    if (active != null) {
      store.deleteOrCancelOrder(active.id);
    }
    orderFlowStep.value = "FORM";
    Get.snackbar(
      "Pesanan Dibatalkan",
      "Permintaan penjemputan sampah telah dibatalkan.",
      backgroundColor: const Color(0xFF0F172A),
      colorText: Colors.white,
      snackPosition: SnackPosition.TOP,
    );
  }

  void openDriverModeForDemo() {
    store.switchRole("DRIVER");
    Get.toNamed(Routes.DRIVER_DASHBOARD);
  }

  @override
  void onClose() {
    _radarTimer?.cancel();
    super.onClose();
  }
}
