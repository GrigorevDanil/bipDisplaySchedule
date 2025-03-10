export const ScheduleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-3 absolute inset-2 bg-blue-900 rounded-lg p-2 shadow-sm">
      {children}
    </div>
  );
};
