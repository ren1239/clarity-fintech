import React from "react";

export default function DecorativeBackground({
  rotation,
  translation,
}: {
  rotation: number;
  translation: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 "
    >
      <div
        style={{
          clipPath: `
polygon(45% 40%, 55% 42%,53% 90%, 47% 72%, 90% 90%, 90% 58%, 92% 18%, 37% 36%, 93% 43%, 17% 18%, 17% 18%, 17% 18%, 17% 48%)

            `,
          transform: `translateX(-${translation}%) rotate(${rotation}deg)`,
        }}
        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#43B3E8] to-[#91E8CB]  opacity-60 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
      />
    </div>
  );
}
