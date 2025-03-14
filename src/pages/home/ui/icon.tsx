export const Icon = ({ data }: { data: string }) => {
    return (
        <svg
            fill="none"
            height={24}
            viewBox="0 0 24 24"
            width={24}
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