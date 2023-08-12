import {
    Document,
    FilterQuery,
    PipelineStage,
    Types,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from "mongoose";
import {
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseGetTotalOptions,
    IDatabaseManyOptions,
    IDatabaseRawOptions,
    IDatabaseSaveOptions,
    IDatabaseSoftDeleteManyOptions,
} from "../interfaces/database.interface";
import { DatabaseMongoEntityAbstract } from "./mongo/entities/database.mongo.entity.abstract";

export abstract class DatabaseBaseRepositoryAbstract<
    Entity extends DatabaseMongoEntityAbstract,
    EntityDocument extends Entity & Document<Types.ObjectId>
> {
    abstract findAll<T = EntityDocument>(
        find?: FilterQuery<Entity>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]>;

    abstract findOne<T = EntityDocument>(
        find: FilterQuery<Entity>,
        options?: IDatabaseFindOneOptions
    ): Promise<T | null>;

    abstract findAllDistinct<T = EntityDocument>(
        field: string,
        find?: FilterQuery<T>,
        options?: IDatabaseFindAllOptions
    ): Promise<T[]>;

    abstract findOneById<T = EntityDocument>(
        _id: string,
        options?: IDatabaseFindOneOptions
    ): Promise<T | null>;

    abstract getTotal<T = EntityDocument>(
        find?: FilterQuery<T>,
        options?: IDatabaseGetTotalOptions
    ): Promise<number>;

    abstract exists<T = EntityDocument>(
        find: FilterQuery<T>,
        options?: IDatabaseExistOptions
    ): Promise<boolean>;

    abstract create<T = EntityDocument>(data: Entity, options?: IDatabaseCreateOptions): Promise<T>;

    abstract delete(document: EntityDocument, options?: IDatabaseSaveOptions): Promise<boolean>;

    abstract softDelete(document: EntityDocument): Promise<boolean>;

    abstract deleteManyByIds(_id: string[], options?: IDatabaseManyOptions): Promise<boolean>;

    abstract deleteMany(
        find: FilterQuery<Entity>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;

    abstract softDeleteManyByIds(
        _id: string[],
        options?: IDatabaseSoftDeleteManyOptions
    ): Promise<boolean>;

    abstract softDeleteMany(
        find: FilterQuery<Entity>,
        options?: IDatabaseSoftDeleteManyOptions
    ): Promise<boolean>;

    abstract updateMany(
        find: FilterQuery<Entity>,
        data: Entity,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;

    abstract updateManyRaw(
        find: FilterQuery<Entity>,
        data: UpdateWithAggregationPipeline | UpdateQuery<Entity>,
        options?: IDatabaseManyOptions
    ): Promise<boolean>;

    abstract raw<RawResponse, RawQuery = PipelineStage[]>(
        rawOperation: RawQuery,
        options?: IDatabaseRawOptions
    ): Promise<RawResponse[]>;
}
