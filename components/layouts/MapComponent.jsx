export const IssueMap = ({ lat, lng }) => {
  if (!lat || !lng) return null;

  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <iframe
      src={mapSrc}
      width="100%"
      height="100%"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="rounded-[2rem] border border-slate-200 dark:border-slate-700"
    />
  );
};
