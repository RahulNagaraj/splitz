import { applyDecorators } from "@nestjs/common";
import { UserListSerialization } from "../serializations/user.list.serialization";
import { SwaggerDoc, SwaggerDocRequest, SwaggerDocResponsePaging } from "@splitz/api/swagger";

export function UserListDoc(): MethodDecorator {
    return applyDecorators(
        SwaggerDoc({
            operation: "User List",
            description: "Get list of users",
        }),
        SwaggerDocRequest(),
        SwaggerDocResponsePaging<UserListSerialization>({
            serialization: UserListSerialization,
            statusCode: 200,
        })
    );
}
