import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SysUser } from "./entries/sys-user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([SysUser])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})






export class UserModule { }