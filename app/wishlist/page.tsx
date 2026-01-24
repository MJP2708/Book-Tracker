"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingCart, Heart, ArrowLeft, ExternalLink, Search, X, Check, Share2, Copy, Download, Flame, DollarSign, Package, Zap, Gift, TrendingDown } from "lucide-react";

interface WishlistBook {
  id: string;
  title: string;
  author: string;
  price?: string;
  coverImage?: string;
  dateAdded: string;
  priority: "must-buy" | "nice-to-have" | "someday";
  targetPrice?: number;
  currentPrice?: number;
  priceDropAlert?: boolean;
  stores: {
    amazon?: string;
    googleBooks?: string;
    local?: string;
    shopee?: string;
    lazada?: string;
  };
  availability: "in-stock" | "out-of-stock" | "unknown";
  format: "physical" | "digital" | "both";
  whyWant: string;
  category: "work" | "study" | "leisure" | "gift";
  giftMode?: {
    isGift: boolean;
    from?: string;
    for?: string;
  };
}


export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistBook[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] = useState<"must-buy" | "nice-to-have" | "someday">("nice-to-have");
  const [category, setCategory] = useState<"work" | "study" | "leisure" | "gift">("leisure");
  const [whyWant, setWhyWant] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceBooks, setMarketplaceBooks] = useState<WishlistBook[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState<WishlistBook | null>(null);
  const [shareLink, setShareLink] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "date" | "price">("priority");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showMoveBought, setShowMoveBought] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = () => {
    if (!title.trim()) return;
    setWishlist([
      ...wishlist,
      {
        id: Math.random().toString(),
        title,
        author,
        price,
        dateAdded: new Date().toLocaleDateString(),
        priority,
        category,
        whyWant,
        stores: {},
        availability: "unknown",
        format: "both",
      },
    ]);
    setTitle("");
    setAuthor("");
    setPrice("");
    setWhyWant("");
    setPriority("nice-to-have");
    setCategory("leisure");
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((b) => b.id !== id));
  };

  const updateBook = (id: string, updates: Partial<WishlistBook>) => {
    setWishlist(wishlist.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const moveToBought = (id: string) => {
    const book = wishlist.find((b) => b.id === id);
    if (!book) return;

    // Get library books and add to unread
    const libraryBooks = JSON.parse(localStorage.getItem("books") || "[]");
    libraryBooks.push({
      id: Math.random().toString(),
      title: book.title,
      status: "Unread",
      coverImage: book.coverImage,
      notes: book.whyWant,
      tags: [book.category],
      rating: 0,
      review: "",
      dateAdded: new Date().toISOString().split("T")[0],
      totalPages: 0,
      pagesRead: 0,
      progress: 0,
    });
    localStorage.setItem("books", JSON.stringify(libraryBooks));

    // Remove from wishlist
    removeFromWishlist(id);
    setShowMoveBought(null);
  };

  const searchMarketplace = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=8&orderBy=relevance`
      );
      const data = await response.json();

      if (data.items) {
        const books: WishlistBook[] = data.items
          .filter((item: any) => item.volumeInfo?.title)
          .map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.[0] || "Unknown Author",
            price: item.saleInfo?.listPrice?.amount ? `$${item.saleInfo.listPrice.amount}` : "N/A",
            coverImage: item.volumeInfo.imageLinks?.thumbnail?.replace(/^http:/, "https:"),
            dateAdded: new Date().toLocaleDateString(),
            priority: "nice-to-have" as const,
            category: "leisure" as const,
            whyWant: "",
            stores: { googleBooks: `https://books.google.com/books?id=${item.id}` },
            availability: "unknown" as const,
            format: "both" as const,
          }));
        setMarketplaceBooks(books);
      }
    } catch (error) {
      console.error("Error searching marketplace:", error);
    }
  };

  const buyOnStore = (url: string) => {
    window.open(url, "_blank");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addToWishlist();
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchMarketplace();
      setShowSearch(true);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "must-buy":
        return "🔥";
      case "nice-to-have":
        return "💖";
      case "someday":
        return "🤍";
      default:
        return "💖";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "must-buy":
        return "from-red-500/10 to-red-500/5";
      case "nice-to-have":
        return "from-pink-500/10 to-pink-500/5";
      case "someday":
        return "from-slate-500/10 to-slate-500/5";
      default:
        return "from-pink-500/10 to-pink-500/5";
    }
  };

  const sortedWishlist = [...wishlist]
    .filter((b) => filterCategory === "all" || b.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { "must-buy": 0, "nice-to-have": 1, someday: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      }
      if (sortBy === "date") {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      if (sortBy === "price" && a.currentPrice && b.currentPrice) {
        return a.currentPrice - b.currentPrice;
      }
      return 0;
    });

  // Calculate stats
  const totalValue = wishlist.reduce((sum, b) => {
    const p = b.currentPrice || parseFloat(b.price?.replace("$", "") || "0");
    return sum + (isNaN(p) ? 0 : p);
  }, 0);

  const avgPrice = wishlist.length > 0 ? (totalValue / wishlist.length).toFixed(2) : "0";

  const categoryStats = wishlist.reduce(
    (acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const mostWantedCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];

  const exportWishlist = () => {
    const json = JSON.stringify(wishlist, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wishlist.json";
    a.click();
  };

  const shareableWishlist = () => {
    const link = `${window.location.origin}?wishlist=${btoa(JSON.stringify(wishlist))}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Library
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 dark:from-purple-400 dark:via-pink-300 dark:to-purple-500 bg-clip-text text-transparent">
              📚 Book Wishlist
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Find and track books you want to buy
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportWishlist}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Export wishlist"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-300" />
            </button>
            <button
              onClick={shareableWishlist}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Share wishlist"
            >
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
              Total Books
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {wishlist.length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
              Total Value
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ${totalValue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
              Avg Price
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              ${avgPrice}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
              Most Wanted
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {mostWantedCategory ? mostWantedCategory[0] : "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Left Column: Add & Search */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add to Wishlist */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Add to Wishlist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Input
                  placeholder="Book title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-9"
                />
                <Input
                  placeholder="Author (optional)..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-9"
                />
                <Input
                  placeholder="Price (optional)..."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-9"
                />
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                  >
                    <option value="must-buy">🔥 Must Buy</option>
                    <option value="nice-to-have">💖 Nice to Have</option>
                    <option value="someday">🤍 Someday</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                  >
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="leisure">Leisure</option>
                    <option value="gift">🎁 Gift</option>
                  </select>
                </div>
                <Input
                  placeholder="Why do you want this? (optional)..."
                  value={whyWant}
                  onChange={(e) => setWhyWant(e.target.value)}
                  className="h-9"
                />
                <Button
                  onClick={addToWishlist}
                  className="w-full font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-9"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Wishlist
                </Button>
              </CardContent>
            </Card>

            {/* Sort & Filter */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Filter & Sort</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                  >
                    <option value="priority">Priority</option>
                    <option value="date">Date Added</option>
                    <option value="price">Price</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="leisure">Leisure</option>
                    <option value="gift">Gift</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Wishlist Count */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl px-4 sm:px-6 py-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {wishlist.length}
                </span>{" "}
                book{wishlist.length !== 1 ? "s" : ""} in your wishlist
              </p>
            </div>
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Marketplace */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="flex-1 h-10"
                  />
                  <Button
                    onClick={() => {
                      searchMarketplace();
                      setShowSearch(true);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {showSearch && marketplaceBooks.length > 0 && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Search Results ({marketplaceBooks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {marketplaceBooks.map((book) => (
                      <div
                        key={book.id}
                        className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all"
                      >
                        {book.coverImage && (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                          {book.author}
                        </p>
                        <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-2">
                          {book.price}
                        </p>
                        <div className="flex gap-2 mt-3">
                          {book.stores.googleBooks && (
                            <Button
                              onClick={() => buyOnStore(book.stores.googleBooks!)}
                              size="sm"
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          )}
                          <Button
                            onClick={() => {
                              setWishlist([...wishlist, book]);
                              setMarketplaceBooks(marketplaceBooks.filter((b) => b.id !== book.id));
                            }}
                            size="sm"
                            className="bg-pink-500 hover:bg-pink-600 text-white text-xs h-8"
                          >
                            <Heart className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wishlist Items */}
            {sortedWishlist.length > 0 && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Your Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedWishlist.map((book) => (
                      <div
                        key={book.id}
                        className={`flex gap-3 sm:gap-4 p-4 rounded-xl border transition-all cursor-pointer group hover:shadow-lg bg-gradient-to-br ${getPriorityColor(book.priority)} border-slate-200 dark:border-slate-600`}
                        onClick={() => setSelectedBook(book)}
                      >
                        {book.coverImage && (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2">
                                  {book.title}
                                </p>
                                <span className="text-lg flex-shrink-0">
                                  {getPriorityIcon(book.priority)}
                                </span>
                              </div>
                              {book.author && (
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                                  by {book.author}
                                </p>
                              )}
                            </div>
                            {book.priceDropAlert && (
                              <div className="flex-shrink-0 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold">
                                <TrendingDown className="w-3 h-3 inline mr-1" />
                                Price dropped!
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {book.price && (
                              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                <DollarSign className="w-3 h-3 inline mr-1" />
                                {book.price}
                              </span>
                            )}
                            <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                              {book.category}
                            </span>
                            {book.availability === "in-stock" && (
                              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                                🟢 In Stock
                              </span>
                            )}
                            {book.availability === "out-of-stock" && (
                              <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                                🔴 Out of Stock
                              </span>
                            )}
                          </div>

                          {book.whyWant && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">
                              💭 {book.whyWant}
                            </p>
                          )}

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            Added: {book.dateAdded}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowMoveBought(book.id);
                              }}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white text-xs h-8"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              I Bought This
                            </Button>
                            {book.stores.googleBooks && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  buyOnStore(book.stores.googleBooks!);
                                }}
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-8"
                              >
                                Google Books
                              </Button>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(book.id);
                          }}
                          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {wishlist.length === 0 && !showSearch && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="py-16 text-center">
                  <Heart className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                    Your wishlist is empty
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
                    Add books manually or search the marketplace to get started!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Share Modal */}
        {shareLink && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShareLink("")}
          >
            <div
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShareLink("")}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4">Share Your Wishlist</h2>
              <div className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Share this link to let friends see your wishlist:
                </p>
                <div className="flex gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-300 outline-none"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(shareLink)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Book Details Modal */}
        {selectedBook && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBook(null)}
          >
            <div
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg z-10 bg-white dark:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {selectedBook.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    by {selectedBook.author}
                  </p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Priority
                    </label>
                    <select
                      value={selectedBook.priority}
                      onChange={(e) =>
                        updateBook(selectedBook.id, {
                          priority: e.target.value as any,
                        })
                      }
                      className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm mt-1"
                    >
                      <option value="must-buy">🔥 Must Buy</option>
                      <option value="nice-to-have">💖 Nice to Have</option>
                      <option value="someday">🤍 Someday</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      value={selectedBook.category}
                      onChange={(e) =>
                        updateBook(selectedBook.id, {
                          category: e.target.value as any,
                        })
                      }
                      className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm mt-1"
                    >
                      <option value="work">Work</option>
                      <option value="study">Study</option>
                      <option value="leisure">Leisure</option>
                      <option value="gift">🎁 Gift</option>
                    </select>
                  </div>
                </div>

                {/* Price Tracking */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    <DollarSign className="w-4 h-4 inline mr-2 text-blue-500" />
                    Price Tracking
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Current Price
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={selectedBook.currentPrice || ""}
                        onChange={(e) =>
                          updateBook(selectedBook.id, {
                            currentPrice: parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="e.g. 15.99"
                        className="h-9 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Target Price
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={selectedBook.targetPrice || ""}
                        onChange={(e) =>
                          updateBook(selectedBook.id, {
                            targetPrice: parseFloat(e.target.value) || undefined,
                          })
                        }
                        placeholder="e.g. 9.99"
                        className="h-9 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      checked={selectedBook.priceDropAlert || false}
                      onChange={(e) =>
                        updateBook(selectedBook.id, {
                          priceDropAlert: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Get notified when price drops
                    </span>
                  </label>
                </div>

                {/* Availability */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    <Package className="w-4 h-4 inline mr-2 text-purple-500" />
                    Availability
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Stock Status
                      </label>
                      <select
                        value={selectedBook.availability}
                        onChange={(e) =>
                          updateBook(selectedBook.id, {
                            availability: e.target.value as any,
                          })
                        }
                        className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm mt-1"
                      >
                        <option value="unknown">Unknown</option>
                        <option value="in-stock">🟢 In Stock</option>
                        <option value="out-of-stock">🔴 Out of Stock</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Format
                      </label>
                      <select
                        value={selectedBook.format}
                        onChange={(e) =>
                          updateBook(selectedBook.id, {
                            format: e.target.value as any,
                          })
                        }
                        className="w-full h-9 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm mt-1"
                      >
                        <option value="physical">Physical</option>
                        <option value="digital">Digital</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Why I Want This */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    💭 Why I Want This
                  </h3>
                  <textarea
                    value={selectedBook.whyWant}
                    onChange={(e) =>
                      updateBook(selectedBook.id, { whyWant: e.target.value })
                    }
                    placeholder="Recommended by a friend, for self-improvement, saw in a café..."
                    className="w-full h-24 p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
                  />
                </div>

                {/* Gift Mode */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    🎁 Gift Mode
                  </h3>
                  <label className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedBook.giftMode?.isGift || false}
                      onChange={(e) =>
                        updateBook(selectedBook.id, {
                          giftMode: {
                            isGift: e.target.checked,
                            from: selectedBook.giftMode?.from,
                            for: selectedBook.giftMode?.for,
                          },
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Mark as gift
                    </span>
                  </label>
                  {selectedBook.giftMode?.isGift && (
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Gift from..."
                        value={selectedBook.giftMode?.from || ""}
                        onChange={(e) =>
                          updateBook(selectedBook.id, {
                            giftMode: {
                              isGift: true,
                              from: e.target.value,
                              for: selectedBook.giftMode?.for,
                            },
                          })
                        }
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="Gift for..."
                        value={selectedBook.giftMode?.for || ""}
                        onChange={(e) =>
                          updateBook(selectedBook.id, {
                            giftMode: {
                              isGift: true,
                              from: selectedBook.giftMode?.from,
                              for: e.target.value,
                            },
                          })
                        }
                        className="h-9 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    onClick={() => setSelectedBook(null)}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowMoveBought(selectedBook.id);
                      setSelectedBook(null);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    I Bought This
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bought Confirmation Modal */}
        {showMoveBought && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMoveBought(null)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Congrats! 🎉
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Moving "{wishlist.find((b) => b.id === showMoveBought)?.title}" to your library in the Unread
                section.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => setShowMoveBought(null)}
                  className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => moveToBought(showMoveBought)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Yes, Move It
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
