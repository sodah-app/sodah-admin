"use client";

export default function ResponsiveContainer({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        w-full
        max-w-[1600px]
        mx-auto

        px-4
        sm:px-6
        md:px-8
        lg:px-10
        xl:px-12

        ${className}
      `}
    >
      {children}
    </div>
  );
}