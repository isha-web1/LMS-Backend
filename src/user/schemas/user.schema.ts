import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../user.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true, // Explicitly state it's required
    enum: Object.values(Role), // Best practice for role fields
    default: Role.Student, // Assign the default value
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
