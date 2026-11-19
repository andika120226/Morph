import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../data/models/order_model.dart';
import '../../routes/app_routes.dart';
import '../controllers/driver_dashboard_controller.dart';

class DriverDashboardView extends GetView<DriverDashboardController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "MORPH Mitra Driver (MORPH Partner)",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
            ),
            Text(
              "Pak Hendra Wijaya • Motor Gerobak BE 4521 YX",
              style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 10.0),
            child: TextButton.icon(
              onPressed: controller.switchBackToWargaMode,
              icon: const Icon(Icons.home_rounded,
                  color: Color(0xFF34D399), size: 18),
              label: const Text(
                "Mode Warga",
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF34D399),
                ),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // =================================================================
            // 1. HEADER STATUS KERJA (ONLINE/OFFLINE SWITCH & KAPASITAS GEROBAK)
            // =================================================================
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
                                ? "🟢 STATUS: ONLINE (Siap Menerima Jemputan)"
                                : "🔴 STATUS: OFFLINE (Istirahat)",
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
                    const Divider(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "Kapasitas Muatan Armada Saat Ini:",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF475569),
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
                      "Kapasitas Gerobak Tersedia: ${remaining.toStringAsFixed(0)} Kg",
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
            const SizedBox(height: 18),

            // =================================================================
            // 2 & 3. KARTU ORDER MASUK & ALUR EKSEKUSI DRIVER STEP-BY-STEP
            // =================================================================
            Obx(() {
              final active = controller.store.activeOrder.value;
              if (active == null) {
                return Container(
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.radar_rounded,
                        size: 56,
                        color: Color(0xFF00880D),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        "Belum Ada Order Masuk Saat Ini",
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        "Silakan buat pesanan di Mode Warga terlebih dahulu untuk mendemokan order masuk secara real-time.",
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: controller.switchBackToWargaMode,
                        icon: const Icon(Icons.add_circle_outline_rounded),
                        label: const Text("Buka Mode Warga & Buat Order"),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF00880D),
                          foregroundColor: Colors.white,
                        ),
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
                        fontSize: 18,
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
                      "Patokan: ${active.landmarkNote} • Estimasi Awal: ${active.estimatedKg.toStringAsFixed(1)} Kg",
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF64748B),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // STEP A: Jika masih SEARCHING -> Tombol TERIMA TUGAS JEMPUT
                    if (active.status == MorphOrderState.searching)
                      ElevatedButton.icon(
                        onPressed: () => controller.acceptIncomingOrder(active),
                        icon: const Icon(Icons.check_circle_rounded, size: 24),
                        label: const Text(
                          "TERIMA TUGAS JEMPUT",
                          style: TextStyle(
                            fontSize: 16,
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

                    // STEP B: Jika sudah DRIVER_ON_THE_WAY -> Tombol Chat & Saya Sudah Sampai
                    if (active.status == MorphOrderState.driverOnTheWay) ...[
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () => Get.toNamed(Routes.CHAT),
                              icon: const Icon(Icons.chat_rounded,
                                  color: Color(0xFF00880D)),
                              label: const Text(
                                "Buka Chat Warga",
                                style: TextStyle(
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              style: OutlinedButton.styleFrom(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 14),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        onPressed: () =>
                            controller.confirmArrivedAtCitizenHome(active),
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

                    // STEP C: Jika sudah ARRIVED -> Input Timbangan Aktual (Kg) & Selesaikan
                    if (active.status ==
                        MorphOrderState.arrivedAtLocation) ...[
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
                                  icon: const Icon(Icons.remove_rounded,
                                      size: 28),
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
                                  icon:
                                      const Icon(Icons.add_rounded, size: 28),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              "Poin yang akan diterima warga: +${(controller.actualWeighedKg.value * active.ratePerKg).round()} Poin",
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
      ),
    );
  }
}
