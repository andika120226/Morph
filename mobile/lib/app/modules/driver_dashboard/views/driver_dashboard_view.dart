import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/models/order_model.dart';
import '../../../routes/app_routes.dart';
import '../controllers/driver_dashboard_controller.dart';

class DriverDashboardView extends GetView<DriverDashboardController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "MORPH Mitra Driver",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
            ),
            Text(
              "Pak Hendra Wijaya • Motor Gerobak BE 4521 YX",
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: Obx(
              () => Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: controller.store.isDriverOnline.value
                      ? const Color(0xFF00880D)
                      : const Color(0xFF475569),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  controller.store.isDriverOnline.value
                      ? "● ONLINE"
                      : "○ OFFLINE",
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Obx(() {
        final tab = controller.currentBottomTab.value;
        if (tab == 1) return _buildHistoryTab();
        if (tab == 2) return _buildEarningsTab();
        if (tab == 3) return _buildDriverProfileTab();
        return _buildDriverHomeTab();
      }),
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
            fontSize: 11,
          ),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_rounded),
              label: "Beranda",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history_rounded),
              label: "Riwayat Jemput",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.account_balance_wallet_rounded),
              label: "Pendapatan",
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.badge_rounded),
              label: "Profil Mitra",
            ),
          ],
        ),
      ),
    );
  }

  // ===========================================================================
  // TAB 1: BERANDA DRIVER (STATUS, KAPASITAS, RINGKASAN 3 KOLOM, ZONA RAMAI, ORDER)
  // ===========================================================================
  Widget _buildDriverHomeTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Saklar Status ONLINE / OFFLINE + Indikator Kapasitas Gerobak Motor
          Obx(() {
            final online = controller.store.isDriverOnline.value;
            final currentLoad = controller.store.driverCurrentLoadKg.value;
            final maxCap = controller.store.driverMaxCapacityKg.value;
            final remaining = (maxCap - currentLoad).clamp(0.0, maxCap);
            final progress = (currentLoad / maxCap).clamp(0.0, 1.0);

            return Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: online
                      ? const Color(0xFF00880D)
                      : const Color(0xFFDC2626),
                  width: 2,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          online
                              ? "🟢 STATUS: ONLINE (Siap Jemput)"
                              : "🔴 STATUS: OFFLINE (Istirahat)",
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            color: online
                                ? const Color(0xFF00880D)
                                : const Color(0xFFDC2626),
                          ),
                        ),
                      ),
                      Switch(
                        value: online,
                        activeColor: const Color(0xFF00880D),
                        onChanged: controller.toggleOnlineStatus,
                      ),
                    ],
                  ),
                  const Divider(height: 18),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Expanded(
                        child: Text(
                          "Kapasitas Gerobak Motor:",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF475569),
                          ),
                        ),
                      ),
                      Text(
                        "${currentLoad.toStringAsFixed(0)} Kg / ${maxCap.toStringAsFixed(0)} Kg",
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: LinearProgressIndicator(
                      value: progress,
                      minHeight: 12,
                      backgroundColor: const Color(0xFFE2E8F0),
                      color: const Color(0xFF00880D),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "Sisa Kapasitas Muatan: ${remaining.toStringAsFixed(0)} Kg",
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF059669),
                    ),
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 14),

          // 2. Kartu Ringkasan Hari Ini (3 Kolom)
          Obx(
            () => Container(
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _buildSummaryCol(
                      label: "Insentif Hari Ini",
                      value: "Rp ${controller.todayIncentiveRp.value}",
                      valueColor: const Color(0xFF00880D),
                    ),
                  ),
                  Container(width: 1, height: 38, color: const Color(0xFFE2E8F0)),
                  Expanded(
                    child: _buildSummaryCol(
                      label: "Selesai",
                      value: "${controller.todayCompletedTasks.value} Tugas",
                      valueColor: const Color(0xFF0F172A),
                    ),
                  ),
                  Container(width: 1, height: 38, color: const Color(0xFFE2E8F0)),
                  Expanded(
                    child: _buildSummaryCol(
                      label: "Total Angkut",
                      value:
                          "${controller.todayTotalHauledKg.value.toStringAsFixed(1)} Kg",
                      valueColor: const Color(0xFF059669),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),

          // 3. Zona Ramai Bandar Lampung
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFBBF7D0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(
                      Icons.local_fire_department_rounded,
                      color: Color(0xFFD97706),
                      size: 20,
                    ),
                    SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        "Zona Ramai Bandar Lampung",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  "Permintaan penjemputan tinggi saat ini di kecamatan:",
                  style: TextStyle(fontSize: 12, color: Color(0xFF475569)),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: [
                    _buildHotZoneChip("Kedaton (Tinggi)"),
                    _buildHotZoneChip("Sukarame (Ramai)"),
                    _buildHotZoneChip("Rajabasa (Aktif)"),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // 4. Kartu Order Masuk / Tugas Aktif
          Obx(() {
            final active = controller.store.activeOrder.value;
            if (active == null) {
              return Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.radar_rounded,
                      size: 52,
                      color: Color(0xFF00880D),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      "Menunggu Order Masuk...",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      "Pastikan status ONLINE aktif. Pesanan dari pengguna di area Kedaton & sekitarnya akan muncul otomatis di sini.",
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              );
            }

            return Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 14,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0FDF4),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          "ORDER MASUK #${active.id}",
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF00880D),
                          ),
                        ),
                      ),
                      const Text(
                        "Jarak: 1.2 Km",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    "${active.citizenName} (${active.categoryLabel})",
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "📍 ${active.address}",
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF334155),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    "Patokan: ${active.landmarkNote} • Estimasi: ${active.estimatedKg.toStringAsFixed(1)} Kg",
                    style: const TextStyle(
                      fontSize: 12,
                      color: Color(0xFF64748B),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // STEP A: TERIMA TUGAS JEMPUT
                  if (active.status == MorphOrderState.searching)
                    ElevatedButton.icon(
                      onPressed: () => controller.acceptIncomingOrder(active),
                      icon: const Icon(Icons.check_circle_rounded, size: 22),
                      label: const Text(
                        "TERIMA TUGAS JEMPUT",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF00880D),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18),
                        ),
                      ),
                    ),

                  // STEP B: PETA NAVIGASI, CHAT & SUDAH SAMPAI
                  if (active.status == MorphOrderState.driverOnTheWay) ...[
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () => Get.toNamed(Routes.CHAT),
                            icon: const Icon(Icons.chat_rounded,
                                color: Color(0xFF00880D)),
                            label: const Text(
                              "Chat Pengguna",
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              Get.snackbar(
                                "Navigasi Rute OpenStreetMap",
                                "Mengarahkan ke Jl. ZA. Pagar Alam No. 45, Kedaton (1.2 Km).",
                                backgroundColor: const Color(0xFF0F172A),
                                colorText: Colors.white,
                              );
                            },
                            icon: const Icon(Icons.navigation_rounded,
                                color: Color(0xFF00880D)),
                            label: const Text(
                              "Peta Rute",
                              style: TextStyle(
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: () =>
                          controller.confirmArrivedAtLocation(active),
                      icon: const Icon(Icons.place_rounded, size: 22),
                      label: const Text(
                        "Saya Sudah Sampai di Lokasi",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F172A),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18),
                        ),
                      ),
                    ),
                  ],

                  // STEP C: TIMBANG BERAT AKTUAL & SELESAIKAN
                  if (active.status == MorphOrderState.arrivedAtLocation) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0FDF4),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF16A34A)),
                      ),
                      child: Column(
                        children: [
                          const Text(
                            "Input Timbangan Aktual (Validasi Lapangan):",
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF065F46),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              IconButton.filled(
                                onPressed: controller.decrementActualWeight,
                                style: IconButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: const Color(0xFF0F172A),
                                ),
                                icon:
                                    const Icon(Icons.remove_rounded, size: 28),
                              ),
                              Text(
                                "${controller.actualWeighedKg.value.toStringAsFixed(1)} Kg",
                                style: const TextStyle(
                                  fontSize: 32,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF00880D),
                                ),
                              ),
                              IconButton.filled(
                                onPressed: controller.incrementActualWeight,
                                style: IconButton.styleFrom(
                                  backgroundColor: const Color(0xFF00880D),
                                  foregroundColor: Colors.white,
                                ),
                                icon: const Icon(Icons.add_rounded, size: 28),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            "Poin yang akan dikirim: +${(controller.actualWeighedKg.value * active.ratePerKg).round()} Poin",
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF047857),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    ElevatedButton.icon(
                      onPressed: () =>
                          controller.completePickupAndSendPoints(active),
                      icon: const Icon(Icons.task_alt_rounded, size: 24),
                      label: const Text(
                        "Selesaikan Penjemputan & Kirim Poin",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF00880D),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // ===========================================================================
  // TAB 2: RIWAYAT JEMPUT DRIVER
  // ===========================================================================
  Widget _buildHistoryTab() {
    final completedList = controller.store.orders
        .where((o) => o.status == MorphOrderState.completed)
        .toList();

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: completedList.length,
      itemBuilder: (context, idx) {
        final item = completedList[idx];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  color: Color(0xFF00880D),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "#${item.id} • ${item.citizenName}",
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "${item.categoryLabel} (${item.actualKg.toStringAsFixed(1)} Kg) • ${item.createdAtLabel}",
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
              const Text(
                "Selesai",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF00880D),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ===========================================================================
  // TAB 3: PENDAPATAN MITRA DRIVER
  // ===========================================================================
  Widget _buildEarningsTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF00880D), Color(0xFF059669)],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Obx(
              () => Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Total Insentif Hari Ini",
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFD1FAE5),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    "Rp ${controller.todayIncentiveRp.value}",
                    style: const TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "${controller.todayCompletedTasks.value} Tugas Selesai • ${controller.todayTotalHauledKg.value.toStringAsFixed(1)} Kg Terangkut",
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFFEF08A),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ===========================================================================
  // TAB 4: PROFIL MITRA DRIVER + KELUAR / GANTI AKUN
  // ===========================================================================
  Widget _buildDriverProfileTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
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
                  radius: 28,
                  backgroundColor: Color(0xFF00880D),
                  child: Icon(Icons.delivery_dining_rounded,
                      color: Colors.white, size: 30),
                ),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Pak Hendra Wijaya",
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        "Motor Gerobak Hijau • BE 4521 YX • Posko Kedaton",
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
          const Spacer(),
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

  Widget _buildSummaryCol({
    required String label,
    required String value,
    required Color valueColor,
  }) {
    return Column(
      children: [
        Text(
          label,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: Color(0xFF64748B),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w900,
            color: valueColor,
          ),
        ),
      ],
    );
  }

  Widget _buildHotZoneChip(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFBBF7D0)),
      ),
      child: Text(
        "📍 $text",
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w800,
          color: Color(0xFF00880D),
        ),
      ),
    );
  }
}
