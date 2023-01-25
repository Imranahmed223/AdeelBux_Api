const mongoDuplicateKeyError = (schema)=>{
    schema.post('save', function(error, doc, next) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
          const dupField = Object.keys(error.keyValue)[0];
          next(new Error(`Duplicate field(${dupField}). Already Exists (${error.keyValue[dupField]})`));
        } else {
          next(error);
        }
      });
}


module.exports = mongoDuplicateKeyError