const statusColor = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  offline: "bg-gray-400",
};

export function StatusDot({ status }: { status: keyof typeof statusColor }) {
  return (
    // <span
    //   className={`h-2.5 w-2.5 rounded-full ${statusColor[status]} `}
    // />
    <>
      <span className="relative flex h-3 w-3">
        {status === "online" && (
          <span
            className={`absolute  inline-flex h-full w-full rounded-full ${statusColor[status]} opacity-75 animate-ping`}
          ></span>
        )}
        <span
          className={`relative inline-flex h-3 w-3 rounded-full ${statusColor[status]}`}
        ></span>
      </span>
    </>
  );
}
