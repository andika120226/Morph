import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/order_model.dart';
import '../../../data/providers/morph_api_provider.dart';

class RewardsController extends GetxController {
  final MorphApiProvider store = Get.find<MorphApiProvider>();
  final RxString selectedFilter = "Semua".obs;

  List<RewardCatalogModel> get filteredRewards {
    if (selectedFilter.value == "Semua") {
      return store.rewardCatalog;
    }
    return store.rewardCatalog
        .where((r) => r.category == selectedFilter.value)
        .toList();
  }

  void handleRedeem(RewardCatalogModel reward) {
    final ok = store.redeemReward(reward);
    if (ok) {
      Get.snackbar(
        "Berhasil Tukar Poin! 🎉",
        "${reward.title} berhasil diklaim. Sisa saldo: ${store.walletPoints.value} Poin.",
        backgroundColor: const Color(0xFF00880D),
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
      );
    } else {
      Get.snackbar(
        "Poin Belum Cukup",
        "Butuh ${reward.pointsCost} Poin untuk menukar ${reward.title}. Yuk setor sampah lagi!",
        backgroundColor: const Color(0xFFDC2626),
        colorText: Colors.white,
        snackPosition: SnackPosition.BOTTOM,
        margin: const EdgeInsets.all(16),
      );
    }
  }
}
