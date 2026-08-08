import mongoose, { Schema, Document } from 'mongoose';

export interface IFlightInfo extends Document {
  userId: string;
  tripId: string;
  departureCountry: string;
  departureAirport: string;
  arrivalCountry: string;
  arrivalAirport: string;
  outboundDateTime: string;
  inboundDateTime: string;
  airline: string;
  flightNumber: string;
  terminal: string;
  ocrConfidence?: number;
  isUserVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const flightInfoSchema = new Schema<IFlightInfo>(
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
    departureCountry: {
      type: String,
      required: true,
    },
    departureAirport: {
      type: String,
      required: true,
    },
    arrivalCountry: {
      type: String,
      required: true,
    },
    arrivalAirport: {
      type: String,
      required: true,
    },
    outboundDateTime: {
      type: String,
      required: true,
    },
    inboundDateTime: {
      type: String,
      required: true,
    },
    airline: {
      type: String,
      required: true,
    },
    flightNumber: {
      type: String,
      required: true,
    },
    terminal: {
      type: String,
      default: '',
    },
    ocrConfidence: {
      type: Number,
      default: 0,
    },
    isUserVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const FlightInfo = mongoose.model<IFlightInfo>(
  'FlightInfo',
  flightInfoSchema
);
