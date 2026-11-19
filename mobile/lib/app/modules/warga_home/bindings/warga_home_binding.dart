import 'package:get/get.dart';
import '../controllers/warga_home_controller.dart';

class WargaHomeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<WargaHomeController>(() => WargaHomeController());
  }
}
