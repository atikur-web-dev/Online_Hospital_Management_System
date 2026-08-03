import { Clock3 } from "lucide-react";

interface ScheduleItem {
  day: string;
  time: string;
}

interface Props {
  schedule?: ScheduleItem[];
}

const defaultSchedule: ScheduleItem[] = [
  { day: "Monday", time: "9:00 AM - 5:00 PM" },
  { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
  { day: "Wednesday", time: "10:00 AM - 4:00 PM" },
  { day: "Thursday", time: "9:00 AM - 5:00 PM" },
  { day: "Friday", time: "9:00 AM - 1:00 PM" },
];

const ScheduleCard = ({
  schedule = defaultSchedule,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Weekly Schedule
        </h2>

        <Clock3 className="w-6 h-6 text-emerald-600" />
      </div>

      <div className="space-y-4">
        {schedule.map((item) => (
          <div
            key={item.day}
            className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            <span className="font-medium text-gray-700">
              {item.day}
            </span>

            <span className="font-semibold text-emerald-700">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCard;