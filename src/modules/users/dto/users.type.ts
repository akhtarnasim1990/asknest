// user.type.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class AnswerType {
  @Field(() => ID)
  questionId: string;

  @Field()
  correctOption: string;

  @Field()
  answerMarked: string;
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [AnswerType], { nullable: true })
  answers?: AnswerType[];
}

@ObjectType()
export class UserAnswerWithLocalTime {
  @Field(() => ID)
  questionId: string;

  @Field()
  correctOption: string;

  @Field()
  answerMarked: string;

  @Field()
  submittedAtUTC: Date;

  @Field()
  submittedAtLocal: string;
}

