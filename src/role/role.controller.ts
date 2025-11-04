import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  // ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  // Query,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/api-key/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/api-key/jwt-auth.guard';

@ApiTags('role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles(Role.Admin) // Requires 'admin' role
  find() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin) // Requires 'admin' role
  findOne(@Param('id') id: string) {
    return this.roleService.findById(id);
  }

  @Post()
  @Roles(Role.Admin) // Requires 'admin' role
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Patch(':id')
  @Roles(Role.Admin) // Requires 'admin' role
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(Role.Admin) // Requires 'admin' role
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
