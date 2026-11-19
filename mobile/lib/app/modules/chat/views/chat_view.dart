import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controllers/chat_controller.dart';

class ChatView extends GetView<ChatController> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: const Color(0xFF00880D),
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Pak Hendra Wijaya (Mitra Driver)",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
            ),
            Text(
              "Motor Gerobak Hijau • BE 4521 YX • Online",
              style: TextStyle(fontSize: 11, color: Color(0xFFD1FAE5)),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Chat Messages List
          Expanded(
            child: Obx(
              () => ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: controller.store.chatMessages.length,
                itemBuilder: (context, index) {
                  final msg = controller.store.chatMessages[index];
                  final isMe =
                      msg.senderRole == controller.store.currentRole.value;

                  return Align(
                    alignment:
                        isMe ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      constraints: BoxConstraints(
                        maxWidth: MediaQuery.of(context).size.width * 0.78,
                      ),
                      decoration: BoxDecoration(
                        color: isMe
                            ? const Color(0xFF00880D)
                            : const Color(0xFFFFFFFF),
                        borderRadius: BorderRadius.circular(18),
                        border: isMe
                            ? null
                            : Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            msg.senderName,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: isMe
                                  ? const Color(0xFFA7F3D0)
                                  : const Color(0xFF00880D),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            msg.messageText,
                            style: TextStyle(
                              fontSize: 14,
                              color: isMe
                                  ? Colors.white
                                  : const Color(0xFF0F172A),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ),

          // Quick Replies Bar (Gaya Gojek supaya lansia/ibu RT tidak repot mengetik)
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Balasan Cepat (Sekali Sentuh):",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: controller.quickReplies.map((reply) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ActionChip(
                          backgroundColor: const Color(0xFFF0FDF4),
                          side: const BorderSide(color: Color(0xFF16A34A)),
                          label: Text(
                            reply,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF00880D),
                            ),
                          ),
                          onPressed: () => controller.sendQuickReply(reply),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 8),

                // Input Field & Send Button
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: controller.textCtrl,
                        decoration: InputDecoration(
                          hintText: "Ketik pesan ke Pak Hendra...",
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 12,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(
                              color: Color(0xFFCBD5E1),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: const Color(0xFF00880D),
                      child: IconButton(
                        icon: const Icon(Icons.send_rounded, color: Colors.white),
                        onPressed: controller.sendTypedMessage,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
