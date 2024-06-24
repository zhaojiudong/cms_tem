
import {
  Body,
  Controller,
  Get,
  Post,
  Query
} from '@nestjs/common';
import { AjaxResult } from 'src/modules/core/class/ajax-result';
import { CreateUserDto, ListUserDto } from './dto/user.dto';
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


  /**
 * 添加用户
 * @param user 用户信息
 */
  @Post('add')
  // @Log({ title: '用户管理', operType: OperType.INSERT })
  // @RequirePermissions('system:user:add')
  async add(@Body() user: CreateUserDto): Promise<AjaxResult> {
    if (!(await this.userService.checkUserNameUnique(user))) {
      return AjaxResult.error(`新增用户${user.userName}失败，登录账号已存在`)
    }

    if (!(await this.userService.checkUserEmailUnique(user))) {
      return AjaxResult.error(`新增用户${user.userName}失败，邮箱账号已存在`)
    }

    if (!(await this.userService.checkUserPhoneUnique(user))) {
      return AjaxResult.error(`新增用户${user.userName}失败，手机号码已存在`)
    }

    return AjaxResult.success(await this.userService.add(user))
  }

}