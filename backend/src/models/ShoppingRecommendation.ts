import mongoose, { Schema, Document } from 'mongoose';

interface Product {
  id: string;
  name: string;
  category: string;
  localPrice: number;
  koreanWonEstimate: number;
  localCurrency: string;
  storeName: string;
  taxFree: boolean;
  description: string;
  reason: string;
}

interface CategoryBudget {
  [key: string]: number;
}

export interface IShoppingRecommendation extends Document {
  userId: string;
  tripId: string;
  city: string;
  budget: number;
  recommendedProducts: Product[];
  categoryBudget: CategoryBudget;
  totalEstimatedKRW: number;
  budgetRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema(
  {
    id: String,
    name: String,
    category: String,
    localPrice: Number,
    koreanWonEstimate: Number,
    localCurrency: String,
    storeName: String,
    taxFree: Boolean,
    description: String,
    reason: String,
  },
  { _id: false }
);

const shoppingRecommendationSchema = new Schema<IShoppingRecommendation>(
  {
    userId: {
      type: String,
      required: true,
    },
    tripId: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    recommendedProducts: [productSchema],
    categoryBudget: {
      type: Schema.Types.Mixed,
      default: {},
    },
    totalEstimatedKRW: {
      type: Number,
      default: 0,
    },
    budgetRemaining: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ShoppingRecommendation = mongoose.model<IShoppingRecommendation>(
  'ShoppingRecommendation',
  shoppingRecommendationSchema
);
