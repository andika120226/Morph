import 'package:get/get.dart';
import '../modules/onboarding/bindings/onboarding_binding.dart';
import '../modules/onboarding/views/onboarding_view.dart';
import '../modules/warga_home/bindings/warga_home_binding.dart';
import '../modules/warga_home/views/warga_home_view.dart';
import '../modules/warga_order/bindings/warga_order_binding.dart';
import '../modules/warga_order/views/warga_order_view.dart';
import '../modules/chat/bindings/chat_binding.dart';
import '../modules/chat/views/chat_view.dart';
import '../modules/rewards/bindings/rewards_binding.dart';
import '../modules/rewards/views/rewards_view.dart';
import '../modules/driver_dashboard/bindings/driver_dashboard_binding.dart';
import '../modules/driver_dashboard/views/driver_dashboard_view.dart';
import 'app_routes.dart';

class AppPages {
  static const INITIAL = Routes.ONBOARDING;

  static final routes = <GetPage>[
    GetPage(
      name: Routes.ONBOARDING,
      page: () => OnboardingView(),
      binding: OnboardingBinding(),
    ),
    GetPage(
      name: Routes.WARGA_HOME,
      page: () => WargaHomeView(),
      binding: WargaHomeBinding(),
    ),
    GetPage(
      name: Routes.WARGA_ORDER,
      page: () => WargaOrderView(),
      binding: WargaOrderBinding(),
    ),
    GetPage(
      name: Routes.CHAT,
      page: () => ChatView(),
      binding: ChatBinding(),
    ),
    GetPage(
      name: Routes.REWARDS,
      page: () => RewardsView(),
      binding: RewardsBinding(),
    ),
    GetPage(
      name: Routes.DRIVER_DASHBOARD,
      page: () => DriverDashboardView(),
      binding: DriverDashboardBinding(),
    ),
  ];
}
