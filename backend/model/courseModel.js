const mongoose = require('mongoose');



const nestedLogicSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['&&', '||'],
        required: true
    },
    courses: [{type: mongoose.Schema.Types.Mixed /* allows recursive nesting */}]
});

const singleCourseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.Mixed,
    prereqName: { type: String },
    concurrent: {
        type: Boolean,
        default: false
    }
}, {_id: false /* prevents new Mongo ids */});

const prereqSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['&&', '||'],
        required: true
    },
    courses: [
        singleCourseSchema,
        nestedLogicSchema
    ]
});

const courseSchema = new mongoose.Schema({
    courseID: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Z]{2,4} \d{3}[A-Z]?$/
    },
    title: {
        type: String,
        required: true,
        unique: false
    },
    units: {
        type: Number,
        min: 0,
        max: 12,
        default: 0
    },
    lectHrs: {
        type: Number,
        min: 0,
        max: 12,
        default: 0
    },
    labHrs: {
        type: Number,
        min: 0,
        max: 12,
        default: 0
    },
    discHrs: {
        type: Number,
        min: 0,
        max: 12,
        default: 0
    },
    studyHrs: {
        type: Number,
        min: 0,
        max: 12,
        default: 0
    },
    PREREQS: [prereqSchema],
    description: {
        type: String,
        required: true
    },
    flatPrereqs: [
        {
            type: mongoose.Schema.Types.Mixed,
            required: false,
            default: []
        }
    ]
}, {collection: 'courses'});

//courseSchema.index({courseID: 1});  // index for frequently searched field

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;