import React from "react";
import V2RayWizard from "./steps/V2RayWizard";
import XRayWizard from "./steps/XRayWizard";
import OpenVPNWizard from "./steps/OpenVPNWizard";
import WireGuardWizard from "./steps/WireGuardWizard";
import OpenConnectWizard from "./steps/OpenConnectWizard";

function CreateWizard({ type, onBack }) {
  switch (type) {
    case "v2ray":
      return <V2RayWizard onBack={onBack} />;
    case "xray":
      return <XRayWizard onBack={onBack} />;
    case "openvpn":
      return <OpenVPNWizard onBack={onBack} />;
    case "wireguard":
      return <WireGuardWizard onBack={onBack} />;
    case "openconnect":
      return <OpenConnectWizard onBack={onBack} />;
    default:
      return null;
  }
}

export default CreateWizard;
