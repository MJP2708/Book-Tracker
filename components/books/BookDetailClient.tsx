"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Star,
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronUp,
  BookOpen,
  StickyNote,
  Hash,
  CalendarDays,
} from "lucide-react";
import type { Book, Review, BookRecommendation } from "@/types/bookshelf";
import { BookCard } from "@/components/bookshelf/BookCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "details" | "reviews" | "notes" | "similar";
type ShelfOption = "want_to_read" | "currently_reading" | "finished";

interface Props {
  book: Book;
  reviews: Review[];
  similar: BookRecommendation[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string }[] = [
  { key: "details", label: "Details" },
  { key: "reviews", label: "Reviews" },
  { key: "notes", label: "Notes" },
  { key: "similar", label: "Similar" },
];

const SHELF_LABELS: Record<ShelfOption, string> = {
  want_to_read: "Want to Read",
  currently_reading: "Currently Reading",
  finished: "Finished",
};

const DESCRIPTION_THRESHOLD = 100;

// ─── Animation variants ───────────────────────────────────────────────────────

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay: i * 0.07, ease: "easeOut" },
  }),
};

// ─── StarRating ───────────────────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.78 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="focus:outline-none"
          aria-label={`Rate ${star} out of 5`}
        >
          <Star
            className={`h-5 w-5 transition-colors duration-100 ${
              star <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-stone-300 dark:text-stone-600"
            }`}
          />
        </motion.button>
      ))}
      <AnimatePresence>
        {value > 0 && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className="ml-2 text-xs text-stone-500 dark:text-stone-400"
          >
            {value}.0 / 5
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── AddToShelfButton ─────────────────────────────────────────────────────────

function AddToShelfButton() {
  const [shelf, setShelf] = useState<ShelfOption | null>(null);
  const [open, setOpen] = useState(false);

  const handleSelect = (option: ShelfOption) => {
    setShelf(option);
    setOpen(false);
  };

  const isAdded = shelf !== null;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15 }}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
          isAdded
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-amber-500 text-white hover:bg-amber-600"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isAdded ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 480, damping: 22 }}
            >
              <Check className="h-4 w-4" />
            </motion.span>
          ) : (
            <motion.span
              key="plus"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BookmarkPlus className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={shelf ?? "default"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {isAdded ? SHELF_LABELS[shelf!] : "Add to Shelf"}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900"
          >
            {(Object.entries(SHELF_LABELS) as [ShelfOption, string][]).map(([value, label]) => (
              <motion.button
                key={value}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.12 }}
                onClick={() => handleSelect(value)}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-stone-50 dark:hover:bg-stone-800 ${
                  shelf === value
                    ? "font-semibold text-amber-600 dark:text-amber-400"
                    : "text-stone-700 dark:text-stone-300"
                }`}
              >
                {shelf === value && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <Check className="h-3.5 w-3.5 text-amber-500" />
                  </motion.span>
                )}
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ExpandableDescription ────────────────────────────────────────────────────

function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > DESCRIPTION_THRESHOLD;

  return (
    <div>
      <motion.div
        initial={false}
        animate={{ height: expanded || !needsTruncation ? "auto" : "4.5rem" }}
        transition={{ duration: 0.32, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{text}</p>
      </motion.div>

      {needsTruncation && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}

// ─── Tab content panels ───────────────────────────────────────────────────────

function DetailsTab({ book }: { book: Book }) {
  const stats = [
    { icon: BookOpen, label: "Pages", value: book.pages.toLocaleString() },
    { icon: Star, label: "Rating", value: book.rating.toFixed(1) },
    { icon: CalendarDays, label: "Published", value: book.publishedYear ?? "—" },
    { icon: Hash, label: "Genres", value: book.genres.length },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-stone-100 bg-stone-50 p-4 text-center dark:border-stone-800 dark:bg-stone-900"
          >
            <Icon className="mx-auto mb-2 h-4 w-4 text-amber-500" />
            <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{value}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Genres</p>
        <div className="flex flex-wrap gap-2">
          {book.genres.map((genre, i) => (
            <motion.span
              key={genre}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, delay: i * 0.05 }}
              className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
            >
              {genre}
            </motion.span>
          ))}
        </div>
      </div>

      {book.affiliateUrl && (
        <motion.a
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          href={book.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
        >
          Buy this book →
        </motion.a>
      )}
    </div>
  );
}

function ReviewsTab({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <motion.div
        variants={tabContentVariants}
        className="py-10 text-center text-sm text-stone-400"
      >
        No reviews yet. Be the first.
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review, i) => (
        <motion.article
          key={review.id}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.12 }}
          className="rounded-xl border border-stone-100 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-none text-stone-200 dark:text-stone-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-stone-400">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200">{review.body}</p>
          {review.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {review.helpfulVotes > 0 && (
            <p className="mt-2 text-[11px] text-stone-400">{review.helpfulVotes} found this helpful</p>
          )}
        </motion.article>
      ))}
    </div>
  );
}

function NotesTab({ bookTitle }: { bookTitle: string }) {
  const demoNotes = [
    {
      id: "n1",
      quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
      note: "This reframes the whole concept of self-improvement.",
      page: 27,
    },
    {
      id: "n2",
      quote: null,
      note: "The habit loop: cue → craving → response → reward. Everything maps onto this.",
      page: 44,
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-stone-400">
        Your highlights and notes for <em>{bookTitle}</em>
      </p>
      {demoNotes.map((note, i) => (
        <motion.div
          key={note.id}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-stone-100 bg-white p-4 dark:border-stone-800 dark:bg-stone-900"
        >
          {note.quote && (
            <blockquote className="mb-2 border-l-2 border-amber-300 pl-3 text-sm italic text-stone-600 dark:text-stone-400">
              {note.quote}
            </blockquote>
          )}
          <p className="text-sm text-stone-700 dark:text-stone-200">{note.note}</p>
          {note.page && (
            <p className="mt-1.5 text-[11px] text-stone-400">Page {note.page}</p>
          )}
        </motion.div>
      ))}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="mt-1 inline-flex items-center gap-2 rounded-lg border border-dashed border-stone-300 px-4 py-2 text-sm text-stone-500 hover:border-stone-400 dark:border-stone-700 dark:text-stone-400"
      >
        <StickyNote className="h-3.5 w-3.5" />
        Add a note
      </motion.button>
    </div>
  );
}

function SimilarTab({ similar }: { similar: BookRecommendation[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {similar.map((item, i) => (
        <motion.div
          key={item.book.id}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <BookCard book={item.book} reason={item.reason} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BookDetailClient({ book, reviews, similar }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [userRating, setUserRating] = useState(0);

  const coverSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: coverSectionRef,
    offset: ["start start", "end start"],
  });
  const coverY = useTransform(scrollYProgress, [0, 1], [0, -28]);

  return (
    <section className="space-y-6">
      {/* ── Hero: cover + info ── */}
      <div
        ref={coverSectionRef}
        className="glass-card grid gap-6 rounded-2xl border border-stone-200/80 bg-white/90 p-6 dark:border-stone-800 dark:bg-stone-900/80 sm:grid-cols-[200px_1fr]"
      >
        {/* Animated cover with parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: coverY }}
          className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-xl"
        >
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, 200px"
            className="object-cover"
            priority
          />
          {/* Subtle inner-shadow overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
        </motion.div>

        {/* Book info */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
          className="space-y-4"
        >
          <div>
            <h1 className="display-title text-3xl font-bold text-stone-900 dark:text-stone-100">
              {book.title}
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{book.author}</p>
            <div className="mt-2 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= Math.round(book.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-none text-stone-200 dark:text-stone-700"
                  }`}
                />
              ))}
              <span className="ml-1 text-xs text-stone-500">{book.rating.toFixed(1)}</span>
            </div>
          </div>

          <ExpandableDescription text={book.description} />

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <AddToShelfButton />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="secondary-btn inline-flex items-center gap-2 rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Share
            </motion.button>
          </div>

          {/* User star rating */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-stone-400 uppercase tracking-wide">Your rating</p>
            <StarRating value={userRating} onChange={setUserRating} />
          </div>
        </motion.div>
      </div>

      {/* ── Tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
        className="glass-card overflow-hidden rounded-2xl border border-stone-200/80 bg-white/90 dark:border-stone-800 dark:bg-stone-900/80"
      >
        {/* Tab bar */}
        <div className="flex border-b border-stone-100 dark:border-stone-800">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative flex-1 px-4 py-3.5 text-sm font-medium transition-colors duration-150 ${
                activeTab === key
                  ? "text-stone-900 dark:text-stone-100"
                  : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
              }`}
            >
              {activeTab === key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeTab === "details" && <DetailsTab book={book} />}
              {activeTab === "reviews" && <ReviewsTab reviews={reviews} />}
              {activeTab === "notes" && <NotesTab bookTitle={book.title} />}
              {activeTab === "similar" && <SimilarTab similar={similar} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
