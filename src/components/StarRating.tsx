import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showCount = false,
  count = 0
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center space-x-1" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all duration-200 outline-none border-none bg-transparent p-0 ${
              readonly ? '' : 'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded'
            }`}
          >
            <Star
              className={`${sizeClasses[size]} transition-all duration-200 ${
                star <= displayRating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-400 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-gray-400 ml-2">
          ({count} {count === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
};