import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/order_model.dart';
import '../../../data/providers/morph_api_provider.dart';
import '../../../routes/app_routes.dart';

class WargaHomeController extends GetxController {
  final MorphApiProvider store = Get.find<MorphApiProvider>();
  final RxInt currentBottomTab = 0.obs; // 0: Beranda, 1: Pesanan Saya, 2: Tukar Poin, 3: Profil
  final RxString searchQuery = "".obs;
  final TextEditingController searchCtrl = TextEditingController();

  void switchTab(int index) {
    currentBottomTab.value = index;
  }

  void openOrderWithCategory(String categoryType) {
    Get.toNamed(Routes.WARGA_ORDER, arguments: categoryType);
  }

  void logoutToOnboarding() {
    Get.offAllNamed(Routes.ONBOARDING);
  }

  // UPDATE Dialog: Edit Estimasi Berat (Kg) & Catatan Patokan Rumah
  void showEditOrderDialog(BuildContext context, OrderModel order) {
    final RxDouble tempKg = order.estimatedKg.obs;
    final TextEditingController noteCtrl =
        TextEditingController(text: order.landmarkNote);

    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Text(
          "Ubah Pesanan #${order.id}",
          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
        ),
        content: Obx(
          () => Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                "Ubah Perkiraan Berat Sampah (Kg):",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton.filled(
                    onPressed: () {
                      if (tempKg.value > 1.0) tempKg.value -= 1.0;
                    },
                    icon: const Icon(Icons.remove),
                  ),
                  Text(
                    "${tempKg.value.toStringAsFixed(1)} Kg",
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF00880D),
                    ),
                  ),
                  IconButton.filled(
                    onPressed: () {
                      if (tempKg.value < 25.0) tempKg.value += 1.0;
                    },
                    style: IconButton.styleFrom(
                      backgroundColor: const Color(0xFF00880D),
                    ),
                    icon: const Icon(Icons.add),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Text(
                "Catatan Patokan Rumah:",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: noteCtrl,
                decoration: InputDecoration(
                  hintText: "Contoh: Di depan pagar rumah...",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text("Batal"),
          ),
          ElevatedButton(
            onPressed: () {
              store.updateOrderByCitizen(
                orderId: order.id,
                newEstimatedKg: tempKg.value,
                newLandmarkNote: noteCtrl.text.trim().isEmpty
                    ? "Di depan pagar"
                    : noteCtrl.text.trim(),
              );
              Get.back();
              Get.snackbar(
                "Pesanan Diperbarui ✓",
                "Perkiraan berat (${tempKg.value.toStringAsFixed(1)} Kg) & patokan rumah berhasil disimpan.",
                backgroundColor: const Color(0xFF00880D),
                colorText: Colors.white,
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF00880D),
              foregroundColor: Colors.white,
            ),
            child: const Text("Simpan Perubahan"),
          ),
        ],
      ),
    );
  }

  @override
  void onClose() {
    searchCtrl.dispose();
    super.onClose();
  }
}
