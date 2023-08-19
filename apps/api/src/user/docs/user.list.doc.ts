import { applyDecorators } from "@nestjs/common";
import { Doc, DocRequest, DocResponsePaging } from "@splitz/api/shared";
import { UserListSerialization } from "../serializations/user.list.serialization";

export function UserListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: "User List",
            description: "Get list of users",
        }),
        DocRequest(),
        DocResponsePaging<UserListSerialization>({
            serialization: UserListSerialization,
            statusCode: 200,
        })
    );
}
