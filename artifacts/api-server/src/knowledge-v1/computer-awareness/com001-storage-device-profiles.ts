import { COM001_ALL_SOURCE_AUTHORITIES } from "./com001-source-authority-extension";

export type Com001StorageMedium = "magnetic" | "optical" | "solid-state";
export type Com001AccessPattern = "sequential" | "random";

export type Com001StorageDeviceProfile = {
  profileId: string;
  label: string;
  medium: Com001StorageMedium;
  accessPattern?: Com001AccessPattern;
  removable: boolean;
  persistent: true;
  roles: string[];
  sourceRefs: Array<{
    sourceId: string;
    url: string;
    locator: string;
  }>;
  review: {
    status: "REVIEW_REQUIRED";
    confidence: number;
  };
};

export const COM001_STORAGE_DEVICE_PROFILES: Com001StorageDeviceProfile[] = [
  {
    profileId: "storage-profile-magnetic-tape",
    label: "Magnetic tape",
    medium: "magnetic",
    accessPattern: "sequential",
    removable: true,
    persistent: true,
    roles: ["backup", "archive", "offline-storage", "long-term-retention"],
    sourceRefs: [
      {
        sourceId: "IBM-AIX-RMT-TAPE",
        url: "https://www.ibm.com/docs/en/aix/7.3.0?topic=files-rmt-special-file",
        locator: "Magnetic tapes are sequential-access media used primarily for backup, archives and offline storage.",
      },
      {
        sourceId: "IBM-TAPE-STORAGE",
        url: "https://www.ibm.com/products/tape",
        locator: "Tape is used for long-term backup, archive and retention.",
      },
    ],
    review: { status: "REVIEW_REQUIRED", confidence: 0.82 },
  },
  {
    profileId: "storage-profile-usb-flash",
    label: "USB flash drive",
    medium: "solid-state",
    accessPattern: "random",
    removable: true,
    persistent: true,
    roles: ["portable-storage", "file-transfer", "backup"],
    sourceRefs: [
      {
        sourceId: "IBM-HMC-USB-FLASH",
        url: "https://www.ibm.com/docs/en/help-ibm-hmc-z17?topic=introduction-usb-flash-memory-drive",
        locator: "USB flash is removable writable media and is used by HMC backup operations.",
      },
      {
        sourceId: "IBM-I-RMS",
        url: "https://www.ibm.com/docs/en/i/7.5.0?topic=solutions-removable-mass-storage-rms",
        locator: "RMS is random-access removable storage and includes flash-drive media.",
      },
    ],
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
  },
  {
    profileId: "storage-profile-rdx",
    label: "RDX removable disk",
    medium: "magnetic",
    accessPattern: "random",
    removable: true,
    persistent: true,
    roles: ["backup", "recovery", "removable-storage"],
    sourceRefs: [
      {
        sourceId: "IBM-I-RMS",
        url: "https://www.ibm.com/docs/en/i/7.5.0?topic=solutions-removable-mass-storage-rms",
        locator: "RDX is removable random-access storage used for backup and recovery.",
      },
    ],
    review: { status: "REVIEW_REQUIRED", confidence: 0.82 },
  },
  {
    profileId: "storage-profile-worm-optical",
    label: "WORM optical media",
    medium: "optical",
    accessPattern: "random",
    removable: true,
    persistent: true,
    roles: ["archive", "write-once-retention", "removable-storage"],
    sourceRefs: [
      {
        sourceId: "IBM-I-OPTICAL-MEDIA",
        url: "https://www.ibm.com/docs/en/i/7.6.0?topic=devices-optical-media-types",
        locator: "IBM describes WORM optical storage as an economical archival medium.",
      },
      {
        sourceId: "IBM-I-RMS",
        url: "https://www.ibm.com/docs/en/i/7.5.0?topic=solutions-removable-mass-storage-rms",
        locator: "IBM describes removable mass storage as random access and optical-like in behavior.",
      },
    ],
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
  },
  {
    profileId: "storage-profile-floppy",
    label: "Floppy disk",
    medium: "magnetic",
    removable: true,
    persistent: true,
    roles: ["legacy-backup", "software-distribution", "file-transfer"],
    sourceRefs: [
      {
        sourceId: "IBM-FLOPPY-HISTORY",
        url: "https://www.ibm.com/history/floppy-disk",
        locator: "IBM documents floppy disks as magnetic removable storage historically used for backups and file transfer.",
      },
    ],
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
  },
  {
    profileId: "storage-profile-sd-card",
    label: "SD memory card",
    medium: "solid-state",
    removable: true,
    persistent: true,
    roles: ["portable-storage", "removable-storage"],
    sourceRefs: [
      {
        sourceId: "KINGSTON-SD-MICROSD-CARDS",
        url: "https://www.kingston.com/en/memory-cards",
        locator: "Kingston identifies SD and microSD products as flash memory cards.",
      },
    ],
    review: { status: "REVIEW_REQUIRED", confidence: 0.8 },
  },
];

