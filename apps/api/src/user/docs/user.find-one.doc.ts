import { HttpStatus, applyDecorators } from "@nestjs/common";
import { SwaggerDoc, SwaggerDocRequest, SwaggerDocResponse } from "@splitz/api/swagger";

export function FindOneUserDoc(): MethodDecorator {
    return applyDecorators(
        SwaggerDoc({
            operation: "Fine one user",
            description: "Get one user",
        }),
        SwaggerDocRequest({
            params: [{ type: String, name: "userId" }],
        }),
        SwaggerDocResponse({
            statusCode: 200,
            httpStatus: HttpStatus.OK,
        }),
        SwaggerDocResponse({
            statusCode: 404,
            httpStatus: HttpStatus.NOT_FOUND,
        })
    );
}
