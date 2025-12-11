import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  activeStyleProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnswerStyle'
  },
  examDates: [{
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    examDate: Date,
    examType: String // 'midterm', 'final', 'internal'
  }],
  timeAvailability: {
    hoursPerDay: Number,
    preferredStudyTimes: [String]
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);

