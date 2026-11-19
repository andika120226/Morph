import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../data/models/order_model.dart';
import '../../routes/app_routes.dart';
import '../controllers/warga_home_controller.dart';

class WargaHomeView extends GetView<WargaHomeController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      // =======================================================================
      // 1. TOP BAR: SAPAAN RAMAH, LOKASI KEDATON, & ROLE SWITCHER KE MODE DRIVER
      // =======================================================================
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        titleSpacing: 16,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Halo, keluarga Budi! 👋",
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 2),
            Text(
              "📍 Kedaton, Bandar Lampung",
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: Color(0xFF00880D),
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: TextButton.icon(
              onPressed: controller.switchToDriverMode,
              icon: const Icon(
                Icons.delivery_dining_rounded,
                color: Color(0xFF00880D),
                size: 18,
              ),
              label: const Text(
                "Mode Driver",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF00880D),
                ),
              ),
              style: TextButton.styleFrom(
                backgroundColor: const Color(0xFFF0FDF4),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: const BorderSide(color: Color(0xFFBBF7D0)),
                ),
              ),
            ),
          ),
        ],
      ),

      body: Obx(() {
        final tab = controller.currentBottomTab.value;
        if (tab == 1) return _buildMyOrdersCrudTab(context);
        if (tab == 2) return _buildInlineRewardsTab();
        if (tab == 3) return _buildProfileTab();
        return _buildMainBerandaTab();
      }),

      // =======================================================================
      // 5. BOTTOM NAVIGATION BAR (4 TAB): BERANDA, PESANAN SAYA, TUKAR POIN, PROFIL
      // =======================================================================
      bottomNavigationBar: Obx(
        () => BottomNavigationBar(
          currentIndex: controller.currentBottomTab.value,
          onTap: controller.switchTab,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF00880D),
          unselectedItemColor: const Color(0xFF64748B),
          selectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 12,
          ),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded),
              label: "Beranda",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.receipt_long_rounded),
              label: "Pesanan Saya",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.card_giftcard_rounded),
              label: "Tukar Poin",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_rounded),
              label: "Profil",
            ),
          ],
        ),
      ),
    );
  }

  // ===========================================================================
  // TAB 1: BERANDA UTAMA WARGA (GAYA GOJEK SUPERAPP)
  // ===========================================================================
  Widget _buildMainBerandaTab() {
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 110),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 2. Kartu Dompet MORPH Points (Desain ala GoPay Bar)
              Obx(() {
                final pts = controller.store.walletPoints.value;
                return Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF00880D), Color(0xFF059669)],
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF00880D).withOpacity(0.25),
                        blurRadius: 16,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Dompet MORPH Points",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFFD1FAE5),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "$pts Poin",
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                          ),
                          Text(
                            "Setara Rp ${pts * 10}",
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFFFEF08A),
                            ),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          _buildWalletActionBtn(
                            icon: Icons.redeem_rounded,
                            label: "Tukar Poin",
                            onTap: () => Get.toNamed(Routes.REWARDS),
                          ),
                          const SizedBox(width: 10),
                          _buildWalletActionBtn(
                            icon: Icons.history_rounded,
                            label: "Riwayat",
                            onTap: () => controller.switchTab(1),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 22),

              const Text(
                "Mau Jemput Sampah Apa Hari Ini?",
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                "Sentuh salah satu tombol besar di bawah untuk memanggil armada:",
                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 14),

              // 3. Menu Utama 2 Tombol Raksasa (Fokus Pemilahan Instan)
              // Tombol Raksasa 1: Jemput Sampah Organik
              InkWell(
                onTap: () => controller.openOrderWithCategory("ORGANIC"),
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: const Color(0xFF00880D),
                      width: 2,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 10,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0FDF4),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Center(
                          child: Text("🌿", style: TextStyle(fontSize: 34)),
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Jemput Sampah Organik",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              "Sisa makanan, sayur, daun kering — +10 Poin/Kg",
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF475569),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        Icons.arrow_forward_ios_rounded,
                        color: Color(0xFF00880D),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // Tombol Raksasa 2: Jemput Sampah Anorganik
              InkWell(
                onTap: () => controller.openOrderWithCategory("ANORGANIC"),
                borderRadius: BorderRadius.circular(24),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: const Color(0xFF059669),
                      width: 2,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 10,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: const Color(0xFFECFDF5),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Center(
                          child: Text("♻️", style: TextStyle(fontSize: 34)),
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Jemput Sampah Anorganik",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              "Botol plastik, kardus, kertas, kaleng — +15 Poin/Kg",
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF475569),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        Icons.arrow_forward_ios_rounded,
                        color: Color(0xFF059669),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // 4. Banner Edukasi Warga Bandar Lampung
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: const Row(
                  children: [
                    Icon(
                      Icons.tips_and_updates_rounded,
                      color: Color(0xFF00880D),
                      size: 32,
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Tips Pilah Sampah Mudah dari Rumah",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF065F46),
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            "Pisahkan kantong sisa dapur (Organik) dan kemasan botol/kardus (Anorganik) agar penimbangan driver lebih cepat!",
                            style: TextStyle(
                              fontSize: 12,
                              color: Color(0xFF047857),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // 4. Floating Card Hijau Status Pesanan Aktif di Bagian Bawah
        Obx(() {
          final active = controller.store.activeOrder.value;
          if (active == null) return const SizedBox.shrink();

          return Positioned(
            left: 16,
            right: 16,
            bottom: 14,
            child: InkWell(
              onTap: () => Get.toNamed(Routes.WARGA_ORDER),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF00880D),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 12,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.local_shipping_rounded,
                      color: Colors.white,
                      size: 28,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        "🚛 Armada ${active.driverName} sedang menuju rumah Anda (4 Menit)",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    const Icon(
                      Icons.chevron_right_rounded,
                      color: Colors.white,
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  // ===========================================================================
  // TAB 2: PESANAN SAYA (FITUR CRUD LENGKAP: CREATE, READ, UPDATE, DELETE)
  // ===========================================================================
  Widget _buildMyOrdersCrudTab(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          color: Colors.white,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Daftar Pesanan Saya (CRUD)",
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  Text(
                    "Buat, ubah berat/patokan, atau batalkan pesanan",
                    style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () => controller.openOrderWithCategory("ORGANIC"),
                icon: const Icon(Icons.add_rounded, size: 18),
                label: const Text(
                  "Order Baru",
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00880D),
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: Obx(
            () => ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: controller.store.orders.length,
              itemBuilder: (context, idx) {
                final order = controller.store.orders[idx];
                final isEditable =
                    order.status == MorphOrderState.searching ||
                    order.status == MorphOrderState.driverOnTheWay;

                return Container(
                  margin: const EdgeInsets.only(bottom: 14),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isEditable
                          ? const Color(0xFF00880D)
                          : const Color(0xFFE2E8F0),
                      width: isEditable ? 1.5 : 1,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "#${order.id} • ${order.categoryLabel}",
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: order.status == MorphOrderState.completed
                                  ? const Color(0xFFF0FDF4)
                                  : const Color(0xFFFEF3C7),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              order.status == MorphOrderState.completed
                                  ? "SELESAI"
                                  : "AKTIF DIJEMPUT",
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                                color:
                                    order.status == MorphOrderState.completed
                                        ? const Color(0xFF00880D)
                                        : const Color(0xFFD97706),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        "Berat: ${order.actualKg.toStringAsFixed(1)} Kg • Reward: +${order.pointsEarned} Poin",
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF00880D),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Patokan: ${order.landmarkNote} (${order.createdAtLabel})",
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      const Divider(height: 20),

                      // Tombol CRUD: Update (Ubah Berat/Patokan) & Delete (Batalkan/Hapus)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          if (isEditable)
                            TextButton.icon(
                              onPressed: () =>
                                  controller.showEditOrderDialog(context, order),
                              icon: const Icon(Icons.edit_rounded, size: 16),
                              label: const Text("Ubah Berat / Patokan"),
                            ),
                          TextButton.icon(
                            onPressed: () {
                              controller.store.deleteOrCancelOrder(order.id);
                              Get.snackbar(
                                "Data Dihapus",
                                "Pesanan #${order.id} telah dihapus dari daftar.",
                                backgroundColor: const Color(0xFF0F172A),
                                colorText: Colors.white,
                              );
                            },
                            icon: const Icon(
                              Icons.delete_outline_rounded,
                              color: Color(0xFFDC2626),
                              size: 16,
                            ),
                            label: Text(
                              isEditable ? "Batalkan" : "Hapus Riwayat",
                              style: const TextStyle(color: Color(0xFFDC2626)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }

  // ===========================================================================
  // TAB 3: TUKAR POIN RINGKAS
  // ===========================================================================
  Widget _buildInlineRewardsTab() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.card_giftcard_rounded,
              size: 64,
              color: Color(0xFF00880D),
            ),
            const SizedBox(height: 14),
            const Text(
              "Katalog Penukaran Poin MORPH",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 8),
            const Text(
              "Tukarkan poin hasil pilah sampah Anda menjadi Beras 5 Kg, Minyak Goreng, Pulsa, atau Saldo GoPay/DANA.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () => Get.toNamed(Routes.REWARDS),
              icon: const Icon(Icons.redeem_rounded),
              label: const Text(
                "Buka Katalog Hadiah Lengkap",
                style: TextStyle(fontWeight: FontWeight.w800),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00880D),
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ===========================================================================
  // TAB 4: PROFIL WARGA & ROLE SWITCHER INSTAN KE MITRA DRIVER
  // ===========================================================================
  Widget _buildProfileTab() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Color(0xFF00880D),
                  child: Icon(Icons.person_rounded,
                      color: Colors.white, size: 34),
                ),
                SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Keluarga Budi Santoso",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "RT 04 / Lingkungan Kedaton, Bandar Lampung",
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: controller.switchToDriverMode,
            icon: const Icon(Icons.swap_horiz_rounded),
            label: const Text(
              "Beralih ke Mode Mitra Driver (GoPartner)",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0F172A),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 18),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWalletActionBtn({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.white, size: 22),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
