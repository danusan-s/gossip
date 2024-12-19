import Chip from "@mui/material/Chip";

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
