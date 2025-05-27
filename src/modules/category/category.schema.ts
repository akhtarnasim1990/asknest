import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, trim: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @Prop({ required: false, trim: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
