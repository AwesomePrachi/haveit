import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        address_line: {
            type: String,
            default: ""
        },
        area: {
            type: String,
            default: ""
        },
        landmark: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        pincode: {
            type: String
        },
        country: {
            type: String
        },
        contact: {
            type: Number,
            default: null
        },
        status: {
            type: Boolean,
            default: true
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

export const Address = mongoose.model("Address", addressSchema)