export type Com001StorageProfileConstraints = {
  medium?: Com001StorageMedium;
  accessPattern?: Com001AccessPattern;
  removable?: boolean;
  persistent?: boolean;
  requiredRoles?: string[];
  excludedRoles?: string[];
};

export function matchesStorageProfile(
  profile: Com001StorageDeviceProfile,
  constraints: Com001StorageProfileConstraints,
) {
  if (constraints.medium && profile.medium !== constraints.medium) return false;
  if (constraints.accessPattern && profile.accessPattern !== constraints.accessPattern) return false;
  if (typeof constraints.removable === "boolean" && profile.removable !== constraints.removable) {
    return false;
  }
  if (typeof constraints.persistent === "boolean" && profile.persistent !== constraints.persistent) {
    return false;
  }
  if (constraints.requiredRoles?.some((role) => !profile.roles.includes(role))) return false;
  if (constraints.excludedRoles?.some((role) => profile.roles.includes(role))) return false;
  return true;
}

export function solveStorageProfileConstraints(
  constraints: Com001StorageProfileConstraints,
) {
  return COM001_STORAGE_DEVICE_PROFILES.filter((profile) =>
    matchesStorageProfile(profile, constraints),
  );
}

export function auditCom001StorageProfiles() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const approvedSourceById = new Map(
    COM001_ALL_SOURCE_AUTHORITIES.map((source) => [source.sourceId, source]),
  );

  for (const profile of COM001_STORAGE_DEVICE_PROFILES) {
    if (ids.has(profile.profileId)) issues.push(`DUPLICATE_PROFILE_ID:${profile.profileId}`);
    ids.add(profile.profileId);
    if (profile.review.status !== "REVIEW_REQUIRED") {
      issues.push(`PROFILE_NOT_REVIEW_LOCKED:${profile.profileId}`);
    }
    if (profile.roles.length === 0) issues.push(`PROFILE_WITHOUT_ROLES:${profile.profileId}`);
    if (profile.sourceRefs.length === 0) issues.push(`PROFILE_WITHOUT_SOURCE:${profile.profileId}`);
    for (const sourceRef of profile.sourceRefs) {
      const approvedSource = approvedSourceById.get(sourceRef.sourceId);
      if (!approvedSource) {
        issues.push(`UNREGISTERED_PROFILE_SOURCE:${profile.profileId}:${sourceRef.sourceId}`);
        continue;
      }
      if (approvedSource.url !== sourceRef.url) {
        issues.push(`PROFILE_SOURCE_URL_MISMATCH:${profile.profileId}:${sourceRef.sourceId}`);
      }
      if (!sourceRef.url.startsWith("https://")) {
        issues.push(`NON_HTTPS_PROFILE_SOURCE:${profile.profileId}:${sourceRef.sourceId}`);
      }
    }
  }

  const canonicalTapeSolve = solveStorageProfileConstraints({
    medium: "magnetic",
    accessPattern: "sequential",
    removable: true,
    requiredRoles: ["backup", "archive"],
  });
  if (canonicalTapeSolve.length !== 1 || canonicalTapeSolve[0]?.label !== "Magnetic tape") {
    issues.push("TAPE_CONSTRAINT_SET_NOT_UNIQUE");
  }

  return {
    valid: issues.length === 0,
    profileCount: COM001_STORAGE_DEVICE_PROFILES.length,
    canonicalTapeSolveCount: canonicalTapeSolve.length,
    issues,
  };
}
