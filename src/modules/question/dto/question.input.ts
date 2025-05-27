import { InputType, Field, ID } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';

@InputType()
export class CreateQuestionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  options: string[];

  @Field()
  @IsNotEmpty()
  @IsString()
  correctOption: string;

  @Field(() => [ID])
  @IsArray()
  @IsMongoId({ each: true })
  categories: string[];
}

@InputType()
export class UpdateQuestionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsString({ each: true })
  options?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  correctOption?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categories?: string[];
}

@InputType()
export class BulkQuestionImportDto {
  @Field()
  content: string;

  @Field(() => [String])
  @IsArray()
  options: string[];

  @Field()
  @IsString()
  correctOption: string;

  @Field(() => [String])
  @IsArray()
  categories: string[];
}
