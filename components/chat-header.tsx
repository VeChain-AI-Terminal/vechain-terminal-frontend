"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { ModelSelector } from "@/components/model-selector";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon, VercelIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import { memo } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { type VisibilityType, VisibilitySelector } from "./visibility-selector";
import type { Session } from "next-auth";
import { ConnectButton } from "@/components/ConnectButton";
import { FaSuitcase } from "react-icons/fa";
import { Wallet } from "lucide-react";
import { useAppKitAccount } from "@reown/appkit/react";

function PureChatHeader() {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();
  const { address, isConnected } = useAppKitAccount();
  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center justify-between px-2 md:px-2 gap-2">
      <div className="flex items-center gap-2">
        <SidebarToggle />

        {/* {(!open || windowWidth < 768) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
                onClick={() => {
                  router.push("/");
                  router.refresh();
                }}
              >
                <PlusIcon />
                <span className="md:sr-only">New Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        )} */}

        {/* {!isReadonly && (
          <ModelSelector
            session={session}
            selectedModelId={selectedModelId}
            className="order-1 md:order-2"
          />
        )} */}

        {/* {!isReadonly && (
          <VisibilitySelector
            chatId={chatId}
            selectedVisibilityType={selectedVisibilityType}
            className="order-1 md:order-3"
          />
        )} */}
      </div>
      <div className="flex flex-row gap-3 items-center">
        {isConnected && (
          <Link
            href={"/portfolio"}
            className="flex flex-row gap-2 border-2 border-theme-orange rounded-full px-3 py-2 items-center hover:bg-zinc-900 h-full"
          >
            <Wallet size={20} /> <span className="text-sm">Portfolio</span>
          </Link>
        )}

        <ConnectButton />
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
