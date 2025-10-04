import { motion } from "framer-motion";
import Image from "next/image";

export const Greeting = () => {
  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center gap-2"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-semibold text-theme-orange flex flex-row gap-2 items-center"
      >
        <Image
          src="/images/vechain.png"
          alt="VeChain Terminal"
          width={40}
          height={40}
          className=" md:w-10 md:h-10"
        />
        <h1 className=" font-semibold text-theme-orange">VeChain Terminal</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-lg md:text-xl text-zinc-500"
      >
        AI co-pilot for VeChain blockchain
      </motion.div>
    </div>
  );
};
