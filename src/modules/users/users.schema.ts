import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Schema()
export class Answer {
  @Prop({ type: Types.ObjectId })
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @Prop({ type: String })
  @IsNotEmpty()
  @IsString()
  correctOption: string;

  @Prop({ type: String })
  @IsNotEmpty()
  @IsString()
  answerMarked: string;

  @Prop({ type: Date, required: true, default: () => new Date() })
  submittedAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema({ collection: 'users', timestamps: true})
export class User extends Document {
  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  @IsEmail()
  email: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Prop({ type: [AnswerSchema], default: [] })
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answers: Answer[];
}

export const UserSchema = SchemaFactory.createForClass(User);
