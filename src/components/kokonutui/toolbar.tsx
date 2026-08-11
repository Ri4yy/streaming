"use client";

/**
 * @author: @dorianbaffier
 * @description: Toolbar
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import {
  Bell,
  CircleUserRound,
  Edit2,
  FileDown,
  Frame,
  Layers,
  Lock,
  type LucideIcon,
  MousePointer2,
  Move,
  Palette,
  Shapes,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToolbarItem {
  id: string;
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface ToolbarProps {
  items?: ToolbarItem[];
  defaultSelected?: string;
  className?: string;
  activeColor?: string;
  onSelect?: (itemId: string) => void;
}

const DEFAULT_TOOLBAR_ITEMS: ToolbarItem[] = [
  { id: "select", title: "Select", icon: MousePointer2 },
  { id: "move", title: "Move", icon: Move },
  { id: "shapes", title: "Shapes", icon: Shapes },
  { id: "layers", title: "Layers", icon: Layers },
  { id: "frame", title: "Frame", icon: Frame },
  { id: "properties", title: "Properties", icon: SlidersHorizontal },
  { id: "export", title: "Export", icon: FileDown },
  { id: "share", title: "Share", icon: Share2 },
  { id: "notifications", title: "Notifications", icon: Bell },
  { id: "profile", title: "Profile", icon: CircleUserRound },
  { id: "appearance", title: "Appearance", icon: Palette },
];

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const notificationVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: -10 },
  exit: { opacity: 0, y: -20 },
};

const lineVariants = {
  initial: { scaleX: 0, x: "-50%" },
  animate: {
    scaleX: 1,
    x: "0%",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    scaleX: 0,
    x: "50%",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const transition = { type: "spring", bounce: 0, duration: 0.4 };

export function Toolbar({
  items = DEFAULT_TOOLBAR_ITEMS,
  defaultSelected = "select",
  className,
  activeColor = "text-theme-main",
  onSelect,
}: ToolbarProps) {
  const [selected, setSelected] = React.useState<string | null>(
    defaultSelected
  );
  // Keep selected in sync with defaultSelected if it changes
  React.useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  const [activeNotification, setActiveNotification] = React.useState<
    string | null
  >(null);
  const outsideClickRef = React.useRef(null);

  const handleItemClick = (itemId: string) => {
    setSelected(itemId);
    onSelect?.(itemId);
    setActiveNotification(itemId);
    setTimeout(() => setActiveNotification(null), 1500);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative flex items-center gap-3 p-2",
          "bg-background/80 backdrop-blur-md",
          "rounded-full border border-white/10",
          "transition-all duration-200"
        )}
        ref={outsideClickRef}
      >
        <AnimatePresence>
          {activeNotification && (
            <motion.div
              animate="animate"
              className="absolute -top-8 left-1/2 z-50 -translate-x-1/2 transform"
              exit="exit"
              initial="initial"
              transition={{ duration: 0.3 }}
              variants={notificationVariants as any}
            >
              <div className="rounded-full bg-theme-main/80 backdrop-blur-md border border-theme-main/40 px-3 py-1 text-white text-xs font-medium">
                {items.find((item) => item.id === activeNotification)?.title}
              </div>
              <motion.div
                animate="animate"
                className="absolute -bottom-1 left-1/2 h-[2px] w-full origin-left bg-theme-main/80"
                exit="exit"
                initial="initial"
                variants={lineVariants as any}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 mx-auto">
          {items.map((item) => (
            <motion.button
              animate="animate"
              className={cn(
                "relative flex items-center rounded-full px-3 py-2 border",
                "font-medium text-sm transition-all duration-300",
                selected === item.id
                  ? "bg-theme-main/20 border-theme-main/40 text-white shadow-sm"
                  : "bg-transparent border-transparent text-white/70 hover:bg-white/5 hover:border-white/10 hover:text-white"
              )}
              custom={selected === item.id}
              initial={false}
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              transition={transition as any}
              variants={buttonVariants as any}
            >
              <item.icon
                className={cn(selected === item.id && "text-white")}
                size={20}
              />
              <AnimatePresence initial={false}>
                {selected === item.id && (
                  <motion.span
                    animate="animate"
                    className="overflow-hidden whitespace-nowrap"
                    exit="exit"
                    initial="initial"
                    transition={transition as any}
                    variants={spanVariants as any}
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
