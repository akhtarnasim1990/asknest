import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { ImportResult, QuestionType } from './dto/question.type';
import { CreateQuestionInput, UpdateQuestionInput } from './dto/question.input';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@Resolver(() => QuestionType)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  @Query(() => [QuestionType])
  async questions() {
    return this.questionService.findAll();
  }
  @Query(() => [QuestionType])
  async questionsByCategory(@Args('category', { type: () => String }) category: string) {
    return this.questionService.findByCategory(category);
  }

  @Query(() => QuestionType)
  async question(@Args('id', { type: () => ID }) id: string) {
    return this.questionService.findOne(id);
  }

  @Mutation(() => QuestionType)
  async createQuestion(@Args('createQuestionInput') createQuestionInput: CreateQuestionInput) {
    return this.questionService.create(createQuestionInput);
  }

  @Mutation(() => QuestionType)
  async updateQuestion(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ) {
    return this.questionService.update(id, updateQuestionInput);
  }

  @Mutation(() => QuestionType)
  async removeQuestion(@Args('id', { type: () => ID }) id: string) {
    return this.questionService.remove(id);
  }

//   @Mutation(() => String)
// //   @Mutation(() => ImportResult)
// //   @UseInterceptors(FileInterceptor('file'))
//   async bulkImportQuestions(
//     @Args('file', { type: () => GraphQLUpload }) file: any,
//     @Args('fileType', { type: () => String }) fileType: string,

//   ) {
//     return this.questionService.uploadFiles(file, fileType)
//   }

  @Mutation(() => ImportResult)
  async csvUpload(
    @Args({name: "file", type: () => GraphQLUpload }) file: FileUpload
  ){
    const data = this.questionService.uploadFiles(file, "csv");
    console.log("data", data);
    return data;
  }
}
