import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/storage";
import { loadProfilePhoto } from "@/lib/student-profile";

/** Share the profile page's user-scoped cache without blocking test startup. */
export function StudentProfileAvatar({ className, fallback }: { className: string; fallback: ReactNode }) {
  const user = getUser();
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const photo = useQuery({
    queryKey: ["student-profile-photo", user?.id],
    queryFn: loadProfilePhoto,
    enabled: Boolean(user?.id),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const source = photo.data?.photo;
  return <span className={className}>
    {source && source !== failedPhoto
      ? <img src={source} alt="Your profile photo" className="h-full w-full object-cover" onError={() => setFailedPhoto(source)} />
      : fallback}
  </span>;
}
