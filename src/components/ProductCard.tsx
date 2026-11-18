import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { Product, Comment } from '../types';
import { formatINR } from '../data/products';
import { MessageSquare, Eye, ShoppingCart, Star, Send, Heart, Trash2, LogIn, ImageOff } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  comments: Comment[];
  user: User | null;
  isAdmin: boolean;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onBook: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddComment: (productId: string, name: string, comment: string, rating: number) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onRequestAuth: (hint: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  comments,
  user,
  isAdmin,
  isWishlisted,
  onToggleWishlist,
  onBook,
  onQuickView,
  onAddComment,
  onDeleteComment,
  onRequestAuth
}) => {
  const [showReviews, setShowReviews] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (user?.displayName && !name) {
      setName(user.displayName);
    }
  }, [user, name]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequestAuth('Sign in with Google to post a verified customer review.');
      return;
    }
    const finalName = name.trim() || user.displayName || 'Verified Buyer';
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddComment(product.id, finalName, commentText.trim(), rating);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-[#ead8c3] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Product Image Box */}
      <div className="relative aspect-[4/3] w-full bg-[#f7f1e8] overflow-hidden group flex items-center justify-center p-2">
        {imgError ? (
          <div className="flex flex-col items-center justify-center text-center p-4 text-[#8c5835] gap-2">
            <ImageOff className="w-8 h-8 opacity-60" />
            <span className="text-xs font-semibold">{product.name}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-300 rounded-lg"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute top-3 left-3 bg-[#fbf6ef]/95 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider text-[#3c543f] uppercase border border-[#dfcbb5]">
          {product.category}
        </div>
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full border shadow-sm transition-colors ${
            isWishlisted
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-white/90 border-[#dfcbb5] text-[#6d6259] hover:text-red-600'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
        </button>
        <button
          onClick={() => onQuickView(product)}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-[#2e2118] p-2 rounded-lg shadow-sm border border-[#dfcbb5] opacity-90 hover:opacity-100 transition-all text-xs font-medium flex items-center gap-1.5"
          title="Quick view full specs and details"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs text-[#8c5835] font-medium">
            {product.woodType}
          </div>
          <h3 className="text-lg font-bold text-[#2e2118] mt-1 hover:text-[#6b3f25] transition-colors cursor-pointer" onClick={() => onQuickView(product)}>
            {product.name}
          </h3>
          <div className="mt-2 text-xl font-bold font-serif text-[#6b3f25] tabular-nums">
            {formatINR(product.price)}
          </div>
          <p className="mt-2 text-xs sm:text-sm text-[#6d6259] line-clamp-2 leading-relaxed">
            {product.desc}
          </p>

          <div className="mt-3 text-xs text-[#82746a] flex items-center gap-1.5">
            <span className="font-medium text-[#4a3424]">Karigar:</span>
            <span>{product.artisan}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-[#f4ecdf] space-y-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBook(product)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#6b3f25] text-white text-xs sm:text-sm font-semibold hover:bg-[#55301a] transition-colors shadow-xs active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Book for Delivery</span>
            </button>
            <button
              onClick={() => setShowReviews(!showReviews)}
              className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showReviews
                  ? 'bg-[#f4ecdf] border-[#c8b29c] text-[#2e2118]'
                  : 'bg-white border-[#dfcbb5] text-[#5b3820] hover:bg-[#faf5ef]'
              }`}
              title="Show customer comments and feedback"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{comments.length}</span>
            </button>
          </div>

          {/* Expandable Comments Drawer inside Card */}
          {showReviews && (
            <div className="mt-3 pt-3 border-t border-[#ead8c3] bg-[#faf5ef] -mx-5 -mb-5 p-4 rounded-b-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5b3820]">
                  Reviews & Feedback ({comments.length})
                </span>
                <span className="text-[11px] text-[#82746a]">Saharanpur Verified</span>
              </div>

              {/* Review list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-xs text-[#82746a] italic py-2">
                    No customer comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  comments.map((c) => {
                    const canDelete =
                      onDeleteComment &&
                      c.userId &&
                      user &&
                      (c.userId === user.uid || isAdmin);
                    return (
                      <div key={c.id} className="bg-white p-2.5 rounded-lg border border-[#eee2d7] text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-[#3b2112] truncate">{c.customer_name}</strong>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex text-amber-500">
                              {Array.from({ length: c.rating || 5 }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => onDeleteComment(c.id)}
                                className="text-[#9a8c80] hover:text-red-600 p-0.5"
                                title="Delete review"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-[#5c5249]">{c.comment}</p>
                        <span className="text-[10px] text-[#9a8c80] block mt-1">
                          {new Date(c.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Comment Form or Sign-In Prompt */}
              {user ? (
                <form onSubmit={handleSubmitComment} className="mt-3 space-y-2 pt-2 border-t border-[#ead8c3]">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={60}
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#dfcbb5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b3f25]"
                    />
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="px-2 py-1.5 text-xs bg-white border border-[#dfcbb5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b3f25]"
                    >
                      <option value={5}>5 Stars ★</option>
                      <option value={4}>4 Stars ★</option>
                      <option value={3}>3 Stars ★</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Share feedback on carving, finish, or delivery..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    maxLength={500}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#dfcbb5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#6b3f25]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-[#3c543f] text-white text-xs font-semibold hover:bg-[#2b3c2d] disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSubmitting ? 'Posting…' : 'Post Verified Review'}</span>
                  </button>
                </form>
              ) : (
                <div className="mt-3 pt-2 border-t border-[#ead8c3]">
                  <button
                    type="button"
                    onClick={() => onRequestAuth('Sign in with Google to leave a verified product review.')}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-[#2e2118] text-white text-xs font-semibold hover:bg-[#422e21] transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign in to Post Verified Review</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
