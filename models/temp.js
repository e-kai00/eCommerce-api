[
    {
      '$match': {
        'product': new ObjectId('6552446f616d7518588ab90c')
      }
    }, {
      '$group': {
        '_id': null, 
        'averageRating': {
          '$avg': '$rating'
        }, 
        'numOfReviews': {
          '$sum': 1
        }
      }
    }
  ]