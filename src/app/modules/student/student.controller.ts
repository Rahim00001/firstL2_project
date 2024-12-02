import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import { z } from "zod";
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    // creating a svhema validation using zod
    

    const { student: studentData } = req.body;

    // data validation using zod
    const zodParseData = studentValidationSchema.parse(studentData);

    // will call service func to send this data
    const result = await StudentServices.createStudentIntoDB(zodParseData);
    // send response
    res.status(200).json({
      success: true,
      message: 'Student is creted successfully',
      data: result,
    });
  }catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Somthing went wrong',
      error: err,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentFromDB();

    res.status(200).json({
      success: true,
      message: 'Student recived successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Student recived successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
