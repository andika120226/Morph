import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../routes/app_routes.dart';
import '../controllers/warga_order_controller.dart';

class WargaOrderView extends GetView<WargaOrderController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE2E8F0),
      body: Stack(
        children: [
          // ===================================================================
          // BAGIAN ATAS: VISUAL PETA INTERAKTIF OPENSTREETMAP BANDAR LAMPUNG
          // ===================================================================
          Positioned.fill(
            bottom: MediaQuery.of(context).size.height * 0.48,
            child: Obx(() {
              final step = controller.orderFlowStep.value;
              return Container(
                decoration: const BoxDecoration(
                  color: Color(0xFFD1FAE5),
                ),
                child: Stack(
                  children: [
                    // Grid Jalan Simulasi OpenStreetMap Kedaton
                    CustomPaint(
                      size: Size.infinite,
                      painter: _OsmRoadMapPainter(),
                    ),

                    // Label Jalan OpenStreetMap Bandar Lampung
                    Positioned(
                      top: 64,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          "OpenStreetMap • Kedaton, Bandar Lampung",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                      ),
                    ),

                    // Pin Rumah Warga di Tengah Peta
                    Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0F172A),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Text(
                              "📍 Rumah Keluarga Budi (Kedaton)",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                          const Icon(
                            Icons.location_on_rounded,
                            color: Color(0xFF00880D),
                            size: 46,
                          ),
                        ],
                      ),
                    ),

                    // Ikon Armada Bergerak Mendekati Rumah Warga saat DRIVER_ON_THE_WAY
                    if (step == "DRIVER_ON_THE_WAY")
                      Positioned(
                        top: 120,
                        left: 75,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF00880D),
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: const [
                              BoxShadow(
                                color: Colors.black26,
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.delivery_dining_rounded,
                                color: Colors.white,
                                size: 20,
                              ),
                              SizedBox(width: 6),
                              Text(
                                "Pak Hendra (BE 4521 YX) • 5 Mnt",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                    // Tombol Kembali di Kiri Atas Peta
                    Positioned(
                      top: 48,
                      left: 16,
                      child: CircleAvatar(
                        backgroundColor: Colors.white,
                        child: IconButton(
                          icon: const Icon(
                            Icons.arrow_back_rounded,
                            color: Color(0xFF0F172A),
                          ),
                          onPressed: () => Get.back(),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),

          // ===================================================================
          // BAGIAN BAWAH: BOTTOM SHEET INTERAKTIF BERTAHAP (GAYA GORIDE)
          // ===================================================================
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              width: double.infinity,
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.62,
              ),
              padding: const EdgeInsets.fromLTRB(20, 14, 20, 20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 20,
                    offset: Offset(0, -4),
                  ),
                ],
              ),
              child: Obx(() {
                final step = controller.orderFlowStep.value;
                if (step == "SEARCHING") {
                  return _buildSearchingRadarState();
                }
                if (step == "DRIVER_ON_THE_WAY") {
                  return _buildDriverOnTheWayState();
                }
                return _buildOrderFormState();
              }),
            ),
          ),
        ],
      ),
    );
  }

  // STATE 0: FORM PEMESANAN SIMPEL (HANYA KG, PILL TOGGLE, PATOKAN CEPAT)
  Widget _buildOrderFormState() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Center(
            child: Container(
              width: 44,
              height: 5,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            "1. Pilih Jenis Sampah & Perkiraan Berat (Kg)",
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 10),

          // Pill Toggle: [ 🌿 Organik ] atau [ ♻️ Anorganik ]
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: controller.toggleOrganic,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: controller.isOrganicSelected.value
                          ? const Color(0xFF00880D)
                          : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: controller.isOrganicSelected.value
                            ? const Color(0xFF00880D)
                            : const Color(0xFFCBD5E1),
                        width: 2,
                      ),
                    ),
                    child: Text(
                      "🌿 Organik",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: controller.isOrganicSelected.value
                            ? Colors.white
                            : const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: InkWell(
                  onTap: controller.toggleAnorganic,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: controller.isAnorganicSelected.value
                          ? const Color(0xFF059669)
                          : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: controller.isAnorganicSelected.value
                            ? const Color(0xFF059669)
                            : const Color(0xFFCBD5E1),
                        width: 2,
                      ),
                    ),
                    child: Text(
                      "♻️ Anorganik",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: controller.isAnorganicSelected.value
                            ? Colors.white
                            : const Color(0xFF0F172A),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Slider Berat (1 Kg - 25 Kg) + Tombol - / + Besar
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton.filled(
                      onPressed: controller.decrementWeight,
                      style: IconButton.styleFrom(
                        backgroundColor: const Color(0xFFE2E8F0),
                        foregroundColor: const Color(0xFF0F172A),
                      ),
                      icon: const Icon(Icons.remove_rounded),
                    ),
                    Column(
                      children: [
                        Text(
                          "${controller.weightKg.value.toStringAsFixed(1)} Kg",
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF00880D),
                          ),
                        ),
                        const Text(
                          "Perkiraan Berat Sampah",
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                    IconButton.filled(
                      onPressed: controller.incrementWeight,
                      style: IconButton.styleFrom(
                        backgroundColor: const Color(0xFF00880D),
                        foregroundColor: Colors.white,
                      ),
                      icon: const Icon(Icons.add_rounded),
                    ),
                  ],
                ),
                Slider(
                  value: controller.weightKg.value,
                  min: 1.0,
                  max: 25.0,
                  divisions: 24,
                  activeColor: const Color(0xFF00880D),
                  onChanged: (val) => controller.weightKg.value = val,
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFBBF7D0)),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.verified_rounded,
                        color: Color(0xFF00880D),
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "Estimasi muatan motor gerobak aman. Anda akan mendapat +${controller.estimatedPoints} Poin Reward!",
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF065F46),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Langkah 2: Konfirmasi Titik Jemput GPS & Chip Patokan Cepat
          const Text(
            "2. Titik Jemput GPS & Patokan Rumah",
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            "📍 ${controller.addressText.value}",
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: Color(0xFF475569),
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: controller.quickLandmarks.map((chip) {
              final isSelected = controller.selectedLandmark.value == chip;
              return ChoiceChip(
                label: Text(
                  chip,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: isSelected ? Colors.white : const Color(0xFF0F172A),
                  ),
                ),
                selected: isSelected,
                selectedColor: const Color(0xFF00880D),
                backgroundColor: const Color(0xFFF1F5F9),
                onSelected: (_) => controller.selectedLandmark.value = chip,
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Langkah 3: Tombol Hijau Penuh
          ElevatedButton.icon(
            onPressed: controller.submitOrderNow,
            icon: const Icon(Icons.local_shipping_rounded, size: 22),
            label: const Text(
              "Panggil Armada MORPH Sekarang",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
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
        ],
      ),
    );
  }

  // STATE 1: SEARCHING RADAR (2 DETIK)
  Widget _buildSearchingRadarState() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const SizedBox(height: 16),
        const SizedBox(
          width: 64,
          height: 64,
          child: CircularProgressIndicator(
            strokeWidth: 6,
            color: Color(0xFF00880D),
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          "Mencari Mitra Kebersihan terdekat di sekitar Kedaton...",
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 17,
            fontWeight: FontWeight.w900,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          "Mohon tunggu sebentar, sistem sedang menghubungkan ke armada gerobak MORPH.",
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 13, color: Color(0xFF64748B)),
        ),
        const SizedBox(height: 24),
        OutlinedButton.icon(
          onPressed: controller.cancelCurrentOrder,
          icon: const Icon(Icons.close_rounded, color: Color(0xFFDC2626)),
          label: const Text(
            "Batalkan Pesanan",
            style: TextStyle(
              fontWeight: FontWeight.w800,
              color: Color(0xFFDC2626),
            ),
          ),
          style: OutlinedButton.styleFrom(
            side: const BorderSide(color: Color(0xFFDC2626)),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          ),
        ),
      ],
    );
  }

  // STATE 2: DRIVER ON THE WAY (PROFIL PAK HENDRA WIJAYA + CHAT & TELEPON)
  Widget _buildDriverOnTheWayState() {
    final active = controller.store.activeOrder.value;
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFBBF7D0)),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.directions_bike_rounded,
                    color: Color(0xFF00880D), size: 18),
                SizedBox(width: 8),
                Text(
                  "Menuju Lokasi Anda (Estimasi 5 Menit)",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF00880D),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Kartu Profil Mitra Driver
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Color(0xFF00880D),
                  child: Icon(Icons.person_rounded,
                      color: Colors.white, size: 32),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Pak Hendra Wijaya",
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        "Motor Gerobak Hijau - BE 4521 YX",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF475569),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Text(
                            "⭐ 4.9",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFD97706),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            "• ${active?.estimatedKg.toStringAsFixed(1) ?? '5.0'} Kg (${active?.categoryLabel ?? 'Organik'})",
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF00880D),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Tombol Chat Driver & Telepon
          Row(
            children: [
              Expanded(
                flex: 2,
                child: ElevatedButton.icon(
                  onPressed: () => Get.toNamed(Routes.CHAT),
                  icon: const Icon(Icons.chat_bubble_rounded),
                  label: const Text(
                    "Chat Pak Hendra",
                    style: TextStyle(fontWeight: FontWeight.w800),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF00880D),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    Get.snackbar(
                      "Memanggil Pak Hendra...",
                      "Menghubungkan panggilan suara ke 0812-7721-9012",
                      backgroundColor: const Color(0xFF0F172A),
                      colorText: Colors.white,
                    );
                  },
                  icon: const Icon(Icons.phone_rounded,
                      color: Color(0xFF00880D)),
                  label: const Text(
                    "Telepon",
                    style: TextStyle(
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    side: const BorderSide(color: Color(0xFFCBD5E1)),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Tombol Pintas Demo Beralih ke Mode Driver untuk Menyelesaikan Jemputan
          TextButton.icon(
            onPressed: controller.openDriverModeForDemo,
            icon: const Icon(Icons.swap_horiz_rounded,
                color: Color(0xFF059669)),
            label: const Text(
              "Simulasi Demo: Buka Mode Mitra Driver & Timbang Sampah",
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: Color(0xFF059669),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _OsmRoadMapPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final roadPaint = Paint()
      ..color = Colors.white.withOpacity(0.75)
      ..strokeWidth = 14
      ..style = PaintingStyle.stroke;

    final routePaint = Paint()
      ..color = const Color(0xFF00880D)
      ..strokeWidth = 5
      ..style = PaintingStyle.stroke;

    canvas.drawLine(
      Offset(0, size.height * 0.35),
      Offset(size.width, size.height * 0.65),
      roadPaint,
    );
    canvas.drawLine(
      Offset(size.width * 0.25, 0),
      Offset(size.width * 0.65, size.height),
      roadPaint,
    );
    canvas.drawLine(
      Offset(85, 130),
      Offset(size.width * 0.5, size.height * 0.5),
      routePaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
