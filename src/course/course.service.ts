import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}
  async create(createCourseDto: CreateCourseDto) {
    return await this.courseModel.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      level: createCourseDto.level,
      price: createCourseDto.price,
    });
  }

  async findAll(): Promise<Course[]> {
    // .find() without arguments returns all documents. .exec() executes the query.
    return this.courseModel.find().exec();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Mongoose update logic using findByIdAndUpdate
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(
        id, // Correctly receives and uses the string ID
        updateCourseDto,
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    return updatedCourse;
  }

  async remove(id: string): Promise<{ deleted: true; id: string }> {
    // findByIdAndDelete returns the deleted document, or null if not found
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

    if (!deletedCourse) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    // Return a confirmation object
    return { deleted: true, id };
  }
}
