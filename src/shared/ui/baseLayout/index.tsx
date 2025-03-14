import clsx from "clsx";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export const BaseLayout = ({ className, children }: Props) => {
  return (
    <div
      className={clsx(
        "flex gap-3 absolute inset-2 bg-blue-900 rounded-xl p-2 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
};
