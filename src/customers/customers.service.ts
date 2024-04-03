import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  /**
   * Create a new customer.
   * @param createCustomerDto Data for creating a new customer.
   * @returns Created customer data.
   * @throws UnprocessableEntityException if user ID already exists.
   */
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { userId } = createCustomerDto;
    const existingCustomer = await this.customerRepository.findOne({
      where: { userId },
    });
    if (existingCustomer) {
      throw new UnprocessableEntityException(
        'This user ID already exists in the system.',
      );
    }
    const newCustomer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(newCustomer);
  }

  /**
   * Find a customer by ID.
   * @param id ID of the customer to find.
   * @returns Found customer data.
   * @throws NotFoundException if customer is not found.
   */
  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  /**
   * Find a customer by user ID.
   * @param userId User ID of the customer to find.
   * @returns Found customer data.
   * @throws NotFoundException if customer is not found.
   */
  async findUserByUserId(userId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { userId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }
}
