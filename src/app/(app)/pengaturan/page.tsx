import AccountSettings from "@/components/AccountSettings";
import { getMeta } from "@/lib/data";

export const dynamic = "force-static";

export default function PengaturanPage() {
  return <AccountSettings provinces={getMeta().provinsi} />;
}
