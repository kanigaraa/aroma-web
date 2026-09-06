import ProvinceOnboarding from "@/components/ProvinceOnboarding";
import { getMeta } from "@/lib/data";

export default function OnboardingPage() {
  return <ProvinceOnboarding provinces={getMeta().provinsi} />;
}
