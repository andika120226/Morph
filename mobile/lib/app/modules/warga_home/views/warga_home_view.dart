import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/order_model.dart';
import '../../../routes/app_routes.dart';
import '../controllers/warga_home_controller.dart';

class WargaHomeView extends GetView<WargaHomeController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      // =======================================================================
      // 1. TOP BAR: SAPAAN "Halo, Budi Santoso!", LOKASI KEDATON & NOTIFIKASI
      // =======================================================================
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        titleSpacing: 16,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Halo, Budi Santoso! 👋",
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 2),
            Text(
              "📍 Kedaton, Bandar Lampung",
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
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
            child: Stack(
              alignment: Alignment.topRight,
              children: [
                IconButton(
                  onPressed: () {
                    Get.snackbar(
                      "Notifikasi MORPH",
                      "Armada area Kedaton aktif beroperasi hari ini hingga pukul 17:00 WIB.",
                      backgroundColor: const Color(0xFF0F172A),
                      colorText: Colors.white,
                      snackPosition: SnackPosition.TOP,
                    );
                  },
                  icon: const Icon(
                    Icons.notifications_none_rounded,
                    color: Color(0xFF0F172A),
                    size: 26,
                  ),
                ),
                Positioned(
                  right: 10,
                  top: 10,
                  child: Container(
                    width: 9,
                    height: 9,
                    decoration: const BoxDecoration(
                      color: Color(0xFF00880D),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),

      body: Obx(() {
        final tab = controller.currentBottomTab.value;
        if (tab == 1) return _buildMyOrdersTab(context);
        if (tab == 2) return _buildInlineRewardsTab();
        if (tab == 3) return _buildProfileTab();
        return _buildMainBerandaTab();
      }),

      // =======================================================================
      // BOTTOM NAVIGATION BAR (4 TAB): BERANDA, PESANAN SAYA, TUKAR POIN, PROFIL
      // =======================================================================
      bottomNavigationBar: Obx(
        () => BottomNavigationBar(
          currentIndex: controller.currentBottomTab.value,
          onTap: controller.switchTab,
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
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
  // TAB 1: BERANDA UTAMA PENGGUNA (GAYA SUPERAPP)
  // ===========================================================================
  Widget _buildMainBerandaTab() {
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 110),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Bar Pencarian
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x0A000000),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: TextField(
                  controller: controller.searchCtrl,
                  onChanged: (val) => controller.searchQuery.value = val,
                  decoration: const InputDecoration(
                    hintText: "Cari layanan jemput sampah atau tukar poin...",
                    hintStyle: TextStyle(
                      fontSize: 13,
                      color: Color(0xFF94A3B8),
                    ),
                    prefixIcon: Icon(
                      Icons.search_rounded,
                      color: Color(0xFF00880D),
                    ),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // 2. Kartu Dompet MORPH Points (3 Tombol Aksi Cepat)
              Obx(() {
                final pts = controller.store.walletPoints.value;
                return Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF00880D), Color(0xFF059669)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
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
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
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
                                    fontSize: 26,
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
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              _buildWalletActionBtn(
                                icon: Icons.redeem_rounded,
                                label: "Tukar Poin",
                                onTap: () => Get.toNamed(Routes.REWARDS),
                              ),
                              const SizedBox(width: 8),
                              _buildWalletActionBtn(
                                icon: Icons.history_rounded,
                                label: "Riwayat",
                                onTap: () => controller.switchTab(1),
                              ),
                              const SizedBox(width: 8),
                              _buildWalletActionBtn(
                                icon: Icons.qr_code_scanner_rounded,
                                label: "Scan QR",
                                onTap: () {
                                  Get.snackbar(
                                    "Scan QR Drop Point",
                                    "Arahkan kamera ke QR Code posko MORPH untuk klaim poin instan.",
                                    backgroundColor: const Color(0xFF0F172A),
                                    colorText: Colors.white,
                                  );
                                },
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 22),

              // 3. Grid 4 Layanan Utama (Ikon Bulat Berwarna)
              const Text(
                "Layanan Penjemputan MORPH",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 12),
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.38,
                children: [
                  _buildServiceGridCard(
                    emoji: "🌿",
                    title: "Jemput Organik",
                    subtitle: "+10 Poin/Kg",
                    circleColor: const Color(0xFFDCFCE7),
                    accentColor: const Color(0xFF00880D),
                    onTap: () => controller.openOrderWithCategory("ORGANIC"),
                  ),
                  _buildServiceGridCard(
                    emoji: "♻️",
                    title: "Jemput Anorganik",
                    subtitle: "+15 Poin/Kg",
                    circleColor: const Color(0xFFD1FAE5),
                    accentColor: const Color(0xFF059669),
                    onTap: () => controller.openOrderWithCategory("ANORGANIC"),
                  ),
                  _buildServiceGridCard(
                    emoji: "🚛",
                    title: "Angkut Besar",
                    subtitle: "Perabot/Kardus >20Kg",
                    circleColor: const Color(0xFFFEF3C7),
                    accentColor: const Color(0xFFD97706),
                    onTap: () => controller.openOrderWithCategory("ANORGANIC"),
                  ),
                  _buildServiceGridCard(
                    emoji: "📍",
                    title: "Drop Point",
                    subtitle: "Antar ke TPS Terdekat",
                    circleColor: const Color(0xFFE0F2FE),
                    accentColor: const Color(0xFF0284C7),
                    onTap: () {
                      Get.snackbar(
                        "Drop Point Terdekat",
                        "Posko Bank Sampah MORPH Kedaton (Jl. ZA. Pagar Alam No. 45) — 400m dari lokasi Anda.",
                        backgroundColor: const Color(0xFF00880D),
                        colorText: Colors.white,
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 22),

              // 4. Banner Promo & Misi Harian (Horizontal Scroll)
              const Text(
                "Promo & Misi Harian",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                height: 126,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _buildPromoBannerCard(
                      badge: "MISI MINGGU INI",
                      title:
                          "Bonus +50 Poin untuk setoran botol plastik pertama minggu ini!",
                      gradientColors: const [
                        Color(0xFF00880D),
                        Color(0xFF10B981)
                      ],
                      onTap: () =>
                          controller.openOrderWithCategory("ANORGANIC"),
                    ),
                    const SizedBox(width: 12),
                    _buildPromoBannerCard(
                      badge: "REWARD SPESIAL",
                      title:
                          "Tukar 500 Poin dengan Token Listrik / Sembako Hemat",
                      gradientColors: const [
                        Color(0xFF0F172A),
                        Color(0xFF1E293B)
                      ],
                      onTap: () => Get.toNamed(Routes.REWARDS),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 22),

              // 5. Kartu Dampak Lingkungan & Tips Edukasi
              const Text(
                "Dampak Lingkungan Anda",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "48.5 Kg",
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF00880D),
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            "Sampah Terkelola",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF475569),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: const Color(0xFFE2E8F0),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "12.4 Kg",
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF059669),
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            "CO₂ Dicegah",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF475569),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              const Text(
                "Tips & Edukasi Pemilahan",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 10),
              _buildTipArticleCard(
                icon: Icons.eco_rounded,
                title: "Cara Praktis Memilah Sisa Dapur Organik",
                desc:
                    "Tiriskan air pada sisa sayur dan buah sebelum dimasukkan ke kantong hijau agar tidak berbau.",
              ),
              const SizedBox(height: 10),
              _buildTipArticleCard(
                icon: Icons.recycling_rounded,
                title: "Remukkan Botol Plastik & Lipat Kardus",
                desc:
                    "Menghemat ruang gerobak armada dan memaksimalkan nilai timbangan poin anorganik Anda.",
              ),
            ],
          ),
        ),

        // Floating Card Hijau Status Pesanan Aktif
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
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
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
  // TAB 2: PESANAN SAYA (OVERFLOW FIXED WITH EXPANDED & FLEXIBLE)
  // ===========================================================================
  Widget _buildMyOrdersTab(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          color: Colors.white,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Pesanan Saya",
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      "Buat, ubah berat/patokan, atau batalkan pesanan",
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Flexible(
                flex: 0,
                child: ElevatedButton.icon(
                  onPressed: () => controller.openOrderWithCategory("ORGANIC"),
                  icon: const Icon(Icons.add_rounded, size: 18),
                  label: const Text(
                    "Order Baru",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF00880D),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                  ),
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
                          Expanded(
                            child: Text(
                              "#${order.id} • ${order.categoryLabel}",
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
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
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF64748B),
                        ),
                      ),
                      const Divider(height: 20),

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
  // TAB 3: TUKAR POIN
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
              "Tukarkan poin hasil pilah sampah Anda menjadi Beras 5 Kg, Minyak Goreng, Pulsa, atau Saldo Dompet Digital MORPH Pay.",
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
  // TAB 4: PROFIL PENGGUNA (OVERFLOW FIXED & TANPA SWITCHER MODE DRIVER)
  // ===========================================================================
  Widget _buildProfileTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Kartu Identitas Pengguna
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
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Budi Santoso",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        "RT 04 / Lingkungan Kedaton, Bandar Lampung",
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Menu Standar Profil Pengguna
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                _buildProfileMenuTile(
                  icon: Icons.location_on_outlined,
                  title: "Alamat Jemput Tersimpan",
                  subtitle: "Jl. ZA. Pagar Alam No. 45, Kedaton",
                  onTap: () {
                    Get.snackbar(
                      "Alamat Tersimpan",
                      "Titik utama: Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung",
                      backgroundColor: const Color(0xFF00880D),
                      colorText: Colors.white,
                    );
                  },
                ),
                const Divider(height: 1),
                _buildProfileMenuTile(
                  icon: Icons.notifications_outlined,
                  title: "Notifikasi",
                  subtitle: "Pengingat jadwal jemput & info poin",
                  onTap: () {
                    Get.snackbar(
                      "Notifikasi Aktif",
                      "Semua notifikasi penjemputan dan poin aktif.",
                      backgroundColor: const Color(0xFF0F172A),
                      colorText: Colors.white,
                    );
                  },
                ),
                const Divider(height: 1),
                _buildProfileMenuTile(
                  icon: Icons.help_outline_rounded,
                  title: "Pusat Bantuan MORPH",
                  subtitle: "Hotline Bandar Lampung: (0721) 889-4000",
                  onTap: () {
                    Get.snackbar(
                      "Pusat Bantuan MORPH",
                      "Hubungi tim kami di (0721) 889-4000 atau WhatsApp +62 812-8890-4521.",
                      backgroundColor: const Color(0xFF00880D),
                      colorText: Colors.white,
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Tombol Keluar / Ganti Akun di bagian paling bawah Profil
          OutlinedButton.icon(
            onPressed: controller.logoutToOnboarding,
            icon: const Icon(Icons.logout_rounded, color: Color(0xFFDC2626)),
            label: const Text(
              "Keluar / Ganti Akun",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: Color(0xFFDC2626),
              ),
            ),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              side: const BorderSide(color: Color(0xFFDC2626), width: 1.5),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
              ),
              backgroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceGridCard({
    required String emoji,
    required String title,
    required String subtitle,
    required Color circleColor,
    required Color accentColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: circleColor,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(emoji, style: const TextStyle(fontSize: 22)),
              ),
            ),
            const SizedBox(height: 10),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: accentColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPromoBannerCard({
    required String badge,
    required String title,
    required List<Color> gradientColors,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: 270,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: gradientColors),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.22),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                badge,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
            ),
            Text(
              title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                height: 1.3,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTipArticleCard({
    required IconData icon,
    required String title,
    required String desc,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: const Color(0xFF00880D), size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF64748B),
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileMenuTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color(0xFFF0FDF4),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: const Color(0xFF00880D), size: 20),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w800,
          color: Color(0xFF0F172A),
        ),
      ),
      subtitle: Text(
        subtitle,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
      ),
      trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF94A3B8)),
      onTap: onTap,
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
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 10,
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
