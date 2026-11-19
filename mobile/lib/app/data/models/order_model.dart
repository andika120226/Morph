// Model Data Transaksi, Chat, dan Reward MORPH Bandar Lampung
enum MorphOrderState {
  searching,
  driverOnTheWay,
  arrivedAtLocation,
  completed,
  cancelled,
}

class OrderModel {
  String id;
  String citizenName;
  String address;
  String district;
  String landmarkNote;
  bool isOrganic;
  bool isAnorganic;
  double estimatedKg;
  double actualKg;
  int pointsEarned;
  MorphOrderState status;
  String driverName;
  String driverPlate;
  double driverRating;
  String createdAtLabel;
  double latitude;
  double longitude;

  OrderModel({
    required this.id,
    required this.citizenName,
    required this.address,
    required this.district,
    required this.landmarkNote,
    required this.isOrganic,
    required this.isAnorganic,
    required this.estimatedKg,
    required this.actualKg,
    required this.pointsEarned,
    required this.status,
    this.driverName = "Pak Hendra Wijaya",
    this.driverPlate = "BE 4521 YX",
    this.driverRating = 4.9,
    required this.createdAtLabel,
    this.latitude = -5.3824,
    this.longitude = 105.2586,
  });

  String get categoryLabel {
    if (isOrganic && isAnorganic) return "Organik & Anorganik";
    if (isOrganic) return "Sampah Organik";
    return "Sampah Anorganik";
  }

  int get ratePerKg {
    if (isOrganic && isAnorganic) return 15;
    if (isAnorganic) return 15;
    return 10;
  }

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "citizenName": citizenName,
      "address": address,
      "district": district,
      "landmarkNote": landmarkNote,
      "isOrganic": isOrganic,
      "isAnorganic": isAnorganic,
      "estimatedKg": estimatedKg,
      "actualKg": actualKg,
      "pointsEarned": pointsEarned,
      "status": status.name,
      "driverName": driverName,
      "driverPlate": driverPlate,
      "driverRating": driverRating,
      "createdAtLabel": createdAtLabel,
      "latitude": latitude,
      "longitude": longitude,
    };
  }

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    final statusStr = (json["status"] ?? "searching").toString();
    MorphOrderState parsedStatus = MorphOrderState.searching;
    for (final s in MorphOrderState.values) {
      if (s.name == statusStr) {
        parsedStatus = s;
        break;
      }
    }

    return OrderModel(
      id: (json["id"] ?? "MRP-8821").toString(),
      citizenName: (json["citizenName"] ?? "Keluarga Budi").toString(),
      address: (json["address"] ??
              "Jl. ZA. Pagar Alam No. 45, Kedaton, Bandar Lampung")
          .toString(),
      district: (json["district"] ?? "Kedaton").toString(),
      landmarkNote: (json["landmarkNote"] ?? "Di depan pagar").toString(),
      isOrganic: json["isOrganic"] == true,
      isAnorganic: json["isAnorganic"] == true,
      estimatedKg: (json["estimatedKg"] as num?)?.toDouble() ?? 5.0,
      actualKg: (json["actualKg"] as num?)?.toDouble() ?? 5.0,
      pointsEarned: (json["pointsEarned"] as num?)?.toInt() ?? 50,
      status: parsedStatus,
      driverName: (json["driverName"] ?? "Pak Hendra Wijaya").toString(),
      driverPlate: (json["driverPlate"] ?? "BE 4521 YX").toString(),
      driverRating: (json["driverRating"] as num?)?.toDouble() ?? 4.9,
      createdAtLabel: (json["createdAtLabel"] ?? "Hari ini, 10:30 WIB").toString(),
      latitude: (json["latitude"] as num?)?.toDouble() ?? -5.3824,
      longitude: (json["longitude"] as num?)?.toDouble() ?? 105.2586,
    );
  }
}

class ChatMessageModel {
  final String id;
  final String senderRole; // 'WARGA' atau 'DRIVER'
  final String senderName;
  final String messageText;
  final String timeLabel;

  ChatMessageModel({
    required this.id,
    required this.senderRole,
    required this.senderName,
    required this.messageText,
    required this.timeLabel,
  });
}

class RewardCatalogModel {
  final String id;
  final String title;
  final String subtitle;
  final String category; // 'Sembako', 'E-Wallet', 'Pulsa & PLN'
  final int pointsCost;
  final String valueLabel;

  RewardCatalogModel({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.category,
    required this.pointsCost,
    required this.valueLabel,
  });
}
