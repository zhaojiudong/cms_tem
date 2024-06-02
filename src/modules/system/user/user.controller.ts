
import {
  Controller,
  Get,
  Query
} from '@nestjs/common';
import { AjaxResult } from 'src/modules/core/class/ajax-result';
import { ListUserDto } from './dto/user.dto';
import { UserService } from "./user.service";



/**
 * 用户管理
 * @author dong
 */

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    // private securityContext: SecurityContext
  ) { }


  /**
 * 用户列表
 * @param user 用户信息
 * @returns 用户列表
 */
  @Get('list')
  // @RequirePermissions('system:user:list')
  async list(@Query() user: ListUserDto): Promise<AjaxResult> {
    return AjaxResult.success(await this.userService.list(user))
  }


}