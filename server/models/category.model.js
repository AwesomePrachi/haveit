import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        image: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

export const Category = mongoose.model("Category", categorySchema)