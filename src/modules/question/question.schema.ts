import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true, trim: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @Prop({ type: [String], required: true })
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  options: string[];

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  correctOption: string;

  @Prop({ type: [Types.ObjectId], ref: 'Category', required: true })
  @IsArray()
  @IsMongoId({ each: true })
  categories: Types.ObjectId[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
