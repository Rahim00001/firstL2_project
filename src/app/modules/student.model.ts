import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  // StudentMethodes,
  StudentModel,
  TUserName,
} from './student/student.interface';
import bcrypt from "bcrypt";
import config from '../config';


const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name must be given'],
    trim: true,
    maxlength: [20, 'First name can not be more than 20 characters'],
    validate: {
      validator: function(value: string){
        const firstNameStr = value.charAt(0).toUpperCase()+ value.slice(1);
        return firstNameStr === value;
      },
      message: "{VALUE} is not in capitalize format. Exp:'Kamrul'"
    }
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name must be given'],
    trim: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: "{VALUE} is not valid. Exp:'rahim'"
    }
  },
});
const gurdianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name must be given'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation must be given'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact number must be given'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'mother name must be given'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'mother occupation must be given'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'mother contact number must be given'],
    trim: true,
  },
});
const localGurdianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'local Guardian name must be given'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'local Guardian occupation must be given'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'local Guardian contact number must be given'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'local Guardian addresss must be given'],
    trim: true,
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: { type: String, required: [true, 'StudentId must be given'], unique: true },
  password: { type: String, required: [true, 'Password must be given'], unique: true, maxlength: [20, 'Password can not be more than 20 characters']},
  name: {
    type: userNameSchema,
    required: [true, 'Student name must be given'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not a valid gender'
    },
    required: [true, 'gender must be given'],
  },
  dathOfBirth: { type: String },
  email: { 
    type: String, 
    required: true, 
    trim: true, 
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "{VALUE} is not a valid email address."
    }
  },
  contactNo: { type: String, required: [true, 'Students contact number address must be given'], trim: true,},
  emergencyContactNo: { type: String, required: [true, 'Students emergency contact number address must be given'], trim: true,},
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood group'
    },
  },
  presentAddress: { type: String, required: [true, 'Students present address must be given'], trim: true, },
  permanentAddress: { type: String, required: [true, 'Students permanent address must be given'], trim: true, },
  guardian: {
    type: gurdianSchema,
    required: [true, 'Gurdian information must be given'],
  },
  localGuardian: {
    type: localGurdianSchema,
    required: [true, 'Students local gurdian information must be given'],
  },
  profileImg: { type: String, trim: true, },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
});


// prea save middleware/hook: will work on create(), save()
studentSchema.pre('save', async function(next){
  // console.log(this, 'pre hook: we will save data');
const user = this;
  // hashing password and save into db
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds))
  next();
});

// prea save middleware/hook
studentSchema.post('save', function(){
  console.log(this, 'post hook: we saved the data');
});


// creating a custom static method
studentSchema.statics.isUserExists = async function(id: string){
  const existingUser = await Student.findOne({id})
  return existingUser
}


// creating a custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({id});
//   return existingUser;
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
