import Chip from "@mui/material/Chip";

/**
 * The LocalTimeChip component displays a chip with a converted time string.
 * It converts the time string provided to a local time string of the user.
 *
 * @prop {string} time The time string to convert to local time
 * @returns {JSX.Element} The LocalTimeChip component
 */
export default function LocalTimeChip({ time }: { time: string }) {
  const convertToLocalTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return <Chip label={convertToLocalTime(time)} />;
}
