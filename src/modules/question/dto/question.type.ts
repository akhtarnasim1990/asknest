import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class QuestionType {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => [String])
  options: string[];

  @Field()
  correctOption: string;

  @Field(() => [ID])
  categories: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ImportResult {
  @Field()
  success: number;

  @Field(() => [String])
  errors: string[];
}
