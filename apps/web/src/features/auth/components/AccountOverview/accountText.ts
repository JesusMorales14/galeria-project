const memberSince = new Intl.DateTimeFormat("es", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** «noviembre de 2026» */
export function formatMemberSince(isoDate: string): string {
  return memberSince.format(new Date(isoDate));
}

export function sessionsLabel(count: number): string {
  if (count <= 1) return "Solo esta";
  return `${count}, contando esta`;
}
