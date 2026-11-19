import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'app/data/providers/morph_api_provider.dart';
import 'app/data/services/api_service.dart';
import 'app/routes/app_pages.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GetStorage.init();

  // Inisialisasi ApiService (NestJS /api/orders) & Global Reactive Store
  Get.put<ApiService>(ApiService(), permanent: true);
  Get.put<MorphApiProvider>(MorphApiProvider(), permanent: true);

  runApp(const MorphMobileApp());
}

class MorphMobileApp extends StatelessWidget {
  const MorphMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'MORPH Bandar Lampung',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00880D),
          primary: const Color(0xFF00880D),
          secondary: const Color(0xFF059669),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      initialRoute: AppPages.INITIAL,
      getPages: AppPages.routes,
    );
  }
}
