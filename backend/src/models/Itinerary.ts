import mongoose, { Schema, Document } from 'mongoose';

interface AvailableHours {
  start: number;
  end: number;
}

interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  duration: number;
  cost: number;
  reason: string;
}

interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  availableHours: AvailableHours;
  items: ItineraryItem[];
  totalCost: number;
  note: string;
}

export interface IItinerary extends Document {
  userId: string;
  tripId: string;
  city: string;
  days: ItineraryDay[];
  totalCost: number;
  budgetRemaining: number;
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const availableHoursSchema = new Schema(
  {
    start: Number,
    end: Number,
  },
  { _id: false }
);

const itineraryItemSchema = new Schema(
  {
    time: String,
    title: String,
    description: String,
    duration: Number,
    cost: Number,
    reason: String,
  },
  { _id: false }
);

const itineraryDaySchema = new Schema(
  {
    day: Number,
    date: String,
    title: String,
    availableHours: availableHoursSchema,
    items: [itineraryItemSchema],
    totalCost: Number,
    note: String,
  },
  { _id: false }
);

const itinerarySchema = new Schema<IItinerary>(
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
    days: [itineraryDaySchema],
    totalCost: {
      type: Number,
      default: 0,
    },
    budgetRemaining: {
      type: Number,
      default: 0,
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Itinerary = mongoose.model<IItinerary>(
  'Itinerary',
  itinerarySchema
);
