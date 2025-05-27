import { InputType, Field, ID } from '@nestjs/graphql';import {
    IsNotEmpty,
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
  } from 'class-validator';

@InputType()
export class AnswerInput {
  @Field(() => ID)
  questionId: string;

  @Field()
  correctOption: string;

  @Field()
  answerMarked: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name must be at most 50 characters' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must be at most 128 characters' })
  @Matches(/^(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/^(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/^(?=.*[@$!%*?&])/, {
    message: 'Password must contain at least one special character (@$!%*?&)',
  })
  password: string;
}


@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => [AnswerInput], { nullable: true })
  answers?: AnswerInput[];
}

@InputType()
export class SubmitAnswerInput {
  @Field(() => ID)
  questionId: string;

  @Field()
  answerMarked: string;
}
