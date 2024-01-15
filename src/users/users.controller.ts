import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesSuperAdminGuard, RolesAdminSuperAdminGuard } from 'src/auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @RolesAdminSuperAdminGuard()
  @Get()
  findAll() {
    return this.usersService.findAll({}, { password: false });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ _id: id }, { password: false });
  }

  @RolesSuperAdminGuard()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({ _id: id }, updateUserDto);
  }

  @RolesSuperAdminGuard()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove({ _id: id });
  }
}
