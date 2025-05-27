import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryType, CategoryWithQuestionCountType, CategoryWithQuestionsType } from './dto/category.type';
import { CreateCategoryInput, UpdateCategoryInput } from './dto/category.input';

@Resolver(() => CategoryType)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryType])
  async categories() {
    return this.categoryService.findAll();
  }

  @Query(() => [CategoryWithQuestionsType])
  async categoriesWithQuestions() {
    // Map _id to id for GraphQL compatibility
    const categories = await this.categoryService.findCategoriesWithQuestions();
    return categories.map(cat => ({
      id: cat._id,
      name: cat.name,
      description: cat.description,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      questions: cat.questions,
    }));
  }

  @Query(() => CategoryType)
  async category(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => CategoryType)
  async createCategory(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput) {
    return this.categoryService.create(createCategoryInput);
  }

  @Mutation(() => CategoryType)
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(id, updateCategoryInput);
  }

  @Mutation(() => CategoryType)
  async removeCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.remove(id);
  }

  @Query(() => [CategoryWithQuestionCountType])
  async categoriesWithQuestionCount() {
    const categories = await this.categoryService.findCategoriesWithQuestionCount();
    // Map _id to id for GraphQL compatibility
    return categories.map(cat => ({
      id: cat._id,
      name: cat.name,
      description: cat.description,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
      questionsCount: cat.questionsCount,
    }));
  }
}
