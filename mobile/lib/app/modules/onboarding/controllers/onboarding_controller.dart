import 'package:get/get.dart';
import '../../data/providers/morph_api_provider.dart';
import '../../routes/app_routes.dart';

class OnboardingController extends GetxController {
  final MorphApiProvider store = Get.find<MorphApiProvider>();

  void enterAsWarga() {
    store.switchRole("WARGA");
    Get.offAllNamed(Routes.WARGA_HOME);
  }

  void enterAsDriver() {
    store.switchRole("DRIVER");
    Get.offAllNamed(Routes.DRIVER_DASHBOARD);
  }
}
