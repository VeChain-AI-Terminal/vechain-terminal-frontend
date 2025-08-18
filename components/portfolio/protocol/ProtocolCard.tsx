import Image from "next/image";

type ProtocolCardProps = {
  name: string;
  logo_url: string;
  netUsdValue: number;
  onClick?: () => void;
};

export function ProtocolCard({
  name,
  logo_url,
  netUsdValue,
  onClick,
}: ProtocolCardProps) {
  return (
    <div
      className="flex flex-row items-center justify-center bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 cursor-pointer hover:shadow-md transition gap-3"
      onClick={onClick}
    >
      <div className="h-10 w-10 relative ">
        <Image
          src={logo_url}
          alt={name}
          fill
          className="object-contain rounded-full"
        />
      </div>
      <div className="flex flex-col  justify-center">
        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {name}
        </div>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          ${netUsdValue.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
