import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  /**
   * Create a new book.
   * @param createBookDto Data for creating a new book.
   * @returns Created book data.
   * @throws UnprocessableEntityException if ISBN already exists.
   * @throws BadRequestException if price is invalid.
   */
  async create(createBookDto: CreateBookDto): Promise<Book> {
    if (!this.validatePrice(createBookDto.price)) {
      throw new BadRequestException(
        'Price must be a valid number with 2 decimal places.',
      );
    }
    const bookExists = await this.bookRepository.findOne({
      where: { ISBN: createBookDto.ISBN },
    });
    if (bookExists) {
      throw new UnprocessableEntityException(
        'This ISBN already exists in the system.',
      );
    } else {
      const book = this.bookRepository.create(createBookDto);
      const newBook = await this.bookRepository.save(book);
      return newBook;
    }
  }

  /**
   * Find a book by ISBN.
   * @param ISBN ISBN of the book to find.
   * @returns Found book data.
   * @throws NotFoundException if book is not found.
   */
  async findByISBN(ISBN: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { ISBN } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  /**
   * Update a book by ISBN.
   * @param ISBN ISBN of the book to update.
   * @param updateBookDto Partial data for updating the book.
   * @returns Updated book data.
   * @throws NotFoundException if book is not found.
   * @throws BadRequestException if price is invalid.
   */
  async update(ISBN: string, updateBookDto: UpdateBookDto): Promise<Book> {
    if (!this.validatePrice(updateBookDto.price)) {
      throw new BadRequestException(
        'Price must be a valid number with 2 decimal places.',
      );
    }

    // Check if the book exists
    const book = await this.findByISBN(ISBN);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // Update the book with the data from updateBookDto
    await this.bookRepository.update({ ISBN }, updateBookDto);

    // Fetch and return the updated book
    return await this.bookRepository.findOne({
      where: { ISBN: updateBookDto.ISBN },
    });
  }

  validatePrice(price: number): boolean {
    return /^\d+(\.\d{1,2})?$/.test(price?.toString());
  }
}
