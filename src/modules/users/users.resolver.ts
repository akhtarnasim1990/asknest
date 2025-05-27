import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './users.service';
import { UserAnswerWithLocalTime, UserType } from './dto/users.type';
import { CreateUserInput, SubmitAnswerInput, UpdateUserInput } from './dto/users.input';
import { Public } from 'src/constants/constants';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType])
  async users() {
    return this.userService.findAll();
  }

  @Query(() => UserType)
  async user(@Args('email', { type: () => String }) email: string) {
    return this.userService.findByEmail(email);
  }

  @Public()
  @Mutation(() => UserType)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update(id, updateUserInput);
  }

  @Mutation(() => UserType)
  async removeUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.remove(id);
  }

  @Mutation(() => UserType)
  async submitAnswer(
    @Args('input') input: SubmitAnswerInput,
    @Args('userId', { type: () => ID }) userId: string, // Or get from auth context
  ) {
    return this.userService.submitAnswer(userId, input);
  }

  @Query(() => UserAnswerWithLocalTime)
  async userAnswerByQuestion(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('questionId', { type: () => ID }) questionId: string,
    @Args('timezone') timezone: string, // e.g. "Asia/Kolkata"
  ) {
    return this.userService.findAnswerByQuestion(userId, questionId, timezone);
  }
}
