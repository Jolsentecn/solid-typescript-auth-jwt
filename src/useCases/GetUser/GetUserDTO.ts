export interface GetUserRequestDTO {
    authorization: string
}

export interface GetUserResponseDTO {
    id: string,
    name: string,
    email: string,
    permissions: string
}