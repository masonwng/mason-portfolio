import Image from "next/image";
import { getImageAsset } from "../lib/media";
import type { LogoAsset } from "../lib/portfolio";

export async function OrganizationLogo({
  logo,
  badge,
  name,
}: {
  logo?: LogoAsset;
  badge: string;
  name?: string;
}) {
  const image = logo && logo.approved !== false ? await getImageAsset(logo.src) : null;

  return (
    <span className={`organization-logo${image ? " organization-logo-image" : " organization-badge"}`} title={name}>
      {image && logo ? (
        <Image src={image.src} alt={logo.alt} width={image.width} height={image.height} sizes="44px" />
      ) : (
        <span aria-hidden="true">{badge}</span>
      )}
    </span>
  );
}
