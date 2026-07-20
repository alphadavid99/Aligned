import { useEffect, useState } from "react";
import { isNativePlatform } from "../lib/device/platform";

// A small, unobtrusive build identifier (brief §6) so a given TestFlight build
// is recognisable by sight. Shows the web build stamp always; on native it
// appends the iOS marketing version + native build number from @capacitor/app.
export default function BuildStamp() {
  const [native, setNative] = useState("");

  useEffect(() => {
    if (!isNativePlatform()) return;
    void import("@capacitor/app").then(({ App }) =>
      App.getInfo()
        .then((info) => setNative(` · iOS ${info.version} (${info.build})`))
        .catch(() => {}),
    );
  }, []);

  return (
    <div className="buildstamp">
      BUILD {__BUILD_STAMP__}
      {native}
    </div>
  );
}
