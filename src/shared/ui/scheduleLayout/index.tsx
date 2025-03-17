import clsx from "clsx";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const ScheduleLayout = ({ className, children }: Props) => {
  return (
    <div
      className={clsx(
        "flex absolute inset-2 bg-blue-900 rounded-lg p-2 shadow-sm justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};
