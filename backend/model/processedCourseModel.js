const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    children: [
        {
            type: mongoose.Schema.Types.Mixed,
            ref: 'PreprocessedCourse'
        }
    ]
}, { _id: false});

const preprocessedCourseSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    children: [childSchema]
}, {collection: 'preprocessed_courses'});

const PreprocessedCourse = mongoose.model('PreprocessedCourse', preprocessedCourseSchema);
module.exports = PreprocessedCourse;