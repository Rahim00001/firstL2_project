import { z } from "zod";

// UserName Schema
const userNameValidationSchema = z.object({
    firstName: z
      .string()
      .min(1,"First name must be given")
      .trim()
      .max(20, "First name cannot be more than 20 characters")
      .refine(
        (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
        { message: "First name is not in capitalize format. Exp: 'Kamrul'" }
      ),
    middleName: z.string().trim().optional(),
    lastName: z
      .string()
      .min(1,"Last name must be given")
      .trim()
      .refine((value) => /^[A-Za-z]+$/.test(value), {
        message: "Last name must contain only alphabets",
      }),
  });
  
  // Guardian Schema
  const guardianValidationSchema = z.object({
    fatherName: z.string().min(1,"Father name must be given").trim(),
    fatherOccupation: z.string().min(1,"Father occupation must be given").trim(),
    fatherContactNo: z.string().min(1,"Father contact number must be given").trim(),
    motherName: z.string().min(1,"Mother name must be given").trim(),
    motherOccupation: z.string().min(1,"Mother occupation must be given").trim(),
    motherContactNo: z.string().min(1,"Mother contact number must be given").trim(),
  });
  
  // Local Guardian Schema
  const localGuardianValidationSchema = z.object({
    name: z.string().min(1,"Local Guardian name must be given").trim(),
    occupation: z.string().min(1,"Local Guardian occupation must be given").trim(),
    contactNo: z.string().min(1,"Local Guardian contact number must be given").trim(),
    address: z.string().min(1,"Local Guardian address must be given").trim(),
  });
  
  // Main Student Schema
  const studentValidationSchema = z.object({
    id: z.string().min(1,"Student ID is required"),
    name: userNameValidationSchema,
    gender: z.enum(["male", "female"], { errorMap: () => ({ message: "Invalid gender" }) }),
    dateOfBirth: z.string().optional(),
    email: z
      .string()
      .min(1,"Email is required")
      .email("Invalid email address")
      .trim(),
    contactNo: z.string().min(1,"Contact number is required").trim(),
    emergencyContactNo: z.string().min(1,"Emergency contact number is required").trim(),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        errorMap: () => ({ message: "Invalid blood group" }),
      })
      .optional(),
    presentAddress: z.string().min(1,"Present address is required").trim(),
    permanentAddress: z.string().min(1,"Permanent address is required").trim(),
    guardian: guardianValidationSchema,
    localGuardian: localGuardianValidationSchema,
    profileImg: z.string().trim().optional(),
    isActive: z.enum(["active", "blocked"]).default("active"),
  });

  export default studentValidationSchema;