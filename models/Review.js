const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please provide rating.'],
        },
        title: {
            type: String,
            trim: true,
            required: [true, 'Please provide title.'],
            maxlength: 100,
        },
        comment: {
            type: String,
            required: [true, 'Please provide comment.'],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true,
        },    
    },
    {timestamps: true}
);

// user can leave 1 review per product (set via compound index from mongoose)
ReviewSchema.index({user:1, product:1}, {unique: true});

// 'statics' called on model vs 'method' called on instance
ReviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        {$match: {product: productId}},
        {
            $group: {
                _id: null,
                averageRating: {$avg: "$rating"},
                numOfReviews: {$sum: 1},
            },
        },
    ]);
    
    try {
        await this.model('Product').findOneAndUpdate({_id: productId}, {
            averageRating: Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.numOfReviews || 0,
        })
    } catch(error) {
        console.log(error)
    }
};

ReviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('remove', async function() {
    await this.constructor.calculateAverageRating(this.product);
});


module.exports = mongoose.model('Review', ReviewSchema);