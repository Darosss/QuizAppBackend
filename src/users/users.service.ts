import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashString } from 'src/auth/auth.helpers';

type FilterQueryUserType = FilterQuery<User>;
type ProjectionUserType = ProjectionType<User>;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}
  async create({ password, ...rest }: CreateUserDto) {
    const hashedPassword = await hashString(password);
    const createdCategory = new this.userModel({
      password: hashedPassword,
      ...rest,
    });
    return createdCategory.save();
  }

  findAll(
    filter?: FilterQueryUserType,
    projection: ProjectionUserType = { password: false },
  ) {
    return this.userModel.find(filter, projection).exec();
  }

  async findOne(
    filter: FilterQueryUserType,
    projection: ProjectionUserType = { password: false },
  ): Promise<User> {
    const foundUser = await this.userModel.findOne(filter, projection).exec();

    if (!foundUser)
      throw new NotFoundException({
        message: `User not found`,
      });

    return foundUser;
  }

  update(filter: FilterQueryUserType, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      filter,
      { new: true },
      updateUserDto,
    );
  }

  remove(filter: FilterQueryUserType) {
    return this.userModel.findByIdAndDelete(filter);
  }
}
