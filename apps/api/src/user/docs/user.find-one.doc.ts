import { HttpStatus, applyDecorators } from "@nestjs/common";
import { Doc, DocRequest, DocResponse } from "@splitz/api/shared";

export function FindOneUserDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: "Fine one user",
            description: "Get one user",
        }),
        DocRequest({
            params: [{ type: String, name: "userId" }],
        }),
        DocResponse({
            statusCode: 200,
            httpStatus: HttpStatus.OK,
        }),
        DocResponse({
            statusCode: 404,
            httpStatus: HttpStatus.NOT_FOUND,
        })
    );
}
