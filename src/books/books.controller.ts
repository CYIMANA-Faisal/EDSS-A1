import { Controller, Get, Post, Param, Body, Put, Res } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { Book } from './entities/book.entity';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * Endpoint to create a new book.
   * @param createBookDto Data for creating a new book.
   * @param res Express Response object.
   * @returns Created book data.
   */
  @ApiCreatedResponse({
    description: 'The book has been successfully added.',
    type: Book,
  })
  @ApiUnprocessableEntityResponse({
    description: 'This ISBN already exists in the system.',
  })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookDto: CreateBookDto, @Res() res: Response) {
    const book = await this.booksService.create(createBookDto);
    const { ISBN } = book;
    res.status(HttpStatus.CREATED).location(`/books/${ISBN}`).json(book);
  }

  /**
   * Endpoint to find a book by ISBN.
   * @param ISBN ISBN of the book to find.
   * @returns Found book data.
   */
  @ApiOkResponse({
    description: 'Found book data by ISBN',
    type: Book,
  })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ApiParam({ name: 'ISBN', description: 'The ISBN of the book to find' })
  @Get('isbn/:ISBN')
  @HttpCode(HttpStatus.OK)
  findByISBN(@Param('ISBN') ISBN: string): Promise<Book> {
    return this.booksService.findByISBN(ISBN);
  }

  /**
   * Endpoint to find a book by ISBN.
   * @param ISBN ISBN of the book to find.
   * @returns Found book data.
   */
  @ApiOkResponse({ description: 'Found book data by ISBN', type: Book })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ApiParam({ name: 'ISBN', description: 'The ISBN of the book to find' })
  @Get(':ISBN')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('ISBN') ISBN: string): Promise<Book> {
    return this.booksService.findByISBN(ISBN);
  }

  /**
   * Endpoint to update a book by ISBN.
   * @param ISBN ISBN of the book to update.
   * @param updateBookDto Data for updating the book.
   * @returns Updated book data.
   */
  @ApiOkResponse({ description: 'Book updated', type: Book })
  @ApiNotFoundResponse({ description: 'Book not found' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @ApiParam({ name: 'ISBN', description: 'The ISBN of the book to update' })
  @Put(':ISBN')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('ISBN') ISBN: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(ISBN, updateBookDto);
  }
}
