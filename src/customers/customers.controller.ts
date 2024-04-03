import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Res,
  Query,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Response } from 'express';
import { UserIdDto } from './dto/user-id.dto';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * Endpoint to create a new customer.
   * @param createCustomerDto Data for creating a new customer.
   * @param res Express Response object.
   * @returns Created customer data.
   */
  @ApiCreatedResponse({
    description: 'The customer has been successfully created.',
    type: CreateCustomerDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Res() res: Response,
  ) {
    const customer = await this.customersService.create(createCustomerDto);
    const { id } = customer;
    res.status(HttpStatus.CREATED).location(`/customers/${id}`).json(customer);
  }

  /**
   * Endpoint to find a customer by ID.
   * @param id ID of the customer to find.
   * @returns Found customer data.
   */
  @ApiOkResponse({
    description: 'Found customer data by ID',
    type: CreateCustomerDto,
  })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @ApiParam({ name: 'id', description: 'The ID of the customer to find' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.customersService.findOne(+id);
  }

  /**
   * Endpoint to find a user by user ID.
   * @param userIdDto Data containing the user ID.
   * @returns Found customer data.
   */
  @ApiOkResponse({
    description: 'Found customer data by user ID',
    type: CreateCustomerDto,
  })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @ApiBadRequestResponse({ description: 'Invalid request data' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findUserByUserId(@Query(ValidationPipe) userIdDto: UserIdDto) {
    return await this.customersService.findUserByUserId(userIdDto.userId);
  }
}
