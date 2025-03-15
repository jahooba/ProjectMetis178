const fs = require("fs");
require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const Course = 

use.load().then(async model => {
   const sampleCourse = Course[0];
   const embeddings = await model.embed(sampleCourse['PREREQS']);
   console.log(embeddings.arraySync());
});