import { motion } from "framer-motion";
import Image from "next/image";

export const Greeting = () => {
  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-semibold text-orange-500 flex flex-row gap-2 items-center"
      >
        <Image
          src="/images/orange-terminal.png"
          alt="Orange Terminal"
          width={40}
          height={40}
        />
        <h1 className=" font-semibold text-orange-500">Orange Terminal</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-zinc-500"
      >
        A focused, no-nonsense AI for Core Blockchain.
      </motion.div>
    </div>
  );
};
