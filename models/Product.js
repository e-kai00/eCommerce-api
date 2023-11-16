const mongoose = require('mongoose');
const Review = require('./Review');


const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Provide product name'],
            maxlength: [100, 'Product name cannot be longer than 100 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Provide product price'],
            default: 0,
        },
        description: {
            type: String,
            required: [true, 'Provide product description'],            
            maxlength: [1000, 'Product description cannot be longer than 1000 characters'],
        },
        image: {
            type: String,
            default: '/uploads/example.jpeg'
        },
        category: {
            type: String,
            required: [true, 'Provide product category'],        
            enum: ['office', 'kitchen', 'bedroom'],
        },
        company: {
            type: String,
            required: [true, 'Provide company'],
            enum: {
                values: ['ikea', 'liddy', 'marcos'],
                message: '{VALUE} is not supported.'
            },
        },
        colors: {
            type: [String],
            default: ['#222'],
            required: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        freeShipping: {
            type: Boolean,
            default: false,
        },
        inventory: {
            type: Number,
            required: true,
            default: 15,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}}   
);

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
    // to match specific data
    // match: {rating: 5}
});

ProductSchema.pre('remove', async function(next) {
    await this.model('Review').deleteMany({product: this._id});
})


module.exports = mongoose.model('Product', ProductSchema);