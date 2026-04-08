import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  enrolledCourses: [{
    courseId:   { type: String },
    enrolledAt: { type: Date, default: Date.now },
    progress:   { type: Number, default: 0 },
    completed:  { type: Boolean, default: false },
  }],
  bookProgress: [{
    bookId:         { type: String },
    currentChapter: { type: Number, default: 0 },
    lastReadAt:     { type: Date, default: Date.now },
    completed:      { type: Boolean, default: false },
  }],
  refreshToken: { type: String, default: null },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

export default mongoose.model('User', userSchema);