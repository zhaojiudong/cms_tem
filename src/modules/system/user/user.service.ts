import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmpty } from 'class-validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';

import { ListUserDto } from "./dto/user.dto";
import { SysUser } from './entries/sys-user.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(SysUser)
    private userRepository: Repository<SysUser>
  ) { }
  /**
  * 用户列表
  * @param user 用户信息
  * @returns 用户列表
  */
  async list(user: ListUserDto): Promise<any> {
    return paginate<SysUser>(
      this.userRepository,
      {
        page: user.page,
        limit: user.limit,
      },
      {
        where: {
          status: user.status,
          deptId: user.deptId,
          userName: isNotEmpty(user.userName) ? Like(`%${user.userName}%`) : undefined,
          nickName: isNotEmpty(user.nickName) ? Like(`%${user.nickName}%`) : undefined,
        },
      }
    )
  }
}