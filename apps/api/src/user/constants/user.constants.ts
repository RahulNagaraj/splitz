import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from "@splitz/api/shared";

export const USER_DEFAULT_PAGE = 1;
export const USER_DEFAULT_PER_PAGE = 10;
export const USER_DEFAULT_ORDER_BY = "createdAt";
export const USER_DEFAULT_ORDER_DIRECTION = ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC;
export const USER_DEFAULT_AVAILABLE_SEARCH = ["firstName", "lastName", "email", "username"];
export const USER_DEFAULT_AVAILABLE_ORDER_BY = ["firstName", "lastName", "username", "createdAt"];
