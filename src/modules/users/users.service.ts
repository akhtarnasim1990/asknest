import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './users.schema';
import { CreateUserInput, SubmitAnswerInput, UpdateUserInput } from './dto/users.input';
import * as bcrypt from 'bcrypt';
import { QuestionService } from '../question/question.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly questionService: QuestionService,
) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { password, ...rest } = createUserInput;

    const existingUser = await this.userModel.findOne({
      email: createUserInput.email,
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userToCreate = { ...rest, password: hashedPassword };
    const createdUser = new this.userModel(userToCreate);

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({email}).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserInput, { new: true })
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async submitAnswer(userId: string, input: SubmitAnswerInput) {
    const question = await this.questionService.findOne(input.questionId);
    if (!question) throw new NotFoundException('Question not found');

    const correctOption = question.correctOption;

    const answer = {
      questionId: new Types.ObjectId(input.questionId),
      correctOption,
      answerMarked: input.answerMarked,
      submittedAt: new Date(),
    };

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { answers: answer } },
      { new: true }
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAnswerByQuestion(
    userId: string,
    questionId: string,
    timezone: string,
  ) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException('User not found');

    const answer = user.answers.find(
      (ans) => ans.questionId.toString() === questionId,
    );
    if (!answer) throw new NotFoundException('Answer not found for this question');

    const submittedAtUTC = answer.submittedAt;
    const submittedAtLocal = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(submittedAtUTC));

    return {
      questionId: answer.questionId,
      correctOption: answer.correctOption,
      answerMarked: answer.answerMarked,
      submittedAtUTC,
      submittedAtLocal,
    };
  }
}
