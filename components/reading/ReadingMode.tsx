"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import { MusicPanel } from "@/components/reading/MusicPanel";
import type { Book } from "@/types/bookshelf";

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

function SessionTimer() {
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Measured from the start time because background tabs throttle intervals.
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <p className="text-sm text-stone-400">
      Reading for{" "}
      <time className="font-mono text-base tabular-nums text-stone-100">{formatElapsed(elapsed)}</time>
    </p>
  );
}

export function ReadingMode({ book }: { book: Book }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          <BookOpen className="h-4 w-4" />
          Start reading
        </motion.button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content className="fixed inset-0 z-[100] overflow-y-auto bg-stone-950 text-stone-100 focus:outline-none">
          <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden opacity-25">
            <Image src={book.coverImage} alt="" fill sizes="100vw" className="scale-110 object-cover blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-6 sm:px-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Reading mode</p>
              <Dialog.Close className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-stone-100 transition-colors hover:bg-white/20">
                <X className="h-4 w-4" />
                Exit
              </Dialog.Close>
            </div>

            <div className="grid flex-1 content-center items-center gap-8 py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative aspect-[2/3] w-40 overflow-hidden rounded-xl shadow-2xl md:w-52">
                  <Image src={book.coverImage} alt="" fill sizes="208px" className="object-cover" />
                </div>
                <div>
                  <Dialog.Title className="text-2xl font-bold text-stone-50">{book.title}</Dialog.Title>
                  <Dialog.Description className="mt-1 text-sm text-stone-400">{book.author}</Dialog.Description>
                </div>
                <SessionTimer />
              </div>

              <MusicPanel />
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
