import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/providers/morph_api_provider.dart';

class ChatController extends GetxController {
  final MorphApiProvider store = Get.find<MorphApiProvider>();
  final TextEditingController textCtrl = TextEditingController();

  final List<String> quickReplies = [
    "Pak, sampah sudah saya ikat di depan pagar ya",
    "Hati-hati di jalan Pak",
    "Lokasi sesuai titik peta",
  ];

  void sendQuickReply(String msg) {
    store.sendMessage(
      senderRole: store.currentRole.value,
      text: msg,
    );
  }

  void sendTypedMessage() {
    if (textCtrl.text.trim().isEmpty) return;
    store.sendMessage(
      senderRole: store.currentRole.value,
      text: textCtrl.text,
    );
    textCtrl.clear();
  }

  @override
  void onClose() {
    textCtrl.dispose();
    super.onClose();
  }
}
