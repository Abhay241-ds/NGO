type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  description: string;
};

export default function StatCard({
  title,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-[#173b24]">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf4ed] text-[#17653a]">
          <i className={icon} />
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {description}
      </p>
    </div>
  );
}