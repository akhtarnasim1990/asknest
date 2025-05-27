import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryInput, UpdateCategoryInput } from './dto/category.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const existing = await this.categoryModel.findOne({ name: createCategoryInput.name });
    if (existing) {
      throw new ConflictException('Category name already exists');
    }
    const created = new this.categoryModel(createCategoryInput);
    return created.save();
  }

  async findCategoriesWithQuestions() {
    return this.categoryModel.aggregate([
      {
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: 'categories',
          as: 'questions',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          questions: 1,
        },
      },
    ]);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Category> {
    const cat = await this.categoryModel.findById(id).exec();
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    const updated = await this.categoryModel.findByIdAndUpdate(id, updateCategoryInput, { new: true }).exec();
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async remove(id: string): Promise<Category> {
    const deleted = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Category not found');
    return deleted;
  }

  async findCategoriesWithQuestionCount() {
    return this.categoryModel.aggregate([
      {
        $lookup: {
          from: 'questions', // MongoDB collection name for questions
          localField: '_id',
          foreignField: 'categories',
          as: 'questions',
        },
      },
      {
        $addFields: {
          questionsCount: { $size: '$questions' },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          questionsCount: 1,
        },
      },
    ]);
  }

  async findOrCreate(name: string): Promise<Category> {
    const existing = await this.categoryModel.findOne({ name }).lean();
    if (existing) return existing;
    
    return this.categoryModel.create({ name });
  }
}
