import 'package:get/get.dart';
import '../controllers/warga_order_controller.dart';

class WargaOrderBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<WargaOrderController>(() => WargaOrderController());
  }
}
