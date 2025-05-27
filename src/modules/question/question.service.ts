import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question } from './question.schema';
import { CreateQuestionInput, UpdateQuestionInput } from './dto/question.input';
import { CategoryService } from '../category/category.service';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import * as XLSX from 'xlsx';

@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    private categoryService: CategoryService,
  ) {}

  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    const created = new this.questionModel(createQuestionInput);
    return created.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel
      .find()
      .populate('categories')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCategory(category: string): Promise<Question[]> {
    return this.questionModel
      .find()
      .populate('categories')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel
      .findById(id)
      .populate('categories')
      .exec();
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(
    id: string,
    updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    const updated = await this.questionModel
      .findByIdAndUpdate(id, updateQuestionInput, { new: true })
      .populate('categories')
      .exec();
    if (!updated) throw new NotFoundException('Question not found');
    return updated;
  }

  async remove(id: string): Promise<Question> {
    const deleted = await this.questionModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Question not found');
    return deleted;
  }

  //   async bulkImportFromCSV(filePath: string): Promise<{ success: number; errors: string[] }> {
  //     const results: any = [];
  //     const errors = [];
  //     let successCount = 0;

  //     return new Promise((resolve, reject) => {
  //       createReadStream(filePath)
  //         .pipe(parse({ columns: true, trim: true }))
  //         .on('data', (row) => results.push(row))
  //         .on('error', (err) => reject(err))
  //         .on('end', async () => {
  //           for (const [index, row] of results.entries()) {
  //             try {
  //               const categories = await this.processCategories(row.categories);

  //               await this.questionModel.create({
  //                 content: row.content,
  //                 options: row.options.split(',').map(o => o.trim()),
  //                 correctOption: row.correctOption.trim(),
  //                 categories
  //               });

  //               successCount++;
  //             } catch (error: any) {
  //             //   errors.push(`Row ${index + 1}: ${error.message}`);
  //               this.logger.error(`Error processing row ${index + 1}:`, error);
  //             }
  //           }
  //           resolve({ success: successCount, errors });
  //         });
  //     });
  //   }

  //   private async processCategories(categoryNames: string): Promise<string[]> {
  //     const categories: any = [];
  //     for (const name of categoryNames.split(',').map(n => n.trim())) {
  //       const category = await this.categoryService.findOrCreate(name);
  //       categories.push(category._id);
  //     }
  //     return categories;
  //   }

  async uploadFiles(file: FileUpload, fileType: string): Promise<any> {
    const { createReadStream, filename, mimetype } = file;
    return "true";
    const memeTypes = [
      'application/vnd.ms-excel',
      'application/msexcel',
      'application/x-msexcel',
      'application/x-ms-excel',
      'application/x-excel',
      'application/x-dos_ms_excel',
      'application/xls',
      'application/x-xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv',
      'application/vnd.ms-excel',
      'text/x-csv',
      'application/x-csv',
      'text/comma-separated-values',
      'text/x-comma-separated-values',
      'text/tab-separated-values',
    ];
    // Only process CSV files
    if (
      (!memeTypes.includes(mimetype) && fileType !== 'excel') ||
      (!memeTypes.includes(mimetype) && fileType !== 'csv')
    ) {
      throw new Error('Only CSV or EXCEL files are supported.');
    }
    const [mimeType, mimeSubtype] = mimetype.split('/');
    return new Promise((resolve, reject) => {
      const chunks: any = [];
      const stream = createReadStream();
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet);
          resolve(data);
          // return ;
        } catch (error) {
          console.error('Error processing file:', error);
          throw new Error(error);
        }
      });
      stream.on('error', (err) => {
        console.error('Stream error:', err);
        throw new Error(err.message);
      });
    });
  }
}
