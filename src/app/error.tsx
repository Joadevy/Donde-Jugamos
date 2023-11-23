"use client"; // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 items-center min-h-screen justify-center -mt-16">
      <h2 className="text-lg">Oh, parece que algo salio mal!</h2>
      <p className="text-red-400">{error.message}</p>
    </div>
  );
}
