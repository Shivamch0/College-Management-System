import mongoose from "mongoose";

const eventStatsSchema = new mongoose.Schema({
    month: { 
        type: String,
         required: true 
        }, 
    year: { 
        type: Number,
         required: true
        },
    count: { 
        type: Number,
         default: 0 
        },
});

eventStatsSchema.index({ month: 1, year: 1 }, { unique: true });

export const EventStats = mongoose.model("EventStats" , eventStatsSchema)