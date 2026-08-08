import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  city: string;
  phraseIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phraseIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// userId + city 조합으로 유니크 인덱스
favoriteSchema.index({ userId: 1, city: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>(
  'Favorite',
  favoriteSchema
);
