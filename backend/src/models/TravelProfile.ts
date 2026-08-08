import mongoose, { Schema, Document } from 'mongoose';

export interface ITravelProfile extends Document {
  userId: string;
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  budget: number;
  styles: string[];
  companionType: string;
  isFirstTrip: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const travelProfileSchema = new Schema<ITravelProfile>(
  {
    userId: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    styles: {
      type: [String],
      default: [],
    },
    companionType: {
      type: String,
      required: true,
    },
    isFirstTrip: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TravelProfile = mongoose.model<ITravelProfile>(
  'TravelProfile',
  travelProfileSchema
);
