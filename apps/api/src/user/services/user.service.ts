import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/repository/user.repository";
import { FilterQuery, Types } from "mongoose";
import { CreateUserDto } from "../dto/user.create-user.dto";
import { UserEntity } from "../repositories/entities/user.entity";
import { IDatabaseFindAllOptions, IDatabaseGetTotalOptions } from "@splitz/api/shared";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findAll(find?: FilterQuery<UserEntity>, options?: IDatabaseFindAllOptions) {
        return this.userRepository.findAll(find, options);
    }

    async findOne(id: string) {
        const uid = new Types.ObjectId(id);
        const user = await this.userRepository.findOne({ _id: uid });

        if (!user) {
            throw new NotFoundException("Could not find the user.");
        }

        return user;
    }

    async create(createUserDto: CreateUserDto) {
        const user = new UserEntity(createUserDto);
        this.userRepository.create(user);
    }

    async getTotal(find?: FilterQuery<UserEntity>, options?: IDatabaseGetTotalOptions) {
        return this.userRepository.getTotal(find, options);
    }
}
