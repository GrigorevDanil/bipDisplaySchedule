export const Icon = ({ data, size = 24 }: { data: string, size?: number }) => {
    return (
        <svg
            fill="none"
            height={size}
            viewBox="0 0 24 24"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                clipRule="evenodd"
                d={data}
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};