type Props = { as: string; size?: number };

export const Icon = ({ as, size = 24 }: Props) => {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path clipRule="evenodd" d={as} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
};
